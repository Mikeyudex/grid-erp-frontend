import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Alert,
    AlertTitle,
    Box,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const ResponseModal = ({
    responseData,
    openModal,
    setOpenModal,
    setOpenBackdrop,
    handleClose,
    dialogTitle,
    alertTitle,
    alertTitleMessage,
    cardTitle,
    cardSubheader,
    cardContentTitleOne,
    cardContentTitleTwo,
}) => {

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenBackdrop(false);
        handleClose();
    };


    return (

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        <Alert severity="info">
                            <AlertTitle>{alertTitle}</AlertTitle>
                            {alertTitleMessage}
                        </Alert>
                    </Box>
                    <Card sx={{ mt: 2 }}>
                        <CardHeader
                            title={cardTitle}
                            subheader={cardSubheader}
                        />
                        <CardContent>
                            {responseData.results.map((result, index) => (
                                <Alert
                                    key={'alert' + index}
                                    severity={result.status === 'success' ? 'success' : 'error'}
                                    icon={result.status === 'success' ? <CheckIcon /> : <CloseIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    <AlertTitle key={'alertTitle' + index}>{result.status === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
                                    <Typography key={'alertMessage' + index} variant="body2">
                                        <strong key={'alertMessage-strong' + index}>{cardContentTitleOne}:</strong> {result.product}
                                        <br key={'alertMessage-br' + index} />
                                        <strong key={'alertMessage-strong-2' + index}>{cardContentTitleTwo}:</strong> {result.message}
                                    </Typography>
                                </Alert>
                            ))}
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

    );
};

export default ResponseModal;