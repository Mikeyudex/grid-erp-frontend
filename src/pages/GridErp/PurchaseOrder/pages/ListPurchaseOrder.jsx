import React, { useEffect, useState, useMemo } from "react";
import {
    Container,
    Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { ToastContainer } from "react-toastify";

import "nouislider/distribute/nouislider.css";
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from "../../Products/helper/product_helper";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { PurchaseOrderContext } from "../context/purchaseOrderContext";
import { FormatDate } from "../../Products/components/FormatDate";
import { TableListPurchaseOrder } from "../partials/TableListPurchaseOrder";
import { Link } from "react-router-dom";

const helper = new ProductHelper();

export const ListPurchaseOrder = (props) => {
    document.title = "Ordenes de pedido | Quality";

    const { updatePurchaseOrderData, purchaseOrderData } = React.useContext(PurchaseOrderContext);
    const [purchaseOrderList, setPurchaseOrderList] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(50);


    useEffect(() => {
        helper.getPurchaseOrders(page, limit, ["_id", "itemsQuantity", "totalOrder", "status", "createdAt"])
            .then(async (response) => {
                let purchaseOrders = response?.data;
                if (purchaseOrders && Array.isArray(purchaseOrders) && purchaseOrders.length > 0) {
                    setPurchaseOrderList(purchaseOrders);
                    updatePurchaseOrderData({ ...purchaseOrderData, purchaseOrderList: [...purchaseOrderData.purchaseOrderList, purchaseOrders] });
                }
                return;
            })
            .catch(e => {
                openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
                console.log(e);
            })
            .finally(() => {
                setIsLoadingTable(false);
                setShowProgressBarTable(false);
            });
    }, []);


    const columns = useMemo(() =>
        [
            {
                header: "Id",
                accessorKey: "id",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 30,
                Cell: ({ cell }) => {
                    return (
                        <Link to={`/purchase-orders/view-detail/${cell.row.original._id}`}>
                            <h6>{cell.row.original._id}</h6>
                        </Link>
                    )
                }
            },
            {
                header: "Cantidad",
                accessorKey: "itemsQuantity",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.itemsQuantity}</h6>)
                }
            },
            {
                header: "Total",
                accessorKey: "totalOrder",
                enableColumnFilter: false,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.totalOrder.toLocaleString()}</h6>)
                },
            },
            {
                header: "Estado",
                accessorKey: "status",
                enableColumnFilter: true,
                enableEditing: false,
                size: 40,
                Cell: ({ cell }) => {
                    return (
                        <h6
                            className={`${cell.row.original.status === "pendiente" ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"} badge text-uppercase`}
                            style={{
                                color: cell.row.original.status === 'pendiente' ? '#de6c37' : '#0eb6b6',
                                fontWeight: cell.row.original.status === 'pendiente' ? 'normal' : 'bold',
                            }}>
                            {cell.row.original.status}
                        </h6>)
                },
            },
            {
                header: "Fecha creación",
                accessorKey: "createdAt",
                enableColumnFilter: true,
                enableEditing: false,
                size: 50,
                Cell: ({ cell }) => {
                    return <FormatDate {...cell} />;
                },
            },
        ],
        [purchaseOrderList, validationErrors]
    );

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Lista de pedidos" pageTitle="Ordenes de pedido" />
                <Row>
                    <div className="card-body pt-2 mt-1">
                        <TableListPurchaseOrder
                            columns={columns}
                            list={(purchaseOrderList || [])}
                            isLoadingTable={isLoadingTable}
                            showProgressBarTable={showProgressBarTable}
                            setList={setPurchaseOrderList}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    );
};

