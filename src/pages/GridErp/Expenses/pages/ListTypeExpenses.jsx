"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import ModalAddTypeExpense from "../components/modalAddTypeExpense";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { ExpensesHelper } from "../helpers/expenses_helper";

const helper = new ExpensesHelper();

const ListTypeExpenses = () => {
    document.title = "Tipos de Egreso | Quality";

    const [typeExpensesList, setTypeExpensesList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reload, setReload] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "_id", label: "Id", type: "text", editable: false, searchable: true },
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "code", label: "Código", type: "text", editable: true, searchable: true },
        { key: "createdAt", label: "Fecha creación", type: "date", editable: false, searchable: true },
    ]

    // Cargar datos
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        helper.getTypeOfExpenses()
            .then(async (response) => {
                let typeExpenses = response?.data;
                if (typeExpenses && Array.isArray(typeExpenses) && typeExpenses.length > 0) {
                    setTypeExpensesList(typeExpenses);
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
    }, [reload]);

    // Manejadores de eventos
    const handleUpdate = async (updateRecord) => {
        try {
            setError(null);
            if (!updateRecord) {
                setError("No se ha seleccionado ninguna cuenta");
                return false
            }
            await helper.updateTypeExpense(updateRecord)
            // Actualizar estado local
            setTypeExpensesList((prev) =>
                prev.map((item) => (item._id === updateRecord._id ? updateRecord : item))
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
                setError("No se ha seleccionado ningún tipo de Egreso");
                return false
            }
            await helper.deleteTypeExpense(id)

            // Actualizar estado local
            setTypeExpensesList((prev) => prev.filter((item) => item._id !== id))

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
            await helper.bulkDeleteTypeExpenses(ids)

            // Actualizar estado local
            setTypeExpensesList((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleOpenModalAdd = () => {
        setOpenModalAdd(true);
    }

    const handleCloseModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
    }

    const handleReload = () => {
        setReload(!reload);
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de tipos de Egreso"
            pageTitleBreadcrumb="Tipos de Egreso"
            main={
                <Fragment>
                    <ModalAddTypeExpense
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd}
                        handleReload={handleReload}
                    />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nuevo Tipo de Egreso
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={typeExpensesList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de tipos de Egresos"
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
        </TopLayoutGeneralView >

    )
}

export default ListTypeExpenses
