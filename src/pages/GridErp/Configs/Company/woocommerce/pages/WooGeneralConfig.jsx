import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid2, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import StorageIcon from '@mui/icons-material/Storage';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BreadCrumb from '../../../../Products/components/BreadCrumb';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '20rem',
  display: 'flex',
  padding: '0.3em',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: '50%',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const ConfigCard = ({ title, description, icon, to }) => (
  <Grid2 xs={12} sm={6} md={3}>
    <StyledCard component={Link} to={to} sx={{ textDecoration: 'none', color: 'inherit' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', width: '100%' }}>
        <IconWrapper>
          {icon}
        </IconWrapper>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  </Grid2>
);

export default function WooGeneralConfig() {
  return (
    <div className="page-content">
      <BreadCrumb title="General" pageTitle="Mi empresa" to={'/config-company'}/>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Grid2 container spacing={4}>
          <ConfigCard
            title="Credenciales"
            description="Configura el api de tu tienda WooCommerce"
            icon={<ShoppingCartIcon fontSize="large" />}
            to="/woocommerce-config/credentials"
          />
            <ConfigCard
            title="Mapeo de Categorías"
            description="Mapea las categorías de tu WooCommerce a las de tu empresa"
            icon={<CategoryRoundedIcon fontSize="large" />}
            to="/woocommerce-config/category-mapping"
          />
        </Grid2>
      </Container>
    </div>
  );
}