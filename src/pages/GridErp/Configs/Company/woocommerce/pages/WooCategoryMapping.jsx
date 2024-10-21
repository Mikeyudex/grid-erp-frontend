import React, { useState, useEffect } from 'react';
import { Button, ThemeProvider, createTheme, FormControl, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import { useSnackbar } from 'react-simple-snackbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Skeleton } from '@mui/material';

import BreadCrumb from '../../../../Products/components/BreadCrumb';
import { Container, MappingContainer, MappingRow, Column } from './CategoryMapping.styles';
import { optionsSnackbarDanger, optionsSnackbarSuccess } from '../../../../Stock/helper/stock_helper';
import * as url from '../helper/url_helper';
import { WooCommerceHelper } from '../helper/woocommerce_helper';
import { ProductHelper } from '../../../../Products/helper/product_helper';
import { APIClient } from '../../../../../../helpers/api_helper';
import { BackdropGlobal } from '../../../../Products/components/Backdrop';

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
  const [titleBackdrop, setTitleBackdrop] = useState("");
  const [loadingMappings, setLoadingMappings] = useState(true);

  // Nueva función para cargar los mapeos existentes desde la base de datos
  const fetchCategoryMappings = async () => {
    try {
      const response = await apiClient.get(url.GET_MAPPINGS_CATEGORIES + "/" + url.companyId);
      const existingMappings = response;
      const transformedMappings = transformToMappings(existingMappings);
      setMappings(transformedMappings);
    } catch (error) {
      console.error('Error fetching category mappings:', error);
      openSnackbarDanger('Error al obtener los mapeos existentes. Por favor, intenta más tarde');
    }
  };

  const transformToMappings = (data) => {
    const transformed = {};
    data.forEach((item) => {
      const { internalCategoryId, internalSubCategoryId, woocommerceCategoryId, woocommerceSubCategoryId } = item;
      // Si la categoría no existe en el objeto transformed, la creamos
      if (!transformed[internalCategoryId]) {
        transformed[internalCategoryId] = {
          category: woocommerceCategoryId,
          subcategories: {},
        };
      }
      // Añadimos la subcategoría
      transformed[internalCategoryId].subcategories[internalSubCategoryId] = woocommerceSubCategoryId;
    });
    return transformed;
  };

  const groupCategories = (categories) => {
    const groupedCategories = {};

    // Primero, iteramos sobre todas las categorías para identificar las categorías principales
    categories.forEach(category => {
      if (category.parent === 0) {
        // Es una categoría principal
        groupedCategories[category.id] = {
          ...category,
          subcategories: [] // Inicializamos un array vacío para las subcategorías
        };
      }
    });

    // Luego, iteramos nuevamente para ubicar las subcategorías bajo su categoría principal
    categories.forEach(category => {
      if (category.parent !== 0) {
        // Es una subcategoría, la agregamos bajo la categoría padre
        if (groupedCategories[category.parent]) {
          groupedCategories[category.parent].subcategories.push(category);
        }
      }
    });

    return groupedCategories;
  };

  const mapCategoriesToSelectOptions = (groupedCategories) => {
    const categoriesArray = [];
    Object.values(groupedCategories).forEach(category => {
      const mappedCategory = {
        label: category.name,
        value: String(category.id),
        subcategories: category.subcategories.map(subcategory => ({
          label: subcategory.name,
          value: String(subcategory.id)
        }))
      };
      categoriesArray.push(mappedCategory);
    });

    return categoriesArray;
  };

  const handleMapping = (categoryValue, subcategoryValue, wooCommerceCategoryValue) => {
    setMappings(prev => ({
      ...prev,
      [categoryValue]: {
        ...prev[categoryValue],
        category: subcategoryValue ? prev[categoryValue]?.category : wooCommerceCategoryValue,
        subcategories: {
          ...prev[categoryValue]?.subcategories,
          ...(subcategoryValue ? { [subcategoryValue]: wooCommerceCategoryValue } : {})
        }
      }
    }));
  };

  const validateMappings = () => {
    const allMapped = internalCategories.every(cat =>
      mappings[cat.value]?.category &&
      cat.subcategories.every(subcat =>
        mappings[cat.value]?.subcategories?.[subcat.value]
      )
    );
    setIsValid(allMapped);
  };

  const transformMappingsToCreate = () => {
    return Object.entries(mappings).flatMap(([categoryId, categoryData]) => [
      {
        internalCategoryId: categoryId,
        woocommerceCategoryId: String(categoryData.category),
        createdBy: url.createdByMock,
        companyId: url.companyId
      },
      ...Object.entries(categoryData.subcategories || {}).map(([subcategoryId, woocommerceSubCategoryId]) => ({
        internalCategoryId: categoryId,
        internalSubCategoryId: subcategoryId,
        woocommerceCategoryId: String(categoryData.category),
        woocommerceSubCategoryId: String(woocommerceSubCategoryId),
        createdBy: url.createdByMock,
        companyId: url.companyId
      }))
    ]);
  };

  const saveMapping = async () => {
    if (isValid) {
      try {
        setOpenBackdrop(true);
        setTitleBackdrop("Guardando mapeo de categorías...");
        console.log(mappings);
        const transformedMappings = transformMappingsToCreate();
        //await apiClient.create(url.CREATE_MAPPING_CATEGORIES, { mappings: transformedMappings });
        openSnackbarSuccess('Mapeo guardado exitosamente');
      } catch (error) {
        console.log('Error al guardar mapeo de categorías:', error);
        openSnackbarDanger('Error interno. Por favor, intenta mas tarde');
      } finally {
        setOpenBackdrop(false);
        setTitleBackdrop("");
      }
    } else {
      openSnackbarDanger('Por favor, mapea todas las categorías antes de guardar');
    }
  };

  useEffect(() => {

    setTitleBackdrop("Obteniendo categorías...");

    (async () => {
      await fetchCategoryMappings(); // Cargar los mapeos al montar el componente
    })();

    // Cargar categorías internas
    (async () => {
      try {

        let internalCategories = await productHelper.getCategoriesFullByCompanySelect(url.companyId);
        let internalCategoriesMap = internalCategories.data.map(cat => {
          return {
            label: cat?.label,
            value: cat?.value,
            subcategories: cat?.subcategoriesSelect?.map(subcat => {
              return { label: subcat?.label, value: subcat?.value }
            })
          }
        });
        setInternalCategories(internalCategoriesMap);
        openSnackbarSuccess('Categorías internas cargadas exitosamente');
      } catch (error) {
        console.log(error);
        openSnackbarDanger('Ocurrió un error al obtener las categorías :(', 'Intenta mas tarde');
      }
    })();

    // Cargar categorías de WooCommerce
    (async () => {
      try {
        let responseWoo = await wooCommerceHelper.getCategoriesWoocommerce(url.companyId);
        let successWoo = responseWoo?.success;
        let resultWoo = responseWoo?.result;
        if (successWoo && Array.isArray(resultWoo) && resultWoo.length > 0) {
          let wooCategoriesGrouped = groupCategories(resultWoo);
          let woocommerceCategoriesMap = mapCategoriesToSelectOptions(wooCategoriesGrouped);
          setWooCommerceCategories(woocommerceCategoriesMap);
          openSnackbarSuccess('Categorías Woocommerce cargadas exitosamente');
        }
      } catch (error) {
        console.log(error);
        openSnackbarDanger('Ocurrió un error al obtener las categorías de woocommerce :(', 'Intenta mas tarde');
      } finally {
        setOpenBackdrop(false);
        setTitleBackdrop("");
        setLoadingMappings(false);
      }
    })();

  }, []);

  useEffect(() => {
    validateMappings();
  }, [mappings]);


  return (
    <div className="page-content">
      <BreadCrumb title="Mapeo de categorías" pageTitle="Woocommerce" />

      <BackdropGlobal
        openBackdrop={openBackdrop}
        handleClose={() => setOpenBackdrop(false)}
        title={titleBackdrop}
      />
      <Container>

        <MappingContainer elevation={3}>
          {internalCategories.map((internalCat) => (
            <Accordion key={internalCat.value}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {/* <Typography variant="h6">{internalCat.label}</Typography> */}
                <h4>{internalCat.label}</h4>
              </AccordionSummary>
              <AccordionDetails>
                <Box mb={2}>
                  <MappingRow>
                    <Column>
                      <h5 className='bold'>Categoría Principal</h5>
                    </Column>
                    <Column>

                      <FormControl fullWidth>
                        {
                          wooCommerceCategories.length > 0 && (
                            <Select
                              style={{
                                border: 'none !important',
                                borderBottom: '2px solid #ccc !important',
                                backgroundColor: 'transparent',
                                color: '#132649',
                                '&:focus': { border: 'none', boxShadow: 'none' },
                                fontSize: '1em',
                              }}
                              size='small'
                              labelId={`select-label-${internalCat.value}`}
                              value={mappings[internalCat.value]?.category || ''}
                              onChange={(e) => handleMapping(internalCat.value, null, e.target.value)}
                            >
                              {wooCommerceCategories.map(wcCat => (
                                <MenuItem key={wcCat.value} value={wcCat.value}>
                                  {wcCat.label}
                                </MenuItem>
                              ))}
                            </Select>
                          )
                        }
                      </FormControl>
                    </Column>
                  </MappingRow>
                </Box>
                <h5 className='bold'>Subcategorías</h5>
                {(internalCat?.subcategories ?? []).map((internalSubcat) => (
                  <MappingRow key={internalSubcat.value}>
                    <Column>
                      <span className='fs-15'>{internalSubcat.label}</span>
                    </Column>
                    <Column>
                      {
                        loadingMappings || !internalCategories.length || !wooCommerceCategories.length ? (
                          <Skeleton variant="rectangular" height={56} />
                        ) : (
                          <FormControl fullWidth>
                            {
                              wooCommerceCategories.length > 0 && (
                                <Select
                                  size='small'
                                  style={{
                                    border: 'none !important',
                                    borderBottom: '2px solid #ccc !important',
                                    backgroundColor: 'transparent',
                                    color: '#132649',
                                    '&:focus': { border: 'none', boxShadow: 'none' },
                                    fontSize: '1em',
                                  }}
                                  labelId={`select-label-${internalCat.value}-${internalSubcat.value}`}
                                  value={mappings[internalCat.value]?.subcategories?.[internalSubcat.value] || ''}
                                  onChange={(e) => handleMapping(internalCat.value, internalSubcat.value, e.target.value)}
                                >
                                  {wooCommerceCategories.find(cat => cat.value === mappings[internalCat.value]?.category)?.subcategories.map(wcSubcat => (
                                    <MenuItem key={wcSubcat.value} value={wcSubcat.value}>
                                      {wcSubcat.label}
                                    </MenuItem>
                                  )) || []}
                                </Select>
                              )
                            }

                          </FormControl>
                        )
                      }
                    </Column>
                  </MappingRow>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </MappingContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={saveMapping}
          disabled={!isValid || loadingMappings}
        >
          {loadingMappings ? 'Cargando...' : 'Guardar Mapeo'}
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