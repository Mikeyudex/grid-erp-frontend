import React, { useEffect, useState, useMemo, Fragment } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { ToastContainer } from "react-toastify";

import "nouislider/distribute/nouislider.css";
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from "../../Products/helper/product_helper";
import { PurchaseOrderContext } from "../context/purchaseOrderContext";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView"
import { FormatDate } from "../../Products/components/FormatDate";
import { TableListPurchaseOrder } from "../partials/TableListPurchaseOrder";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";
import { IndexedDBService } from "../../../../helpers/indexedDb/indexed-db-helper";

const helper = new ProductHelper();
const indexedDb = new IndexedDBService();

export const ListPurchaseOrder = ({
    status = "asignado",
}) => {
    document.title = "Ordenes de pedido | Quality";

    const navigate = useNavigate();
    const { updatePurchaseOrderData, purchaseOrderData } = React.useContext(PurchaseOrderContext);
    const [purchaseOrderList, setPurchaseOrderList] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [reloadData, setReloadData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countFreeOrders, setCountFreeOrders] = useState(0);

    const fetchPurchaseOrders = async () => {
        setError(null);
        let userData = await indexedDb.getItemById(localStorage.getItem("userId"));
        helper.getPurchaseOrdersFetch(page, limit, userData?.zoneId)
            .then(async (response) => {
                let purchaseOrders = response?.data;
                if (purchaseOrders && Array.isArray(purchaseOrders) && purchaseOrders.length > 0) {
                    let pOrderMap = purchaseOrders.map((po) => {
                        return {
                            ...po,
                            itemsQuantity: po?.details?.reduce((acc, item) => acc + item?.quantityItem, 0),
                            name: po?.clientId?.name,
                            commercialName: po?.clientId?.commercialName,
                            email: po?.clientId?.email,
                            phone: po?.clientId?.phone,
                            shippingAddress: po?.clientId?.shippingAddress,
                        }
                    });
                    setPurchaseOrderList(pOrderMap);
                }
                return;
            })
            .catch(e => {
                openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleFetchPurchaseOrdersFree = async () => {
        setError(null);
        setLoading(true);
        try {
            let data = await helper.getPurchaseOrdersFree(page, limit);
            if (data && Array.isArray(data) && data.length > 0) {
                let pOrderMap = data.map((po) => {
                    return {
                        ...po,
                        itemsQuantity: po?.details?.reduce((acc, item) => acc + item?.quantityItem, 0),
                        name: po?.clientId?.name,
                        commercialName: po?.clientId?.commercialName,
                        email: po?.clientId?.email,
                        phone: po?.clientId?.phone,
                        shippingAddress: po?.clientId?.shippingAddress,
                    }
                });
                setPurchaseOrderList(pOrderMap);
            }
            return;

        } catch (error) {
            console.log(error);
            openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCountFreeOrders = async () => {
        try {
            let data = await helper.getCountPurchaseOrdersByStatus("libre");
            if (data && data?.data !== undefined) {
                setCountFreeOrders(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (status === "asignado") {
            fetchPurchaseOrders();
        } else {
            handleFetchPurchaseOrdersFree();
        }
        fetchCountFreeOrders();
    }, [page, limit, reloadData]);

    const handleClickEditRow = (id) => {
        let pedido = purchaseOrderList.find((po) => po._id === id);
        return navigate(`/purchase-orders/edit/${id}`, { state: { pedido } });
    };

    const handleAddPO = () => {
        return navigate("/purchase-orders/create")
    };

    const handleClickInfoRow = (po) => {
        return navigate(`/purchase-orders/view-detail/${po._id}`);
    };

    const handleFreeOrders = () => {
        return navigate("/purchase-orders/free-orders")
    };

    const columns = [
        { key: "orderNumber", label: "No.", type: "text", editable: false, searchable: true, sortable: true },
        { key: "name", label: "Nombre", type: "text", editable: false, searchable: true, sortable: true, },
        { key: "commercialName", label: "Nombre Comercial", type: "text", editable: false, searchable: true, sortable: true, },
        { key: "email", label: "Email", type: "text", editable: false, searchable: true, sortable: true, },
        { key: "phone", label: "Teléfono", type: "text", editable: false, searchable: true },
        { key: "shippingAddress", label: "Dirección", type: "text", editable: false, searchable: true },
        { key: "itemsQuantity", label: "Cantidad", type: "number", editable: false, searchable: true, sortable: true, },
        { key: "totalOrder", label: "Total", type: "price", editable: false, searchable: true },
        {
            key: "status",
            label: "Estado",
            type: "progress",
            editable: false,
            searchable: true,
            sortable: true,
            progressConfig: {
                itemsKey: 'details',
                stateKey: 'itemStatus',
                stateScores: {
                    'pendiente': 0,
                    'fabricacion': 1,
                    'inventario': 2,
                    'finalizado': 3
                }
            }
        },
        { key: "createdAt", label: "Fecha creación", type: "date", editable: false, searchable: true, sortable: true },
    ]
    return (
        < TopLayoutGeneralView
            titleBreadcrumb={status === "asignado" ? "Pedidos Asignados" : "Pedidos Libres"}
            pageTitleBreadcrumb="Pedidos"
            main={
                < Fragment >
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Button title="Nuevo Pedido" color="light" onClick={handleAddPO}>
                                            <FaPlus className="me-1" /> Nuevo
                                        </Button>
                                        {
                                            status === "asignado" && (
                                                <Button
                                                    title="Pedidos Libres"
                                                    color="light"
                                                    onClick={handleFreeOrders}
                                                    disabled={countFreeOrders === 0}
                                                >
                                                    <FaBell className="me-1" /> Libres <Badge pill color="danger">{countFreeOrders}</Badge>
                                                </Button>
                                            )
                                        }
                                    </div>

                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={purchaseOrderList}
                                        columns={columns}
                                        onUpdate={() => ({})}
                                        onDelete={() => ({})}
                                        onBulkDelete={() => ({})}
                                        title={status === "asignado" ? "Pedidos Asignados" : "Pedidos Libres"}
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchPurchaseOrders}
                                        searchable={true}
                                        itemsPerPage={10}
                                        onClickEditRow={handleClickEditRow}
                                        onClickInfoRow={handleClickInfoRow}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Fragment >
            }
        >
        </TopLayoutGeneralView >
    );
};

