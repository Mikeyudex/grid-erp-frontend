import React, { useEffect, useState, useMemo } from "react";
import {
    Container,
    Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { ToastContainer } from "react-toastify";

import "nouislider/distribute/nouislider.css";
import { optionsSnackbarDanger, optionsSnackbarSuccess } from "../../Products/helper/product_helper";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { CustomerHelper } from "../helper/customer-helper";
import { TableListTypesCustomer } from "../partials/TableListTypesCustomer";

const helper = new CustomerHelper();

export const ListTypeCustomersView = (props) => {
    document.title = "Tipo de clientes | Innventa-G";

    const [typesCustomerList, setTypesCustomerList] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);


    useEffect(() => {
        helper.getTypesCustomer()
            .then(async (typesCustomers) => {
                if (typesCustomers && Array.isArray(typesCustomers) && typesCustomers.length > 0) {
                    setTypesCustomerList(typesCustomers);
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
                header: "Nombre",
                accessorKey: "name",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.name}</h6>)
                }
            },
            {
                header: "Descipción",
                accessorKey: "description",
                enableColumnFilter: false,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.description}</h6>)
                },
            },
            {
                header: "Short Code",
                accessorKey: "shortCode",
                enableColumnFilter: true,
                enableEditing: false,
                size: 40,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.shortCode}</h6>)
                },
            },
            {
                header: "Activo",
                accessorKey: "active",
                enableColumnFilter: true,
                enableEditing: false,
                size: 50,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.active ? "Si" : "No"}</h6>)
                },
            },
        ],
        [typesCustomerList, validationErrors]
    );

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Lista de tipo de clientes" pageTitle="Tipo de clientes" />

                <Row>
                    <div className="card-body pt-2 mt-1">
                        <TableListTypesCustomer
                            columns={columns}
                            list={(typesCustomerList || [])}
                            isLoadingTable={isLoadingTable}
                            showProgressBarTable={showProgressBarTable}
                            setList={setTypesCustomerList}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    );
};

