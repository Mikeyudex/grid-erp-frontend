import React, { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { useSnackbar } from 'react-simple-snackbar';
import { Backdrop, CircularProgress } from '@mui/material';

import { optionsSnackbarDanger, optionsSnackbarSuccess } from "../../../../Stock/helper/stock_helper";
import BreadCrumb from '../../../../Products/components/BreadCrumb';
import { StyledButton, StyledField, StyledForm, StyledInput, StyledLabel, StyledMessage } from './WooConfig.styles';
import { APIClient } from '../../../../../../helpers/api_helper';
import * as url from '../helper/url_helper';

const apiClient = new APIClient();

export default function WooCredentialsView() {
  const [open, setOpen] = useState(false);
  const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
  const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
  const [configs, setConfigs] = useState({
    id: null,
    companyId: null,
    wooCommerceUrl: null,
    wooCommerceConsumerKey: null,
    wooCommerceConsumerSecret: null,
    isActive: null,
  });
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);

  const handleChange = (e) => {
    setConfigs({ ...configs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    setOpenBackdrop(true);

    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    formData.companyId = configs.companyId;
    formData.isActive = true;
    formData.id = configs.id;
    console.log('Configuración guardada:', formData);
    if (hasUpdate) {
      try {
        await apiClient.put(url.UPDATE_CONFIGS_WOO + "/" + configs.id, formData);
        openSnackbarSuccess('Configuración actualizada');
      } catch (error) {
        console.log(error);
        openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
      }
    } else {
      try {
        await apiClient.create(url.CREATE_CONFIGS_WOO, formData)
        openSnackbarSuccess('Configuración creada');
      } catch (error) {
        console.log(error);
        openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
      }
    }
    setOpenBackdrop(false);
    return;
  };

  useEffect(() => {

    apiClient.get(url.GET_CONFIGS_WOO + "/" + url.companyId)
      .then(response => {
        if (response) {
          setHasUpdate(true);
          setConfigs({
            id: response?._id,
            companyId: response?.companyId,
            wooCommerceUrl: response?.wooCommerceUrl,
            wooCommerceConsumerKey: response?.wooCommerceConsumerKey,
            wooCommerceConsumerSecret: response?.wooCommerceConsumerSecret,
            isActive: response?.isActive,
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setOpenBackdrop(false);
      });

  }, []);

  return (

    <div className="page-content">
      <BreadCrumb title="General" pageTitle="Mi empresa" to={'/config-company'} />
      <div>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Configuración de credenciales</h1>
        <StyledForm onSubmit={handleSubmit}>
          <StyledField name="wooCommerceUrl">
            <StyledLabel>URL de WooCommerce</StyledLabel>
            <StyledInput
              type="url"
              required
              pattern="^https:\/\/.*"
              value={configs.wooCommerceUrl}
              onChange={handleChange}
              name='wooCommerceUrl'
            />
            <StyledMessage match="valueMissing">La URL es requerida</StyledMessage>
            <StyledMessage match="typeMismatch">Por favor, introduce una URL válida</StyledMessage>
            <StyledMessage match="patternMismatch">La URL debe comenzar con https://</StyledMessage>
          </StyledField>
          <StyledField name="wooCommerceConsumerKey">
            <StyledLabel>Consumer Key</StyledLabel>
            <StyledInput
              type="text"
              required
              minLength={20}
              maxLength={50}
              value={configs.wooCommerceConsumerKey}
              onChange={handleChange}
              name='wooCommerceConsumerKey'
            />
            <StyledMessage match="valueMissing">La Consumer Key es requerida</StyledMessage>
            <StyledMessage match="tooShort">La Consumer Key debe tener al menos 20 caracteres</StyledMessage>
            <StyledMessage match="tooLong">La Consumer Key no debe exceder los 50 caracteres</StyledMessage>
          </StyledField>
          <StyledField name="wooCommerceConsumerSecret">
            <StyledLabel>Consumer Secret</StyledLabel>
            <StyledInput
              type="password"
              required
              minLength={40}
              maxLength={80}
              value={configs.wooCommerceConsumerSecret}
              onChange={handleChange}
              name='wooCommerceConsumerSecret'
            />
            <StyledMessage match="valueMissing">El Consumer Secret es requerido</StyledMessage>
            <StyledMessage match="tooShort">El Consumer Secret debe tener al menos 40 caracteres</StyledMessage>
            <StyledMessage match="tooLong">El Consumer Secret no debe exceder los 80 caracteres</StyledMessage>
          </StyledField>
          <Form.Submit asChild>
            <StyledButton>Guardar Configuración</StyledButton>
          </Form.Submit>
        </StyledForm>
      </div>
    </div>
  );
}