import React, { useState, useEffect } from 'react';
import { Typography, Button, ThemeProvider, createTheme, FormControl, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { useSnackbar } from 'react-simple-snackbar';

import BreadCrumb from '../../../../Products/components/BreadCrumb';
import { Container, MappingContainer, ColumnHeaders, MappingRow, Column } from './CategoryMapping.styles';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../../../Stock/helper/stock_helper';
import * as url from '../helper/url_helper';
import { WooCommerceHelper } from '../helper/woocommerce_helper';
import { ProductHelper } from '../../../../Products/helper/product_helper';
import { APIClient } from '../../../../../../helpers/api_helper';

const productHelper = new ProductHelper();
const wooCommerceHelper = new WooCommerceHelper();
const apiClient = new APIClient();
// Crear un tema personalizado
const theme = createTheme();

function CategoryMapping() {
  const [mappings, setMappings] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [internalCategories, setInternalCategories] = useState([]);
  const [wooCommerceCategories, setWooCommerceCategories] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
  const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);

  useEffect(() => {
    validateMappings();
  }, [mappings]);

  useEffect(() => {
    (async () => {
      try {
        let internalCategories = await productHelper.getCategoriesFullByCompanySelect(url.companyId);
        let internalCategoriesMap = internalCategories.data.map(cat => { return { label: cat?.label, value: cat?.value } });
        setInternalCategories(internalCategoriesMap);
        openSnackbarSuccess('Categorías internas cargadas exitosamente');
      } catch (error) {
        console.log(error);
        openSnackbarDanger('Ocurrió un error al obtener las categorías :(', 'Intenta mas tarde');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let responseWoo = await wooCommerceHelper.getCategoriesWoocommerce(url.companyId);
        let successWoo = responseWoo?.success;
        let resultWoo = responseWoo?.result;
        if (successWoo && Array.isArray(resultWoo) && resultWoo.length > 0) {
          let wooCategoriesFiltered = resultWoo.filter(cat => cat?.parent === 0);
          let woocommerceCategoriesMap = wooCategoriesFiltered.map(cat => { return { label: cat?.name, value: cat?.id } });
          setWooCommerceCategories(woocommerceCategoriesMap);
          openSnackbarSuccess('Categorías Woocommerce cargadas exitosamente');
        }
      } catch (error) {
        console.log(error);
        openSnackbarDanger('Ocurrió un error al obtener las categorías de woocommerce :(', 'Intenta mas tarde');
      } finally {
        setOpenBackdrop(false);
      }
    })();
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

  const transformMappings = () => {
    return Object.entries(mappings).map(([internalCategoryId, woocommerceCategoryId]) => ({
      internalCategoryId,
      woocommerceCategoryId: String(woocommerceCategoryId),
      companyId: url.companyId,
      createdBy: url.createdByMock,
    }));
  };

  const saveMapping = async () => {
    if (isValid) {
      try {
        const transformedMappings = transformMappings();
        console.log('Mapeo transformado para enviar al backend:', transformedMappings);
        let response = await apiClient.create(url.CREATE_MAPPING_CATEGORIES, { mappings: transformedMappings });
        console.log('Respuesta del backend:', response);
        openSnackbarSuccess('Mapeo guardado exitosamente');
      } catch (error) {
        openSnackbarDanger('Error interno. Por favor, intenta mas tarde');
      }
    } else {
      openSnackbarDanger('Por favor, mapea todas las categorías antes de guardar');
    }
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