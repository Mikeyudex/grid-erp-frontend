import React, { useEffect, useState, useMemo } from "react";
import {
    Container,
    Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

import "nouislider/distribute/nouislider.css";
import { optionsSnackbarDanger, optionsSnackbarSuccess, StockHelper } from "../helper/stock_helper";
import { FormatDate } from "../../Products/components/FormatDate";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { ProductHelper } from "../../Products/helper/product_helper";
import { TableTransferStock } from "../partials/TableTranferStock";
import { CreateTransferStock } from "../components/CreateTransferStock";

const helper = new StockHelper();
const helperProduct = new ProductHelper();
const companyId = '66becedd790bddbc9b1e2cbc';

export const TransferStockView = (props) => {
    document.title = "Stock | Innventa-G";

    const [movementList, setMovementList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(true);
    const [dataSelectWarehouses, setDataSelectWarehouses] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);

    const toggleDrawer = () => {
        setShowCreateModal(!showCreateModal);
    }

    useEffect(() => {
        helper.getAllTransfer(page, limit, companyId, "transfer")
            .then(async (movements) => {
                if (movements && Array.isArray(movements) && movements.length > 0) {
                    let parsemovements = movements.map((m) => {
                        return {
                            movementId: m?.id,
                            companyId: m?.companyId,
                            originWarehouseId: m?.warehouseId,
                            originWarehouseName: m?.warehouseName,
                            destinationWarehouseId : m?.destinationWarehouseId,
                            destinationWarehouseName: m?.destinationWarehouseName,
                            quantity: m?.quantity,
                            createdAt: m?.createdAt,
                            reason: m?.reason,
                            createdBy: m?.createdBy,
                            createdByName: m?.createdByName,
                            createdByLastName: m?.createdByLastName,
                        }
                    });
                    setMovementList(parsemovements);
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
    }, [showCreateModal]);


    useEffect(() => {
        helperProduct.getWarehouseByCompanySelect(companyId)
            .then(async (response) => {
                setDataSelectWarehouses(response ?? []);
            }).catch(e => {
                openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
                console.log(e);
            })
    }, []);


    const columns = useMemo(() =>
        [
            {
                header: "Id",
                accessorKey: "movementId",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 100,
                Cell: ({ cell }) => (
                    <>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <h5 className="fs-14 mb-1">
                                    <Link
                                        to="/apps-ecommerce-product-details"
                                        className="text-body"
                                    >
                                        {" "}
                                        {cell.getValue()}
                                    </Link>
                                </h5>
                            </div>
                        </div>
                    </>
                ),
            },
            {
                header: "Bodega origen",
                accessorKey: "originWarehouseId",
                enableColumnFilter: true,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.originWarehouseName}</h6>)
                },
            },
            {
                header: "Bodega destino",
                accessorKey: "destinationWarehouseId",
                enableColumnFilter: true,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.destinationWarehouseName}</h6>)
                },
            },
            {
                header: "Cantidad",
                accessorKey: "quantity",
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.quantity}</h6>)
                },
            },
            {
                header: "Fecha",
                accessorKey: "createdAt",
                enableEditing: false,
                Cell: ({ cell }) => {
                    return <FormatDate {...cell} />;
                },
            },
            {
                header: "Nota",
                accessorKey: "reason",
                enableColumnFilter: false,
                enableEditing: true,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.reason}</h6>)
                },
            },
            {
                header: "Responsable",
                accessorKey: "createdBy",
                enableColumnFilter: true,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.createdByName} {cell.row.original.createdByLastName}</h6>)
                },
            },
        ],
        []
    );

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Traslados" pageTitle="Stock" />

                <Row>
                    <div className="card-body pt-2 mt-1">
                        <CreateTransferStock
                            openDrawer={showCreateModal}
                            toggleDrawer={toggleDrawer}
                            dataSelectWarehouses={dataSelectWarehouses}
                        />
                        <TableTransferStock
                            columns={columns}
                            movementList={(movementList || [])}
                            isLoadingTable={isLoadingTable}
                            showProgressBarTable={showProgressBarTable}
                            setMovementList={setMovementList}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                            toggleDrawer={toggleDrawer}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    );
};

