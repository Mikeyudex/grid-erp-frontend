"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";
import { CustomerHelper } from "../helper/customer-helper";
import { CustomerContext } from "../context/customerContext";
import { useNavigate } from "react-router-dom";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { Loader } from "lucide-react";
import { BASE_URL } from "../../../../helpers/url_helper";


const helper = new CustomerHelper();

const ListCustomerV2 = () => {
    document.title = "Clientes | Quality Erp";

    const navigate = useNavigate();
    const { updateCustomerData, customerData } = useContext(CustomerContext);
    const [customerList, setCustomerList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Columnas para la tabla
    const columns = [
        { key: "documento", label: "Documento", type: "text", editable: false, searchable: true },
        { key: "typeCustomerId", label: "Tipo cliente", type: "text", editable: false, searchable: true },
        { key: "name", label: "Nombre", type: "text", editable: false, searchable: true },
        { key: "lastname", label: "Apellidos", type: "text", editable: false, searchable: true },
        { key: "email", label: "Correo", type: "text", editable: false, searchable: true },
        { key: "phone", label: "Teléfono", type: "text", editable: false, searchable: true },
    ]

    // Cargar datos
    const fetchClients = async () => {
        setLoading(true);
        setError(null);

        helper.getCustomers(page, limit)
            .then(async (response) => {
                let customers = response
                if (customers && Array.isArray(customers) && customers.length > 0) {
                    let parseCustomers = customers.map((c) => {
                        return {
                            _id: c?._id,
                            documento: c?.documento,
                            typeCustomerId: c?.typeCustomerId?.name,
                            name: c?.name,
                            lastname: c?.lastname,
                            email: c?.email,
                            phone: c?.phone,
                        }
                    });
                    setCustomerList(parseCustomers);
                }
                return;
            })
            .catch(err => {
                console.error("Error:", err)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchClients();
    }, [page, limit, customerData.reloadTableCustomer]);

    const handleAddCustomer = () => {
        return navigate("/customers-create-v2")
    };

    const handleClickEditRow = (id) => {
        return navigate(`/customers-edit/${id}`)
    };

    const handleUpdate = async (updatedCustomer) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/updateCustomer/${updatedCustomer._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documento: updatedCustomer?.documento,
                    typeCustomerId: updatedCustomer?.typeCustomerId,
                    name: updatedCustomer?.name,
                    lastname: updatedCustomer?.lastname,
                    email: updatedCustomer?.email,
                    phone: updatedCustomer?.phone,
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el cliente")
            }

            // Actualizar estado local
            setCustomerList((prev) => prev.map((item) => (item._id === updatedCustomer._id ? updatedCustomer : item)))
            updateCustomerData({ ...customerData, reloadTableCustomer: !customerData.reloadTableCustomer });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/customers/deleteCustomer/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el cliente")
            }

            // Actualizar estado local
            setCustomerList((prev) => prev.filter((item) => item._id !== id))

            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }

    };

    const handleBulkDelete = async (ids) => {

        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/customers/customer/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los clientes seleccionados")
            }

            // Actualizar estado local
            setCustomerList((prev) => prev.filter((item) => !ids.includes(item._id)))
            updateCustomerData({ ...customerData, reloadTableCustomer: !customerData.reloadTableCustomer });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
     };

     if(loading) {
        return <Loader/>
     }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de de clientes"
            pageTitleBreadcrumb="Clientes"
            main={
                <Fragment>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleAddCustomer}>
                                        <FaPlus className="me-1" /> Nuevo Cliente
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={customerList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Clientes"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchClients}
                                        searchable={true}
                                        itemsPerPage={10}
                                        onClickEditRow={handleClickEditRow}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Fragment>
            }
        >
        </TopLayoutGeneralView >
    )

}

export default ListCustomerV2;