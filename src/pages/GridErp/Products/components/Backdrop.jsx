import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export function BackdropGlobal({
    openBackdrop,
    handleClose
}) {

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={openBackdrop}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )

}