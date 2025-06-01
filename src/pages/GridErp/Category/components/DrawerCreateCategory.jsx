import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import { Col, Container, Row } from 'reactstrap';

import { APIClient } from '../../../../helpers/api_helper';
import * as url from '../helper/url_helper';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../Products/helper/product_helper';
import { useSnackbar } from 'react-simple-snackbar';
import { CategoryProductContext } from '../context/categoryProductContext';
import { BackdropGlobal } from '../../Products/components/Backdrop';
import LayoutTextInputs from '../../Products/partials/layouts/createProduct/LayoutTextInputs';
import GlobalInputText from '../../Products/partials/inputs/GlobalInputText';

const apiClient = new APIClient();
const initialFormData = {
    name: '',
    description: '',
    active: true,
    shortCode: '',
};

export function DrawerCreateCategory({
}) {
    const { updateCategoryData, categoryData } = React.useContext(CategoryProductContext);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [formData, setFormData] = React.useState(initialFormData);
    const [errors, setErrors] = React.useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleCloseBackdrop() {
        setOpenBackdrop(false);
    }

    function handleClearState() {
        setFormData(initialFormData);
        setErrors({});
    }

    function handleCloseDrawer() {
        setOpenBackdrop(false);
        toggleDrawer(false);
        handleClearState();
    }

    const toggleDrawer = (open) => {
        updateCategoryData({ ...categoryData, openDrawer: open });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Requerido';
        }
        /* if (!formData.description) {
            errors.description = 'Requerido';
        } */
        if (!formData.shortCode) {
            errors.shortCode = 'Requerido';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlesubmit = async () => {
        try {
            if (!validateForm()) return;
            setOpenBackdrop(true);
            let payload = {
                companyId: url.companyId,
                name: formData.name,
                description: formData.description,
                active: formData.active,
                shortCode: formData.shortCode,
            };
            let { data } = await apiClient.create(`${url.CREATE_CATEGORIES}`, payload);
            updateCategoryData({ ...categoryData, categoryList: [...categoryData.categoryList,  payload] });
            setTimeout(() => {
                handleCloseDrawer();
                openSnackbarSuccess('Categoría creada exitosamente');
            }, 1500);
        } catch (error) {
            console.log(error);
            setOpenBackdrop(false);
            openSnackbarDanger('Ocurrió un error al crear la categoría');
        }
    };

    React.useEffect(() => {
    }, [categoryData?.openDrawer]);

    return (
        <div>
            <React.Fragment>
                <SwipeableDrawer
                    anchor={'right'}
                    open={categoryData?.openDrawer}
                    onClose={handleCloseDrawer}
                    onOpen={() => toggleDrawer(true)}
                >
                    <Box
                        sx={{
                            width: 'auto',
                            backgroundColor: 'white',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                        role="presentation"
                    /* onKeyDown={toggleDrawer(false)} */
                    >
                        <div className='px-3 py-3 mt-2'>
                            <h5>Crear categoría</h5>
                        </div>
                        <Container fluid>
                            <BackdropGlobal openBackdrop={openBackdrop} handleClose={handleCloseBackdrop} title="Creando categoría..." />
                            <Row style={{ height: '75vh' }}>
                                <Col lg={12} >
                                    <Row>
                                        <Col md={12} xl={12}>
                                            <LayoutTextInputs
                                                title={""}
                                                item1={
                                                    <>
                                                        <div className="input-wrapper">
                                                            <label className='form-label' htmlFor="quantity">*Nombre:</label>
                                                            <GlobalInputText
                                                                name={'name'}
                                                                onChange={handleInputChange}
                                                                placeholder={'Nombre de la categoría'}
                                                                value={formData.name}
                                                                type={"text"}
                                                                className={"input-box"}
                                                                id={'name'}
                                                                required={true}
                                                            />
                                                        </div>
                                                        {errors.name && (<span className="form-product-input-error">{errors.name}</span>)}
                                                    </>
                                                }
                                                item2={
                                                    <>
                                                        <div className="input-wrapper">
                                                            <label className='form-label' htmlFor="quantity">Descripción:</label>
                                                            <GlobalInputText
                                                                name={'description'}
                                                                onChange={handleInputChange}
                                                                placeholder={'Descripción de la categoría'}
                                                                value={formData.description}
                                                                type={"text"}
                                                                className={"input-box"}
                                                                id={'description'}
                                                                required={false}
                                                            />
                                                        </div>
                                                        {errors.description && (<span className="form-product-input-error">{errors.description}</span>)}
                                                    </>
                                                }
                                                item3={
                                                    <>
                                                        <div className="input-wrapper">
                                                            <label className='form-label' htmlFor="quantity">*Código corto:</label>
                                                            <GlobalInputText
                                                                name={'shortCode'}
                                                                onChange={handleInputChange}
                                                                placeholder={'Código corto de la categoría'}
                                                                value={formData.shortCode}
                                                                type={"text"}
                                                                className={"input-box"}
                                                                id={'shortCode'}
                                                                required={true}
                                                            />

                                                        </div>
                                                        {errors.shortCode && (<span className="form-product-input-error">{errors.shortCode}</span>)}
                                                    </>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                        <div className='px-3 py-3' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className='px-2' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button className='px-3 m-2 ' variant="outlined" onClick={() => handleCloseDrawer()}>Cancelar</Button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button className='m-2' variant="contained" onClick={handlesubmit}> Guardar</Button>
                            </div>
                        </div>
                    </Box>
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}
