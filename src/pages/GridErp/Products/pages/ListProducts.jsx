import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Container,
  Row,
} from "reactstrap";
import Tooltip from '@mui/material/Tooltip';

// RangeSlider
import "nouislider/distribute/nouislider.css";
import BreadCrumb from "../components/BreadCrumb";
//Import helpers
import { handleValidDate, handleValidTime, numberFormatPrice, optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from '../helper/product_helper';

import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { FormatDate } from "../components/FormatDate";
import { TableContainerListProducts } from "../partials/TableContainerListProducts";
import WoocommerceLogo from '../../../../assets/svg/woocommerce-logo-svgrepo-com.svg';
import { DrawerProductsImport } from "../components/DrawerImportProduct";
import { BackdropGlobal } from "../components/Backdrop";
import { ImportProductContext } from "../context/imports/importProductContext";
import { useWebSocketClient } from "../../../../context/websocketClient";

const helper = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';
const marketplaces = { woocommerce: 'woocommerce', meli: 'meli' };

export const ListProducts = (props) => {
  document.title = "Productos | Innventa-G";
  /* const { updateImportData, importData } = useContext(ImportProductContext); */
  const [productList, setProductList] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [showProgressBarTable, setShowProgressBarTable] = useState(false);
  const [dataSelectCategories, setDataSelectCategories] = useState([]);
  const [dataSelectSubCategories, setDataSelectSubCategories] = useState([]);
  const [dataSelectWarehouses, setDataSelectWarehouses] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20, //customize the default page size
  });
  const [rowCount, setRowCount] = useState(0);
  const [openDrawerImport, setOpenDrawerImport] = useState(false);

  const handler = {
    notification: (data) => {
      console.log('Notification received:', data);
    },
    pong: (data) => {
      console.log('Pong received:', data);
    },
  };

  useWebSocketClient({ userId: "1143135078", handler });

  useEffect(() => {
    if (!productList.length) {
      setIsLoadingTable(true);
    } else {
      setShowProgressBarTable(true);
    }
    helper.getProducts(pagination.pageIndex + 1, pagination.pageSize)
      .then(async (response) => {
        let products = response?.data;
        let totalRowCount = response?.totalRowCount;
        if (products && Array.isArray(products) && products.length > 0) {
          let parseProducts = products.map((p) => {
            return {
              id: p?._id,
              image: p?.additionalConfigs?.images?.[0] ?? "",
              name: `${p?.sku} - ${p?.name}`,
              category: p?.categoryName,
              subCategory: p?.subCategoryName,
              stock: p?.stock,
              warehouse: p?.warehouseName,
              salePrice: p?.salePrice,
              costPrice: p?.costPrice,
              createdAt: p?.createdAt,
              syncInfo: p?.syncInfo
            }
          });
          setProductList(parseProducts);
          setRowCount(totalRowCount);
        }
        return;
      })
      .catch(e => console.log(e))
      .finally(() => {
        setIsLoadingTable(false);
        setShowProgressBarTable(false);
      });
  }, [pagination.pageIndex, pagination.pageSize,]);

  useEffect(() => {
    helper.getWarehouseByCompanySelect(companyId)
      .then(async (response) => {
        setDataSelectWarehouses(response ?? []);
      })
  }, []);

  useEffect(() => {
    //do something when the pagination state changes
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(() =>
    [
      {
        header: "SKU - Producto",
        accessorKey: "name",
        enableColumnFilter: false,
        grow: true,
        size: 500, //large column
        Cell: ({ cell }) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm bg-light rounded p-1">
                  <img
                    src={cell.row.original.image}
                    alt=""
                    className="img-fluid d-block"
                  />
                </div>
              </div>
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-1">
                  <Link
                    to="/apps-ecommerce-product-details"
                    className="text-body"
                  >
                    {" "}
                    {cell.getValue()}
                    {" "}
                  </Link>
                  {
                    cell.row.original.syncInfo && cell.row.original.syncInfo[marketplaces.woocommerce]?.synced &&
                    (
                      <Tooltip
                        sx={{ backgroundColor: '#132649 !important', fontFamily: 'Outfit', }}
                        disableFocusListener
                        disableTouchListener
                        arrow
                        title={`Sincronizado el ${handleValidDate(cell.row.original.syncInfo[marketplaces.woocommerce]?.lastSyncedAt)} ${handleValidTime(cell.row.original.syncInfo[marketplaces.woocommerce]?.lastSyncedAt)}`}>
                        <img
                          src={WoocommerceLogo}
                          width={25}
                          height={25}
                          alt="Woocommerce"
                          style={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    )
                  }
                </h5>
              </div>
            </div>
          </>
        ),
      },
      {
        header: "Bodega",
        accessorKey: "warehouse",
        enableColumnFilter: true,
        enableEditing: true,
        editSelectOptions: dataSelectWarehouses.map((wa) => wa?.label),
        editVariant: 'select',
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.warehouse,
          helperText: validationErrors?.warehouse,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              warehouse: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.warehouse}</h6>)
        },
      },
      {
        header: "Stock",
        accessorKey: "stock",
        enableColumnFilter: false,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stock,
          helperText: validationErrors?.stock,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              stock: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.stock}</h6>)
        },
      },
      {
        header: "Precio de costo",
        accessorKey: "costPrice",
        enableColumnFilter: false,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.costPrice,
          helperText: validationErrors?.costPrice,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              costPrice: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{numberFormatPrice(cell.row.original.costPrice)}</h6>)
        },
      },
      {
        header: "Precio de venta",
        accessorKey: "salePrice",
        enableColumnFilter: false,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.salePrice,
          helperText: validationErrors?.salePrice,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              salePrice: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{numberFormatPrice(cell.row.original.salePrice)}</h6>)
        },
      },
      {
        header: "Categoría",
        accessorKey: "category",
        enableColumnFilter: true,
        enableEditing: false,
        editSelectOptions: dataSelectCategories.map((cat) => cat?.label),
        editVariant: 'select',
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.category,
          helperText: validationErrors?.category,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              category: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.category}</h6>)
        },
      },
      {
        header: "SubCategoría",
        accessorKey: "subCategory",
        enableColumnFilter: true,
        enableEditing: false,
        Cell: ({ cell }) => {
          return (<h6>{cell.row.original.subCategory}</h6>)
        },
      },
      {
        header: "Creado",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        enableEditing: false,
        Cell: ({ cell }) => {
          return <FormatDate {...cell} />;
        },
      },
    ],
    [dataSelectCategories, dataSelectWarehouses, validationErrors]
  );

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />
      <DrawerProductsImport
        openDrawer={openDrawerImport}
        setOpenDrawer={setOpenDrawerImport}
      /* handleAction={handleAction} */
      />
      <Container fluid>
        <BreadCrumb title="Ver productos" pageTitle="Productos" />
        <Row>
          <div className="card-body pt-2 mt-1">
            <TableContainerListProducts
              columns={columns}
              productList={(productList || [])}
              isLoadingTable={isLoadingTable}
              showProgressBarTable={showProgressBarTable}
              setProductList={setProductList}
              setValidationErrors={setValidationErrors}
              validationErrors={validationErrors}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={rowCount}
              setOpenDrawerImport={setOpenDrawerImport}
              openDrawerImport={openDrawerImport}
            />
          </div>
        </Row>
      </Container>
    </div>
  );
};

