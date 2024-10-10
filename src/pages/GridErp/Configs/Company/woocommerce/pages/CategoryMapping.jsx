import React, { useState, useEffect } from 'react';
import { Typography, Button, Snackbar, ThemeProvider, createTheme, FormControl, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import BreadCrumb from '../../../../Products/components/BreadCrumb';
import { Container, MappingContainer, ColumnHeaders, MappingRow, Column } from './CategoryMapping.styles';
import { ProductHelper } from '../../../../Products/helper/product_helper';
import * as url from '../helper/url_helper';

const productHelper = new ProductHelper();
// Crear un tema personalizado
const theme = createTheme();

// Supongamos que estas son las categorías que obtienes de tu backend
// Ahora usamos objetos con label y value para nuestras categorías
const internalCategoriesMock = [
  { label: 'Electrónicos', value: 'electronics' },
  { label: 'Ropa', value: 'clothing' },
  { label: 'Hogar', value: 'home' },
  { label: 'Deportes', value: 'sports' },
  { label: 'Libros', value: 'books' }
];

const wooCommerceCategoriesMock = [
  { label: 'Electronics', value: 'wc_electronics' },
  { label: 'Apparel', value: 'wc_apparel' },
  { label: 'Home & Living', value: 'wc_home' },
  { label: 'Sports & Outdoors', value: 'wc_sports' },
  { label: 'Books & Media', value: 'wc_books' }
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CategoryMapping() {
  const [mappings, setMappings] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [internalCategories, setInternalCategories] = useState([]);
  const [wooCommerceCategories, setWooCommerceCategories] = useState(wooCommerceCategoriesMock);
  const [openBackdrop, setOpenBackdrop] = useState(true);

  useEffect(() => {
    validateMappings();
  }, [mappings]);

  useEffect(() => {
    productHelper.getCategoriesFullByCompanySelect(url.companyId)
      .then(response => {
        if (response.data) {
          let internalCategories = response.data.map(cat => {
            return {
              label: cat.label,
              value: cat.value
            }
          });
          setInternalCategories(internalCategories);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setOpenBackdrop(false);
      });
  }, []);

  const handleMapping = (internalCategoryValue, wooCommerceCategoryValue) => {
    console.log('internalCategoryValue', internalCategoryValue);
    console.log('wooCommerceCategoryValue', wooCommerceCategoryValue);
    
    setMappings(prev => ({
      ...prev,
      [internalCategoryValue]: wooCommerceCategoryValue
    }));
  };

  const validateMappings = () => {
    const allMapped = internalCategories.every(cat => mappings[cat.value]);
    setIsValid(allMapped);
  };

  const saveMapping = () => {
    if (isValid) {
      console.log('Mapeo guardado:', mappings);
      setSnackbarMessage('Mapeo guardado exitosamente');
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('Por favor, mapea todas las categorías antes de guardar');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="page-content">
      <BreadCrumb title="Mapeo de categorías" pageTitle="Woocommerce" />

      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container>
        <MappingContainer elevation={3}>
          <ColumnHeaders>
            <Column>
              <Typography variant="h6">Categorías Internas</Typography>
            </Column>
            <Column>
              <Typography variant="h6">Categorías WooCommerce</Typography>
            </Column>
          </ColumnHeaders>
          {internalCategories.map((internalCat) => (
            <MappingRow key={internalCat.value}>
              <Column>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{internalCat.label}</Typography>
              </Column>
              <Column>
                <FormControl fullWidth>
                  <Select
                    labelId={`select-label-${internalCat.value}`}
                    value={mappings[internalCat.value] || ''}
                    onChange={(e) => handleMapping(internalCat.value, e.target.value)}
                  >
                    {wooCommerceCategories.map((wooCat) => (
                      <MenuItem key={wooCat.value} value={wooCat.value}>{wooCat.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Column>
            </MappingRow>
          ))}
        </MappingContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={saveMapping}
          disabled={!isValid}
        >
          Guardar Mapeo
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

// Wrap the component with ThemeProvider
export default function ThemedCategoryMapping() {
  return (
    <ThemeProvider theme={theme}>
      <CategoryMapping />
    </ThemeProvider>
  );
}