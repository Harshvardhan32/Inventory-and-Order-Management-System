from rest_framework import serializers
from .models import User, Product, Customer, Order, OrderedItem
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "name", "email", "phone_number", "password", "confirm_password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProductSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.email")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "SKU",
            "price",
            "stock",
            "status",
            "units_sold",
            "created_by",
            "created_at",
            "updated_at",
        ]


class OrderedItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product", write_only=True
    )

    class Meta:
        model = OrderedItem
        fields = ["id", "product", "product_id", "quantity", "price_at_order_time"]


class CustomerOrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderedItem
        fields = ["id", "product", "quantity", "price_at_order_time"]


class CustomerOrderSerializer(serializers.ModelSerializer):
    items = CustomerOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "order_id", "date", "status", "total_items", "items"]


class CustomerSerializer(serializers.ModelSerializer):
    orders = CustomerOrderSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source="created_by.email")

    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "address",
            "orders",
            "created_by",
            "created_at",
            "updated_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderedItemSerializer(many=True)
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source="customer", write_only=True
    )
    created_by = serializers.ReadOnlyField(source="created_by.email")

    class Meta:
        model = Order
        fields = [
            "id",
            "order_id",
            "date",
            "customer",
            "customer_id",
            "status",
            "total_items",
            "items",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        validated_data["created_by"] = self.context["request"].user
        order = Order.objects.create(**validated_data)

        from collections import defaultdict

        product_quantities = defaultdict(int)
        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]
            print(f"[DEBUG] Adding {quantity} of {product.name} to order")
            product_quantities[product] += quantity

        total_items = 0
        for product, quantity in product_quantities.items():
            print(f"[DEBUG] Processing product: {product.name}")
            print(f"[DEBUG] Available stock: {product.stock}")
            print(f"[DEBUG] Requested quantity: {quantity}")
            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for product {product.name}. Available: {product.stock}, required: {quantity}"
                )
            OrderedItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_order_time=product.price,
            )
            product.stock -= quantity
            print(f"[DEBUG] New stock for {product.name}: {product.stock}")
            product.save()
            total_items += quantity

        print(f"[DEBUG] Total items in order: {total_items}")
        order.total_items = total_items
        order.save()
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        instance.customer = validated_data.get("customer", instance.customer)
        instance.status = validated_data.get("status", instance.status)
        instance.date = validated_data.get("date", instance.date)

        if items_data is not None:
            print(f"[DEBUG] Restoring stock for existing items...")
            for ordered_item in instance.items.all():
                product = ordered_item.product
                print(f"[DEBUG] Restoring {ordered_item.quantity} to {product.name}")
                product.stock += ordered_item.quantity
                product.save()

            instance.items.all().delete()

            from collections import defaultdict

            product_quantities = defaultdict(int)
            for item in items_data:
                product = item["product"]
                quantity = item["quantity"]
                print(f"[DEBUG] Adding {quantity} of {product.name} to updated order")
                product_quantities[product] += quantity

            total_items = 0
            for product, quantity in product_quantities.items():
                print(f"[DEBUG] Updated order - checking stock for {product.name}")
                print(f"[DEBUG] Available stock: {product.stock}")
                print(f"[DEBUG] Requested quantity: {quantity}")
                if product.stock < quantity:
                    raise serializers.ValidationError(
                        f"Not enough stock for product {product.name}. Available: {product.stock}, required: {quantity}"
                    )
                OrderedItem.objects.create(
                    order=instance,
                    product=product,
                    quantity=quantity,
                    price_at_order_time=product.price,
                )
                product.stock -= quantity
                print(f"[DEBUG] New stock for {product.name}: {product.stock}")
                product.save()
                total_items += quantity

            instance.total_items = total_items

        instance.save()
        return instance
