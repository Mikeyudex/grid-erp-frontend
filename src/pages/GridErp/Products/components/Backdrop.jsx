import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export function BackdropGlobal({
    openBackdrop,
    handleClose,
    title
}) {

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={openBackdrop}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
            <h4 style={{ textAlign: 'center', color: '#fff', padding: '0.5em', marginTop: '0.5em' }}>{title ?? "Cargando..."}</h4>
        </Backdrop>
    )

}