import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndexedDBService } from "../helpers/indexedDb/indexed-db-helper";

const indexedDBService = new IndexedDBService();

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isProducts, setIsProducts] = useState(false);
  const [isConfigurations, setIsConfigurations] = useState(false);
  const [isCustomers, setIsCustomers] = useState(false);
  const [isPurchaseOrders, setIsPurchaseOrders] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [isAccounting, setIsAccounting] = useState(false);
  const [isExpenses, setIsExpenses] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isAdministration, setIsAdministration] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const [userResources, setUserResources] = useState([]);

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
    let getResources = async () => {
      try {
        const user = await indexedDBService.getItemById(localStorage.getItem('userId'));
        if (user?.resources) {
          setUserResources(user?.resources);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    if (userResources.length === 0) {
      getResources();
    }
  }, []);

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
    if (iscurrentState !== "Reportes") {
      setIsReports(false);
    }
    if (iscurrentState !== "Administración") {
      setIsAdministration(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isCustomers,
    isProduction,
    isAccounting,
    isExpenses,
    isReports,
    isAdministration
  ]);

  const hasAccess = (path) => {
    return userResources.some((resource) => typeof path === "string" ? path.startsWith(resource?.path) : false);
  };

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
          link: "/customers/list-v2",
          parentId: "customers",
        },
        {
          id: "create-customer",
          label: "Crear cliente",
          link: "/customers/create-v2",
          parentId: "customers",
        },
        {
          id: "customer-types-list",
          label: "Categoría de cliente",
          link: "/customers/types-list-v2",
          parentId: "customers",
        },
        {
          id: "type-customer",
          label: "Tipo de cliente",
          link: "/customers/type-of-customer-list",
          parentId: "customers",
        },
        {
          id: "type-document",
          label: "Tipo de documento",
          link: "/customers/type-of-document-list",
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
      icon: "ri-product-hunt-line",
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
          link: "/products/list-v2",
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
          link: "/products/category-v2",
          parentId: "products",
        },
        {
          id: "mat-material-price",
          label: "Tipo - Material",
          link: "/products/mat-material-price-v2",
          parentId: "products",
        },
        {
          id: "uploads",
          label: "Historial de cargues",
          link: "/products/uploads",
          parentId: "products",
        },
      ],
    },
    /*  {
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
     }, */
    {
      label: "Contabilidad",
      isHeader: true,
    },
    {
      id: "accounting",
      label: "Contabilidad",
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
          label: "Cuentas bancarias",
          link: "/accounting/accounts",
          parentId: "accounting",
        },
        {
          id: "payment-list",
          label: "Pagos",
          link: "/accounting/payments-list",
          parentId: "accounting",
        },
        {
          id: "purchase-list",
          label: "Compras",
          link: "/accounting/purchases",
          parentId: "accounting",
        },
        {
          id: "retention",
          label: "Retenciones",
          link: "/accounting/retentions-list",
          parentId: "accounting",
        },
        {
          id: "taxes",
          label: "Impuestos",
          link: "/accounting/taxes-list",
          parentId: "accounting",
        },
        {
          id: "expenses",
          label: "Egresos",
          link: "/accounting#",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setIsExpenses(!isExpenses);
          },
          stateVariables: isExpenses,
          childItems: [
            { id: 1, label: "Tipos de egreso", link: "/accounting/expenses-types-list" },
            { id: 2, label: "Listado de Egresos", link: "/accounting/expenses-list" },
            { id: 3, label: "Registrar Egreso", link: "/accounting/expenses-register" },
          ],
        },
      ],
    },
    {
      label: "Reportes",
      isHeader: true,
    },
    {
      id: "reports",
      label: "Reportes",
      icon: "ri-file-list-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsReports(!isReports);
        setIscurrentState("Reportes");
        updateIconSidebar(e);
      },
      stateVariables: isReports,
      subItems: [
        {
          id: "reports",
          label: "Reportes",
          link: "/reports",
          parentId: "reports",
        },
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
          link: "/settings/zones",
          parentId: "configurations",
        },
        {
          id: "view-warehouses",
          label: "Bodegas",
          link: "/settings/warehouses",
          parentId: "configurations",
        },
      ],
    },
    {
      id: "administration",
      label: "Administración",
      icon: "ri-shield-user-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsAdministration(!isAdministration);
        setIscurrentState("Administración");
        updateIconSidebar(e);
      },
      stateVariables: isAdministration,
      subItems: [
        {
          id: "users",
          label: "Usuarios",
          link: "/admin/users",
          parentId: "administration",
        },
        {
          id: "roles",
          label: "Roles",
          link: "/admin/roles",
          parentId: "administration",
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .map((item) => {
      if (item.subItems) {
        const allowedSubItems = item.subItems.filter((sub) => hasAccess(sub.link));
        return allowedSubItems.length > 0 ? { ...item, subItems: allowedSubItems } : null;
      }
      return hasAccess(item.link) ? item : null;
    })
    .filter(Boolean);

  return <React.Fragment>{filteredMenuItems}</React.Fragment>;
};
export default Navdata;
