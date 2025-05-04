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
        component: <LayoutCreateProduct />,
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
    { path: "/customers-list", component: <ListCustomersView />, },
    { path: "/customers-types-list", component: <ListTypeCustomersView />, },

    // Purchase Order
    { path: "/purchase-orders", component: <ListPurchaseOrder /> },
    { path: "/purchase-orders/create", component: <PurchaseOrderPage /> },
    { path: "/purchase-orders/edit/:id", component: <EditPurchaseOrder /> },
    { path: "/purchase-orders/view-detail/:id", component: <ViewDetailPurchaseOrder /> },

    // Mat Material Price
    { path: "/mat-material-price", component: <ListMatMaterialPrice /> },

    // Production
    { path: "/production", component: <ProductionListPage /> },
    { path: "/production/items", component: <ProductionListByItems /> },
    { path: "/production/create", component: <ProductionListPage /> },
    { path: "/production/edit", component: <ProductionListPage /> },
    { path: "/production/view-detail/:id", component: <ProductionListPage /> },
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