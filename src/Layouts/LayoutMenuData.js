import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isProducts, setIsProducts] = useState(false);
  const [isWarehouses, setIsWarehouses] = useState(false);
  const [isStock, setIsStock] = useState(false);
  const [isConfigurations, setIsConfigurations] = useState(false);
  const [isWoocommerce, setIsWoocommerce] = useState(false);
  const [isCustomers, setIsCustomers] = useState(false);
  const [isPurchaseOrders, setIsPurchaseOrders] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [isAccounting, setIsAccounting] = useState(false);


  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [isApps, setIsApps] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Clientes") {
      setIsCustomers(false);
    }
    if (iscurrentState !== "Pedidos") {
      setIsPurchaseOrders(false);
    }
    if (iscurrentState !== "Producción") {
      setIsProduction(false);
    }
    if (iscurrentState !== "Cuentas") {
      setIsAccounting(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isCustomers,
    isProduction,
    isAccounting
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("Dashboard");
      },
    },
    {
      id: "customers",
      label: "Clientes",
      icon: "ri-user-3-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsCustomers(!isCustomers);
        setIscurrentState("Clientes");
        updateIconSidebar(e);
      },
      stateVariables: isCustomers,
      subItems: [
        {
          id: "view-customers",
          label: "Ver clientes",
          link: "/customers-list-v2",
          parentId: "customers",
        },
        {
          id: "create-customer",
          label: "Crear cliente",
          link: "/customers-create-v2",
          parentId: "customers",
        },
        {
          id: "customer-types-list",
          label: "Categoría de cliente",
          link: "/customers-types-list-v2",
          parentId: "customers",
        },
        {
          id: "type-customer",
          label: "Tipo de cliente",
          link: "/type-of-customer-list",
          parentId: "customers",
        },
        {
          id: "type-document",
          label: "Tipo de documento",
          link: "/type-of-document-list",
          parentId: "customers",
        },
      ],
    },
    {
      label: "Pedidos",
      isHeader: true,
    },
    {
      id: "purchase-orders",
      label: "Pedidos",
      icon: "ri-shopping-cart-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsPurchaseOrders(!isPurchaseOrders);
        setIscurrentState("Pedidos");
        updateIconSidebar(e);
      },
      stateVariables: isPurchaseOrders,
      subItems: [
        {
          id: "orders-list",
          label: "Lista",
          link: "/purchase-orders",
          parentId: "purchase-orders",
        },
        {
          id: "orders-create",
          label: "Crear",
          link: "/purchase-orders/create",
          parentId: "purchase-orders",
        }
      ],
    },
    {
      label: "Producción",
      isHeader: true,
    },
    {
      id: "production-orders",
      label: "Producción",
      icon: "ri-building-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsProduction(!isProduction);
        setIscurrentState("Producción");
        updateIconSidebar(e);
      },
      stateVariables: isProduction,
      subItems: [
        {
          id: "production-list",
          label: "Lista",
          link: "/production",
          parentId: "production-orders",
        },
        {
          id: "production-list-items",
          label: "Items",
          link: "/production/items",
          parentId: "production-orders",
        }
      ],
    },
    {
      label: "Inventario",
      isHeader: true,
    },
    {
      id: "products",
      label: "Productos",
      icon: "ri-apps-2-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsProducts(!isProducts);
        setIscurrentState("Productos");
        updateIconSidebar(e);
      },
      stateVariables: isProducts,
      subItems: [
        {
          id: "view-products",
          label: "Ver productos",
          link: "/products-list-v2",
          parentId: "products",
        },
        {
          id: "create-product",
          label: "Crear producto",
          link: "/products/lobby",
          parentId: "products",
        },
        {
          id: "category",
          label: "Marcas (Categorías)",
          link: "/category-v2",
          parentId: "products",
        },
        {
          id: "mat-material-price",
          label: "Tipo - Material",
          link: "/mat-material-price-v2",
          parentId: "products",
        },
        {
          id: "uploads",
          label: "Historial de cargues",
          link: "/uploads",
          parentId: "products",
        },
      ],
    },
    {
      id: "stock",
      label: "Stock",
      icon: "bx bxs-package",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsStock(!isStock);
        setIscurrentState("Stock");
        updateIconSidebar(e);
      },
      stateVariables: isStock,
      subItems: [
        {
          id: "manage-stock",
          label: "Administrar stock",
          link: "/manage-stock-view",
          parentId: "stock",
        },
        {
          id: "adjustment-stock",
          label: "Ajustar stock",
          link: "/adjustment-stock-view",
          parentId: "stock",
        },
        {
          id: "transfer-stock",
          label: "Transferir stock",
          link: "/transfer-stock-view",
          parentId: "stock",
        },
      ],
    },
    {
      id: "warehouse",
      label: "Mis bodegas",
      icon: "ri-home-gear-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsWarehouses(!isWarehouses);
        setIscurrentState("Mis bodegas");
        updateIconSidebar(e);
      },
      stateVariables: isWarehouses,
      subItems: [
        {
          id: "view-warehouses",
          label: "Ver bodegas",
          link: "/warehouses",
          parentId: "warehouse",
        },
      ],
    },
    {
      label: "Contabilidad",
      isHeader: true,
    },
    {
      id: "accounting-accounts",
      label: "Cuentas",
      icon: "ri-money-dollar-circle-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsAccounting(!isAccounting);
        setIscurrentState("Cuentas");
        updateIconSidebar(e);
      },
      stateVariables: isAccounting,
      subItems: [
        {
          id: "account-list",
          label: "Lista",
          link: "/accounts",
          parentId: "production-orders",
        },
        {
          id: "account-create",
          label: "Crear",
          link: "/accounts-create",
          parentId: "accounting-accounts",
        }
      ],
    },
    {
      label: "Integración",
      isHeader: true,
    },
    {
      id: "configurations",
      label: "Configuraciones",
      icon: "ri-settings-2-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsConfigurations(!isConfigurations);
        setIscurrentState("Configuraciones");
        updateIconSidebar(e);
      },
      stateVariables: isConfigurations,
      subItems: [
        {
          id: "zones",
          label: "Sedes",
          link: "/zones",
          parentId: "configurations",
        },
        {
          id: "conf-company",
          label: "Mi Empresa",
          link: "/company-conf",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsWoocommerce(!isWoocommerce);
          },
          parentId: "configurations",
          stateVariables: isWoocommerce,
          childItems: [
            {
              id: 1,
              label: "General",
              link: "/config-company",
              parentId: "configurations",
            },
          ],
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
