"use client"

import { useState, useEffect, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import ModalAddRetention from "../components/modalAddRetention";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { RetentionHelper } from "../helpers/retention-helper";

const helper = new RetentionHelper();

const ListRetentions = () => {
    document.title = "Retenciones | Quality";

    const [retentionList, setRetentionList] = useState([]);
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

        helper.getRetentions()
            .then(async (response) => {
                let retentions = response?.data;
                if (retentions && Array.isArray(retentions) && retentions.length > 0) {
                    setRetentionList(retentions);
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
                setError("No se ha seleccionado ninguna retención");
                return false
            }
            await helper.updateRetention(updateRecord)
            // Actualizar estado local
            setRetentionList((prev) =>
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
            await helper.deleteRetention(id)

            // Actualizar estado local
            setRetentionList((prev) => prev.filter((item) => item._id !== id))

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
            await helper.bulkDeleteRetentions(ids)

            // Actualizar estado local
            setRetentionList((prev) => prev.filter((item) => !ids.includes(item._id)))
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
            titleBreadcrumb="Lista de tipos de retenciones"
            pageTitleBreadcrumb="Retenciones"
            main={
                <Fragment>
                    <ModalAddRetention
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd}
                        handleReload={handleReload}
                    />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nueva Retención
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={retentionList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de retenciones"
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

export default ListRetentions
