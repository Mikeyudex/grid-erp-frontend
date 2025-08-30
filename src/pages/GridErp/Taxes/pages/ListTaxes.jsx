"use client"

import { useState, useEffect, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import ModalAddTax from "../components/modalAddTax";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { TaxHelper } from "../helpers/tax-helper";

const helper = new TaxHelper();

const ListTaxes = () => {
    document.title = "Impuestos | Quality";

    const [taxList, setTaxList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reload, setReload] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "_id", label: "Id", type: "text", editable: false, searchable: true },
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "percentage", label: "Porcentaje", type: "number", editable: true, searchable: true },
        { key: "description", label: "Descripción", type: "text", editable: true, searchable: true },
        { key: "shortCode", label: "Código", type: "text", editable: true, searchable: true },
        { key: "active", label: "Activo", type: "boolean", editable: true, searchable: true },
        { key: "createdAt", label: "Fecha creación", type: "date", editable: false, searchable: true },
    ]

    // Cargar datos
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        helper.getAll()
            .then(async (response) => {
                let taxes = response;
                if (taxes && Array.isArray(taxes) && taxes.length > 0) {
                    setTaxList(taxes);
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
                setError("No se ha seleccionado ningun impuesto");
                return false
            }
            await helper.update(updateRecord)
            // Actualizar estado local
            setTaxList((prev) =>
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
                setError("No se ha seleccionado ninguna retención");
                return false
            }
            await helper.delete(id)

            // Actualizar estado local
            setTaxList((prev) => prev.filter((item) => item._id !== id))

            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleBulkDelete = async (ids) => {
        console.log(ids)
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
            titleBreadcrumb="Lista de impuestos"
            pageTitleBreadcrumb="Impuestos"
            main={
                <Fragment>
                    <ModalAddTax
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd}
                        handleReload={handleReload}
                    />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nuevo Impuesto
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={taxList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de impuestos"
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

export default ListTaxes
