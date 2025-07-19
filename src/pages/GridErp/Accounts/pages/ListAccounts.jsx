"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import ModalAddAccount from "../components/ModalAddAccount";
import { BASE_URL } from "../../../../helpers/url_helper";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { AccountHelper } from "../helpers/account_helper";

const helper = new AccountHelper();

const ListAccounts = () => {
    document.title = "Cuentas | Quality";

    const [accountList, setAccountList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [reload, setReload] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "_id", label: "Id", type: "text", editable: false, searchable: true },
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "typeAccount", label: "Tipo de Cuenta", type: "text", editable: true, searchable: true },
        { key: "bankAccount", label: "Banco", type: "text", editable: true, searchable: true },
        { key: "numberAccount", label: "Número de Cuenta", type: "text", editable: true, searchable: true },
        { key: "isActive", label: "Activa", type: "boolean", editable: true, searchable: true },
    ]

    // Cargar datos
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        helper.getAccounts()
            .then(async (response) => {
                let accounts = response?.data;
                if (accounts && Array.isArray(accounts) && accounts.length > 0) {
                    setAccountList(accounts);
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
    const handleUpdate = async (updatedMatMaterialPrice) => {
        try {
            setError(null);
            if (!updatedMatMaterialPrice) {
                setError("No se ha seleccionado ninguna tipo de material");
                return false
            }
            let token = getToken();
            const response = await fetch(`${BASE_URL}/precios-tapete-material/${updatedMatMaterialPrice._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tipo_tapete: updatedMatMaterialPrice?.tipo_tapete,
                    tipo_material: updatedMatMaterialPrice?.tipo_material,
                    precioBase: updatedMatMaterialPrice?.precioBase,
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el tipo de cliente")
            }

            // Actualizar estado local
            setMatMaterialPriceList((prev) =>
                prev.map((item) => (item._id === updatedMatMaterialPrice._id ? updatedMatMaterialPrice : item))
            )
            updateMatMaterialPriceData({ ...matMaterialPriceData, reloadTableMatMaterialPriceList: !matMaterialPriceData.reloadTableMatMaterialPriceList });
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
            const response = await fetch(`${BASE_URL}/precios-tapete-material/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el tipo de cliente")
            }

            // Actualizar estado local
            setMatMaterialPriceList((prev) => prev.filter((item) => item._id !== id))

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
            const response = await fetch(`${BASE_URL}/precios-tapete-material/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los tipos de material seleccionados")
            }

            // Actualizar estado local
            setMatMaterialPriceList((prev) => prev.filter((item) => !ids.includes(item._id)))
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

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de cuentas"
            pageTitleBreadcrumb="Cuentas"
            main={
                <Fragment>
                    <ModalAddAccount
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd} />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nueva Cuenta
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={accountList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de cuentas"
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

export default ListAccounts
