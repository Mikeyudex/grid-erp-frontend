import React, { useEffect, useState, useMemo } from "react";
import {
    Container,
    Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

import "nouislider/distribute/nouislider.css";
import { optionsSnackbarDanger, optionsSnackbarSuccess } from "../../Products/helper/product_helper";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { CustomerHelper } from "../helper/customer-helper";
import { TableListCustomers } from "../partials/TableListCustomers";

const helper = new CustomerHelper();

export const ListCustomersView = (props) => {
    document.title = "Clientes | Innventa-G";

    const [customerList, setCustomerList] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(50);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);


    useEffect(() => {
        helper.getCustomers(page, limit)
            .then(async (customers) => {
                if (customers && Array.isArray(customers) && customers.length > 0) {
                    setCustomerList(customers);
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
                header: "Documento",
                accessorKey: "documento",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 30,
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
                header: "Tipo cliente",
                accessorKey: "typeCustomerId.name",
                enableColumnFilter: false,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.typeCustomerId.name}</h6>)
                },
            },
            {
                header: "Nombre",
                accessorKey: "name",
                enableColumnFilter: true,
                enableEditing: false,
                size: 40,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.name}</h6>)
                },
            },
            {
                header: "Apellidos",
                accessorKey: "lastname",
                enableColumnFilter: true,
                enableEditing: false,
                size: 50,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.lastname}</h6>);
                },
            },
            {
                header: "Correo",
                accessorKey: "email",
                enableColumnFilter: true,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.email}</h6>);
                },
            },
            {
                header: "Teléfono",
                accessorKey: "phone",
                enableColumnFilter: false,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.phone}</h6>)
                },
            }
        ],
        [customerList, validationErrors]
    );

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Lista de clientes" pageTitle="Clientes" />

                <Row>
                    <div className="card-body pt-2 mt-1">
                        <TableListCustomers
                            columns={columns}
                            list={(customerList || [])}
                            isLoadingTable={isLoadingTable}
                            showProgressBarTable={showProgressBarTable}
                            setList={setCustomerList}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    );
};

