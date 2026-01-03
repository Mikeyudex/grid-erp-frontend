import React from "react";
import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import { ImportProductState } from '../pages/GridErp/Products/context/imports/importProductState';

import { ListProducts } from "../pages/GridErp/Products/pages/ListProducts";
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
import PurchaseListPage from "../pages/GridErp/Purchase/pages/purchase-list";
import EditPaymentPage from "../pages/GridErp/Payments/editar/page";
import RegisterExpensePage from "../pages/GridErp/Expenses/pages/registro/page";
import ExpenseListPage from "../pages/GridErp/Expenses/pages/lista/page";
import ReportsPage from "../pages/GridErp/Reports/page";
import AccumulatedSalesReportPage from "../pages/GridErp/Reports/pages/ventas-acumuladas/page";
import DetailedSalesReportPage from "../pages/GridErp/Reports/pages/ventas-detalladas/page";
import ProductSalesReportPage from "../pages/GridErp/Reports/pages/ventas-por-producto/page";
import AccountsReceivablePage from "../pages/GridErp/Reports/pages/cuentas-por-cobrar/page";
import DetailedAccountsReceivablePage from "../pages/GridErp/Reports/pages/cuentas-por-cobrar-detallado/page";
import BankAccountsBalancePage from "../pages/GridErp/Reports/pages/saldos-bancarios/page";
import BankMovementsReportPage from "../pages/GridErp/Reports/pages/movimientos-bancarios/page";
import ShippingLabelsPage from "../pages/GridErp/Reports/pages/rotulos-envio/page";
import AdminUsersPage from "../pages/GridErp/Administration/AdminUsersPage";

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
    { path: "/payments-edit/:id", component: <EditPaymentPage /> },

    //expenses
    { path: "/accounting/expenses-types-list", component: <ListTypeExpenses /> },
    { path: "/accounting/expenses-register", component: <RegisterExpensePage /> },
    { path: "/accounting/expenses-list", component: <ExpenseListPage /> },
    /* { path: "/accounting/expenses-edit/:id", component: <EditExpensePage /> }, */

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
    { path: "/purchases", component: <PurchaseListPage /> },
    { path: "/purchases-create", component: <CreatePurchase /> },

    //Reports
    { path: "/reports", component: <ReportsPage /> },
    { path: "/reports-cumulative-sales", component: <AccumulatedSalesReportPage /> },
    { path: "/reports-detailed-sales", component: <DetailedSalesReportPage /> },
    { path: "/reports-product-sales", component: <ProductSalesReportPage /> },
    { path: "/reports-receivables", component: <AccountsReceivablePage /> },
    { path: "/reports-receivables-detailed", component: <DetailedAccountsReceivablePage /> },
    { path: "/reports-bank-accounts-balance", component: <BankAccountsBalancePage /> },
    { path: "/reports-bank-movements", component: <BankMovementsReportPage /> },
    { path: "/reports-shipping-labels", component: <ShippingLabelsPage /> },

    //Admin Users
    { path: "/admin-users", component: <AdminUsersPage /> },
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