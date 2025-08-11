'use client'

import React, { useState, useEffect, Fragment } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { PaymentHelper } from "../payments-helper"
import DataTable from "../../../../Components/Common/DataTableCustom"
import { TopLayoutGeneralView } from '../../../../Components/Common/TopLayoutGeneralView'
import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const paymentHelper = new PaymentHelper()

export default function PaymentListPage() {
    const navigate = useNavigate();

    const [incomes, setIncomes] = React.useState();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        paymentHelper.getAllIncome()
            .then(async (response) => {
                let incomes = response?.data;
                if (incomes && Array.isArray(incomes) && incomes.length > 0) {
                    setIncomes(incomes);
                }
                return;
            })
            .catch(e => {
                console.error("Error:", err)
                setError(err.message)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { key: "typeOperation", label: "Tipo de Operación", type: "text", searchable: true, sortable: true },
        { key: "paymentDate", label: "Fecha de Pago", type: "date", searchable: true, sortable: true },
        { key: "value", label: "Valor", type: "number", searchable: true, sortable: true },
        { key: "displayAccountId", label: "Cuenta", type: "text", searchable: true, sortable: true },
        { key: "displayPurchaseOrderId", label: "ID Pedido", type: "text", searchable: true, sortable: true },
        { key: "observations", label: "Observaciones", type: "text", searchable: true, sortable: false },
        { key: "createdAt", label: "Fecha Creación", type: "date", searchable: true, sortable: true },
    ]

    const handleUpdate = async (updatedIncome) => {
        try {
            setError(null);
            if (!updatedIncome) {
                setError("No se ha seleccionado ninguna cuenta");
                return false
            }
            await paymentHelper.updateIncome(updatedIncome)
            // Actualizar estado local
            setIncomes((prev) =>
                prev.map((item) => (item._id === updatedIncome._id ? updatedIncome : item))
            )
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleDelete = async (id) => {
        try {
            setError(null);
            if (!id) {
                setError("No se ha seleccionado ninguna cuenta");
                return false
            }
            await paymentHelper.deleteIncome(id)

            // Actualizar estado local
            setIncomes((prev) => prev.filter((item) => item._id !== id))

            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleBulkDelete = async (ids) => {
        setError(null);
        try {
            await paymentHelper.bulkDeleteIncomes(ids)

            // Actualizar estado local
            setIncomes((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb={"Listado de Pagos"}
            pageTitleBreadcrumb="Pagos"
            to={`/payments-list`}
            main={
                <Fragment>

                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={() => navigate("/payments-register")}>
                                        <FaPlus className="me-1" /> Nuevo Pago
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={incomes}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de pagos"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchData}
                                        searchable={true}
                                        itemsPerPage={10}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Fragment>
            }
        >
        </ TopLayoutGeneralView>
    )
}
