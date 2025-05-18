"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import { BASE_URL } from "../../../../helpers/url_helper";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import ModalAddZone from "../components/ModalAddZone";

const ZonesListPage = () => {
    document.title = "Sedes | Quality";

    const [zoneList, setZoneList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reloadData, setReloadData] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "shortCode", label: "Código corto", type: "text", editable: true, searchable: true },
        { key: "createdAt", label: "Creado", type: "date", editable: false, searchable: true },
    ]


    // Cargar datos
    const fetchZones = async () => {
        setLoading(true);
        setError(null);

        let token = getToken();
        fetch(`${BASE_URL}/users/zones/getAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener las zonas");
                }
                let data = await response.json();
                let zones = data?.data ?? [];
                if (zones && Array.isArray(zones) && zones.length > 0) {
                    setZoneList(zones);
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
        fetchZones();
    }, [reloadData]);

    // Manejadores de eventos
    const handleUpdate = async (updatedItem) => {
        try {
            setError(null);
            if (!updatedItem) {
                setError("No se ha seleccionado ningún item");
                return false
            }
            let token = getToken();
            const response = await fetch(`${BASE_URL}/users/zones/update/${updatedItem._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updatedItem?.name,
                    shortCode: updatedItem?.shortCode
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar la sede")
            }

            // Actualizar estado local
            setZoneList((prev) =>
                prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
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
                setError("No se ha seleccionado ninguna tipo de material");
                return false
            }
            let token = getToken();
            const response = await fetch(`${BASE_URL}/users/zones/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al eliminar la sede")
            }

            // Actualizar estado local
            setZoneList((prev) => prev.filter((item) => item._id !== id))

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
            let token = getToken();
            const response = await fetch(`${BASE_URL}/users/zones/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar las sedes seleccionadas")
            }

            // Actualizar estado local
            setZoneList((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleOpenModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
    }

    const handleCloseModalAdd = () => {
        setOpenModalAdd(false);
    }

    const handleAddItemToList = (newItem) => {
        setZoneList((prev) => [...prev, newItem]);
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de Sedes"
            pageTitleBreadcrumb="Sedes"
            main={
                <Fragment>
                    <ModalAddZone
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd}
                        handleAddItemToList={handleAddItemToList} />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nueva Sede
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={zoneList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Sedes"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchZones}
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

export default ZonesListPage
