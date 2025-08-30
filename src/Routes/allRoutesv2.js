import React from "react";
import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import { ImportProductState } from '../pages/GridErp/Products/context/imports/importProductState';

import { ListProducts } from "../pages/GridErp/Products/pages/ListProducts";
import LayoutCreateProduct from "../pages/GridErp/Products/components/LayoutCreateProduct";
import { SuccessProductCreateView } from "../pages/GridErp/Products/components/SuccessProductCreateView";
import { AdjustmentStockView } from "../pages/GridErp/Stock/pages/AdjustmentStockView";
import { TransferStockView } from "../pages/GridErp/Stock/pages/TransferStockView";
import WooCredentialsView from "../pages/GridErp/Configs/Company/woocommerce/pages/WooCredentialsView";
import CompanyConfigView from "../pages/GridErp/Configs/Company/general/pages/CompanyConfigView";
import ThemedCategoryMapping from "../pages/GridErp/Configs/Company/woocommerce/pages/WooCategoryMapping";
import WooGeneralConfig from "../pages/GridErp/Configs/Company/woocommerce/pages/WooGeneralConfig";
import { ListCategories } from "../pages/GridErp/Category/pages/ListCategories";
import { CategoryProductState } from "../pages/GridErp/Category/context/categoryProductState";
import { ListSubCategories } from "../pages/GridErp/Subcategory/pages/ListSubcategories";
import { SubCategoryProductState } from "../pages/GridErp/Subcategory/context/subcategoryState";
import { CreateCustomer } from "../pages/GridErp/Customers/pages/CreateCustomer";
import { ListCustomersView } from "../pages/GridErp/Customers/pages/ListCustomers";
import { ListTypeCustomersView } from "../pages/GridErp/Customers/pages/ListTypesCustomer";
import PurchaseOrderPage from "../pages/GridErp/PurchaseOrder/pages/CreatePurchaseOrder";
import { ListPurchaseOrder } from "../pages/GridErp/PurchaseOrder/pages/ListPurchaseOrder";
import ViewDetailPurchaseOrder from "../pages/GridErp/PurchaseOrder/pages/ViewDetailPurchaseOrder";
import { ListMatMaterialPrice } from "../pages/GridErp/MatMaterialPrice/pages/ListMatMaterialPrice";
import ProductionListPage from "../pages/GridErp/Production/pages/ProductionList";
import EditPurchaseOrder from "../pages/GridErp/PurchaseOrder/pages/EditPurchaseOrder";
import SignUp from "../pages/GridErp/Auth/pages/SignUp";
import SignIn from "../pages/GridErp/Auth/pages/SignIn";
import ActivateOtp from "../pages/GridErp/Auth/pages/ActivateOtp";
import PasswordReset from "../pages/GridErp/Auth/pages/PasswordReset";
import PasswordCreate from "../pages/GridErp/Auth/pages/PasswordCreate";
import TwosVerify from "../pages/GridErp/Auth/pages/TwosVerify";
import HomeBackoffice from "../pages/GridErp/Home/pages/Home";
import ProfileSettings from "../pages/GridErp/Profile/Settings/Settings";
import ProductionListByItems from "../pages/GridErp/Production/pages/ProductionListByItems";
import SeleccionTipoProducto from "../pages/GridErp/Products/pages/SeleccionTipoProducto";
import LayoutCreateProductTapete from "../pages/GridErp/Products/components/LayoutCreateProductTapete";
import UploadHistoryPage from "../pages/GridErp/Uploads/pages/UploadHistoryPage";
import ClientTypesPage from "../pages/GridErp/Customers/pages/ListTypesCustomerV2";
import ListCustomerV2 from "../pages/GridErp/Customers/pages/ListCustomerV2";
import ListProductsV2 from "../pages/GridErp/Products/pages/ListProductsV2";
import ListCategoriesV2 from "../pages/GridErp/Category/pages/ListCategoriesV2";
import ListMatMaterialPriceV2 from "../pages/GridErp/MatMaterialPrice/pages/ListMatMaterialPriceV2";
import WarehouseListPage from "../pages/GridErp/Warehouses/pages/WarehouseList";
import ZonesListPage from "../pages/GridErp/Zones/pages/ListZones";
import CreateClientV2 from "../pages/GridErp/Customers/pages/CreateCustomerV2";
import ListTypeOfClient from "../pages/GridErp/Customers/pages/ListTypeOfClient";
import ListTypeOfDocument from "../pages/GridErp/Customers/pages/ListTypeOfDocument";
import EditCustomerView from "../pages/GridErp/Customers/pages/EditCustomerView";
import EditProductMatView from "../pages/GridErp/Products/pages/EditProductMatView";
import { ListFreeOrders } from "../pages/GridErp/PurchaseOrder/pages/ListFreeOrders";
import ListAccounts from "../pages/GridErp/Accounts/pages/ListAccounts";
import RegisterPaymentPage from "../pages/GridErp/Payments/registro/page";
import PaymentListPage from "../pages/GridErp/Payments/lista/page";
import ListTypeExpenses from "../pages/GridErp/Expenses/pages/ListTypeExpenses";
import CrearProductoGeneral from "../pages/GridErp/Products/pages/create-product-general";
import CreatePurchase from "../pages/GridErp/Purchase/pages/purchase-create";
import ListRetentions from "../pages/GridErp/Retentions/pages/ListRetentions";
import ListTaxes from "../pages/GridErp/Taxes/pages/ListTaxes";

const authProtectedRoutes = [
    { path: "/home", component: <HomeBackoffice /> },
    { path: "/dashboard", component: <DashboardEcommerce /> },
    {
        path: "/",
        exact: true,
        component: <Navigate to="/dashboard" />,
    },
    { path: "/profile", component: <ProfileSettings /> },
    // Products
    {
        path: "/products-create",
        component: <CrearProductoGeneral />,
    },
    {
        path: "/products-create-tapete",
        component: <ImportProductState> <LayoutCreateProductTapete /> </ImportProductState>,
    },
    {
        path: "/products-list",
        component: <ImportProductState> <ListProducts /> </ImportProductState>,
    },
    {
        path: "/products-list-v2",
        component: <ImportProductState> <ListProductsV2 /> </ImportProductState>,
    },
    { path: "/products-edit-tapete/:id", component: <ImportProductState> <EditProductMatView /> </ImportProductState>, },
    {
        path: "/success-product",
        component: <SuccessProductCreateView />,
    },
    {
        path: "/adjustment-stock-view",
        component: <AdjustmentStockView />,
    },
    {
        path: "/transfer-stock-view",
        component: <TransferStockView />,
    },
    {
        path: "/category",
        component: <CategoryProductState><ListCategories /></CategoryProductState>,
    },
    {
        path: "/category-v2",
        component: <CategoryProductState><ListCategoriesV2 /></CategoryProductState>,
    },
    {
        path: "/subcategory",
        component: <SubCategoryProductState><ListSubCategories /></SubCategoryProductState>,
    },
    {
        path: "/products/lobby",
        component: <SeleccionTipoProducto />,
    },

    // Company config
    { path: "/config-company", component: <CompanyConfigView /> },
    { path: "/woocommerce-config", component: <WooGeneralConfig />, },
    { path: "/woocommerce-config/category-mapping", component: <ThemedCategoryMapping />, },
    { path: "/woocommerce-config/credentials", component: <WooCredentialsView />, },

    // Customers
    { path: "/customers-create", component: <CreateCustomer />, },
    { path: "/customers-create-v2", component: <CreateClientV2 />, },
    { path: "/customers-edit/:id", component: <EditCustomerView />, },
    { path: "/customers-list-v2", component: <ListCustomerV2 />, },
    { path: "/customers-types-list-v2", component: <ClientTypesPage />, },
    { path: "/type-of-customer-list", component: <ListTypeOfClient />, },
    { path: "/type-of-document-list", component: <ListTypeOfDocument />, },

    // Purchase Order
    { path: "/purchase-orders", component: <ListPurchaseOrder /> },
    { path: "/purchase-orders/free-orders", component: <ListFreeOrders /> },
    { path: "/purchase-orders/create", component: <PurchaseOrderPage /> },
    { path: "/purchase-orders/edit/:id", component: <EditPurchaseOrder /> },
    { path: "/purchase-orders/view-detail/:id", component: <ViewDetailPurchaseOrder /> },

    // Mat Material Price
    { path: "/mat-material-price", component: <ListMatMaterialPrice /> },
    { path: "/mat-material-price-v2", component: <ListMatMaterialPriceV2 /> },

    // Production
    { path: "/production", component: <ProductionListPage /> },
    { path: "/production/items", component: <ProductionListByItems /> },
    { path: "/production/create", component: <ProductionListPage /> },
    { path: "/production/edit", component: <ProductionListPage /> },
    { path: "/production/view-detail/:id", component: <ProductionListPage /> },

    //payments
    { path: "/payments-register", component: <RegisterPaymentPage /> },
    { path: "/payments-list", component: <PaymentListPage /> },

    //expenses
    { path: "/accounting/expenses-types-list", component: <ListTypeExpenses /> },

    // Uploads
    { path: "/uploads", component: <UploadHistoryPage /> },
    //warehouses
    { path: "/warehouses", component: <WarehouseListPage /> },

    //zones
    { path: "/zones", component: <ZonesListPage /> },

    //Accounting
    { path: "/accounts", component: <ListAccounts /> },
    { path: "/accounting/retentions-list", component: <ListRetentions /> },
    { path: "/accounting/taxes-list", component: <ListTaxes /> },

    //Purchase
    /* { path: "/purchases", component: <PurchaseListPage /> }, */
    { path: "/purchases/create", component: <CreatePurchase /> },
]

const publicRoutes = [
    //Backoffice pages Auth
    { path: "/auth-signup", component: <SignUp /> },
    { path: "/auth-signin", component: <SignIn /> },
    { path: "/auth-otp", component: <TwosVerify /> },
    { path: "/auth-activate-otp", component: <ActivateOtp /> },
    { path: "/auth-forgot-password", component: <PasswordReset /> },
    { path: "/auth-reset-password", component: <PasswordCreate /> },

]


export { authProtectedRoutes, publicRoutes };