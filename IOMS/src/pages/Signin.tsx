import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { signIn } from "../services/apis/authApi";

const schema = z.object({
    email: z
        .string({ required_error: "Email is required!" })
        .min(1, "Email is required!")
        .email("Enter a valid email address."),
    password: z
        .string({ required_error: "Password is required!" })
        .min(8, "Password must be at least 8 characters."),
    remember: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const SignIn: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        const formData = {
            email: data.email,
            password: data.password,
        };
        try {
            await signIn(formData);
            navigate("/");
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <Box
            sx={{
                width: "100vw",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 2,
                paddingBottom: 2,
            }}
        >
            <Box
                sx={{
                    maxWidth: "400px",
                    width: "100%",
                    boxShadow: 3,
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Box textAlign={"center"}>
                    <Typography variant="h5" fontWeight={600}>
                        IOMS
                    </Typography>
                    <Typography fontSize={14}>
                        Inventory & Order Management System
                    </Typography>
                </Box>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <Box display={"flex"} flexDirection={"column"} gap={2}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontSize={15}
                                fontWeight={500}
                            >
                                Email
                            </Typography>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="email"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        sx={{
                                            border: "none",
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontSize={15}
                                fontWeight={500}
                            >
                                Password
                            </Typography>

                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        sx={{
                                            border: "none",
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Controller
                                name="remember"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                            />
                                        }
                                        label="Remember me"
                                        sx={{
                                            alignItems: "center",
                                            width: "fit-content",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: "blue",
                                border: "none",
                                color: "white",
                                textTransform: "none",
                                boxShadow: 2,
                                width: "100%",
                            }}
                        >
                            Log in
                        </Button>
                        <Typography textAlign={"center"}>
                            Don't have an account?{" "}
                            <Link to={"/admin/signup"}>Sign up</Link>
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default SignIn;
