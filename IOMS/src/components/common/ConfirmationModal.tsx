import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";

type ConfirmationModalProps = {
    modalData: {
        text1: string;
        text2?: string;
        btn1Text: string;
        btn2Text: string;
        btn1Handler: () => void;
        btn2Handler: () => void;
        isOpen: boolean;
    };
};

export default function ConfirmationModal({
    modalData,
}: ConfirmationModalProps) {
    const {
        text1,
        text2,
        btn1Text,
        btn2Text,
        btn1Handler,
        btn2Handler,
        isOpen,
    } = modalData;

    return (
        <Dialog
            open={isOpen}
            onClose={btn2Handler}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    padding: 2,
                    width: "100%",
                    maxWidth: 400,
                },
            }}
        >
            <DialogTitle id="confirmation-dialog-title">
                <Typography variant="h6" component="span" fontWeight={600}>
                    {text1}
                </Typography>
            </DialogTitle>

            {text2 && (
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        {text2}
                    </Typography>
                </DialogContent>
            )}

            <DialogActions sx={{ paddingX: 3, paddingBottom: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={btn1Handler}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            backgroundColor: "blue",
                            "&:hover": {
                                backgroundColor: "primary.main",
                            },
                        }}
                    >
                        {btn1Text}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={btn2Handler}
                        sx={{ textTransform: "none" }}
                    >
                        {btn2Text}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
