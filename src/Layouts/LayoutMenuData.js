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

  //Calender
  const [isCalender, setCalender] = useState(false);

  // Apps
  const [isEmail, setEmail] = useState(false);
  const [isSubEmail, setSubEmail] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isProjects, setIsProjects] = useState(false);
  const [isTasks, setIsTasks] = useState(false);
  const [isCRM, setIsCRM] = useState(false);
  const [isCrypto, setIsCrypto] = useState(false);
  const [isInvoices, setIsInvoices] = useState(false);
  const [isSupportTickets, setIsSupportTickets] = useState(false);
  const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);
  const [isJobs, setIsJobs] = useState(false);
  const [isJobList, setIsJobList] = useState(false);
  const [isCandidateList, setIsCandidateList] = useState(false);

  // Authentication
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pages
  const [isProfile, setIsProfile] = useState(false);
  const [isLanding, setIsLanding] = useState(false);

  // Charts
  const [isApex, setIsApex] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

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
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
    if (iscurrentState !== "Clientes") {
      setIsCustomers(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
    isCustomers,
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
          link: "/customers-list",
          parentId: "customers",
        },
        {
          id: "create-customer",
          label: "Crear cliente",
          link: "/customers-create",
          parentId: "customers",
        },
        {
          id: "customer-orders",
          label: "Pedidos",
          link: "/customer-orders",
          parentId: "customers",
        },
        {
          id: "customer-invoices",
          label: "Facturas",
          link: "/customer-invoices",
          parentId: "customers",
        },
        {
          id: "customer-shipments",
          label: "Envíos",
          link: "/customer-shipments",
          parentId: "customers",
        },
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
          link: "/products-list",
          parentId: "products",
        },
        {
          id: "create-product",
          label: "Crear producto",
          link: "/products-create",
          parentId: "products",
        },
        {
          id: "category",
          label: "Categorías",
          link: "/category",
          parentId: "products",
        },
        {
          id: "subcategory",
          label: "SubCategorías",
          link: "/subcategory",
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
          link: "/warehouse-view",
          parentId: "warehouse",
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
          id: "conf-products",
          label: "Conf. Producto",
          link: "/products-conf",
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
