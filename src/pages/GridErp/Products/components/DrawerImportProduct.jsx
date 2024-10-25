import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { ImportProductContext } from '../context/imports/importProductContext';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Puller = styled('div')(({ theme }) => ({
    width: 50,
    height: 6,
    backgroundColor: grey[300],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
    ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
    }),
}));

export function DrawerProductsImport({
}) {
    const { updateImportData, importData } = React.useContext(ImportProductContext);
    
    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        updateImportData({ ...importData, openDrawer: open });
    };

    React.useEffect(() => {
        console.log(importData);
    }, [importData?.openDrawer]);


    return (
        <div>
            <React.Fragment>
                {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
                <SwipeableDrawer
                    anchor={'bottom'}
                    open={importData?.openDrawer}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <Box
                        sx={{
                            width: 'auto',
                            backgroundColor: 'white',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                        role="presentation"
                        /*  onClick={toggleDrawer(false)} */
                        onKeyDown={toggleDrawer(false)}
                    >
                        <Puller />
                        <div className='px-3 py-3 mt-2'>
                            <h5>Importar productos</h5>
                        </div>

                        <div className='px-3 py-3' style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div className='px-2' >
                                <Button variant="outlined" onClick={toggleDrawer(false)}>Cancelar</Button>
                            </div>
                            <div className='px-2'>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Subir archivo
                                    <VisuallyHiddenInput
                                        accept='.xls,.xlsx'
                                        type="file"
                                        onChange={(event) => console.log(event.target.files)}
                                        multiple
                                    />
                                </Button>
                            </div>
                        </div>


                    </Box>
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
