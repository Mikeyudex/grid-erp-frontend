import React from "react";
import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";

//login
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import { ListProducts } from "../pages/GridErp/Products/pages/ListProducts";
import LayoutCreateProduct from "../pages/GridErp/Products/components/LayoutCreateProduct";
import { SuccessProductCreateView } from "../pages/GridErp/Products/components/SuccessProductCreateView";
import { AdjustmentStockView } from "../pages/GridErp/Stock/pages/AdjustmentStockView";
import { TransferStockView } from "../pages/GridErp/Stock/pages/TransferStockView";
import WooCredentialsView from "../pages/GridErp/Configs/Company/woocommerce/pages/WooCredentialsView";
import CompanyConfigView from "../pages/GridErp/Configs/Company/general/pages/CompanyConfigView";
import ThemedCategoryMapping from "../pages/GridErp/Configs/Company/woocommerce/pages/WooCategoryMapping";
import WooGeneralConfig from "../pages/GridErp/Configs/Company/woocommerce/pages/WooGeneralConfig";

const authProtectedRoutes = [
    { path: "/dashboard", component: <DashboardEcommerce /> },
    {
        path: "/",
        exact: true,
        component: <Navigate to="/dashboard" />,
    },
    {
        path: "/products-create",
        component: <LayoutCreateProduct />,
    },
    {
        path: "/products-list",
        component: <ListProducts />,
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
    // Company config
    { path: "/config-company", component: <CompanyConfigView /> },
    { path: "/woocommerce-config", component: <WooGeneralConfig />, },
    { path: "/woocommerce-config/category-mapping", component: <ThemedCategoryMapping />, },
    { path: "/woocommerce-config/credentials", component: <WooCredentialsView />, }
]

const publicRoutes = [
    // Authentication Page
    { path: "/logout", component: <Logout /> },
    { path: "/login", component: <Login /> }]


export { authProtectedRoutes, publicRoutes };