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
import  ViewDetailPurchaseOrder from "../pages/GridErp/PurchaseOrder/pages/ViewDetailPurchaseOrder";

const authProtectedRoutes = [
    { path: "/dashboard", component: <DashboardEcommerce /> },
    {
        path: "/",
        exact: true,
        component: <Navigate to="/dashboard" />,
    },
    // Products
    {
        path: "/products-create",
        component: <LayoutCreateProduct />,
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
    { path: "/purchase-orders/edit", component: <PurchaseOrderPage /> },
    { path: "/purchase-orders/view-detail/:id", component: <ViewDetailPurchaseOrder /> },
]

const publicRoutes = [
    // Authentication Page
    { path: "/logout", component: <h1>Logout</h1> },
    { path: "/login", component: <h1>Login</h1> },]


export { authProtectedRoutes, publicRoutes };