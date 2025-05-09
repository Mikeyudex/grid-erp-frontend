import * as React from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { ImportProductContext } from '../context/imports/importProductContext';
import Dropzone from 'react-dropzone';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { APIClient } from '../../../../helpers/api_helper';
import * as url from '../helper/url_helper';
import { BackdropGlobal } from './Backdrop';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../helper/product_helper';
import { useSnackbar } from 'react-simple-snackbar';

const apiClient = new APIClient();

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

/**
  * Formats the size
  */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function DrawerProductsImport({
}) {
    const navigate = useNavigate();
    const { updateImportData, importData } = React.useContext(ImportProductContext);
    const [selectedFiles, setselectedFiles] = React.useState([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);

    function handleAcceptedFiles(files) {
        files.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setselectedFiles(files);
    }

    function handleDeleteFile(fileName) {
        setselectedFiles(selectedFiles.filter(f => f.name !== fileName));
    }

    function handleCloseBackdrop() {
        setOpenBackdrop(false);
    }

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        updateImportData({ ...importData, openDrawer: open });
        setselectedFiles([]);
    };

    React.useEffect(() => {
    }, [importData?.openDrawer]);

    const handlesubmit = async () => {
        try {
            setOpenBackdrop(true);
            let file = selectedFiles[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
            let response = await apiClient.create(`${url.IMPORT_PRODUCTS}/${url.companyId}/${localStorage.getItem("userId")}`, formData, config);
            if (response?.success) {
                setTimeout(() => {
                    console.log(response?.message);
                    toggleDrawer(false);
                    openSnackbarSuccess('Archivo cargado exitosamente');
                    return navigate('/uploads');
                }, 3500);
            }
        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error al importar el archivo');
        } finally {
            setTimeout(() => {
                setselectedFiles([]);
                setOpenBackdrop(false);
            }, 3000);
        }
    };

    return (
        <div>
            <React.Fragment>
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
                        <Container fluid>
                            <BackdropGlobal openBackdrop={openBackdrop} handleClose={handleCloseBackdrop} title="Importando productos..." />
                            <Row>
                                <Col lg={12}>
                                    <Card>
                                        <CardBody>
                                            <p className="text-muted">Ten en cuenta que debes subir la plantilla especial para Importar productos, en formato xlsx.</p>
                                            <Dropzone
                                                accept={{
                                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': []
                                                }}
                                                maxFiles={1}
                                                multiple={false}
                                                onDrop={acceptedFiles => {
                                                    handleAcceptedFiles(acceptedFiles);
                                                }}
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    <  >
                                                        <div className="dropzone dz-clickable cursor-pointer">
                                                            <div
                                                                className="dz-message needsclick"
                                                                {...getRootProps()}
                                                            >
                                                                <div className="mb-3">
                                                                    <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                                </div>
                                                                <h4>Arrastra tu plantilla de productos aquí o <span className="filepond--label-action">Buscar</span></h4>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </Dropzone>
                                            <div className="list-unstyled mb-0" id="file-previews">
                                                {selectedFiles.map((f, i) => {
                                                    return (
                                                        <Card
                                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                            key={i + "-file"}
                                                        >
                                                            <div className="p-2">
                                                                <Row className="align-items-center">
                                                                    <Col className="col-auto">
                                                                        <img
                                                                            data-dz-thumbnail=""
                                                                            height="80"
                                                                            className="avatar-sm rounded bg-light"
                                                                            alt={f.name}
                                                                            src={'https://cdn-icons-png.flaticon.com/128/8243/8243073.png'}
                                                                        />
                                                                    </Col>
                                                                    <Col>
                                                                        <Link
                                                                            to="#"
                                                                            className="text-muted font-weight-bold"
                                                                        >
                                                                            {f.name}
                                                                        </Link>
                                                                        <p className="mb-0">
                                                                            <strong>{f.formattedSize}</strong>
                                                                        </p>
                                                                    </Col>

                                                                    <Col className="col-auto">
                                                                        <Button variant="contained" color='error' onClick={() => handleDeleteFile(f.name)}>Eliminar</Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                        </Container>

                        <div className='px-3 py-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className='px-2' >
                                <Button className='px-3 m-2' variant="outlined" onClick={toggleDrawer(false)}>Cancelar</Button>
                                <Button className='px-3 m-2' variant="contained" onClick={handlesubmit}>Importar</Button>
                            </div>
                        </div>
                    </Box>
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
