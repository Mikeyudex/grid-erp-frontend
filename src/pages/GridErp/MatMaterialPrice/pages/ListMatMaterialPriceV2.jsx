"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";

import ModalAddMaterialPrice from "../components/ModalAddMatMaterialPrice";
import { BASE_URL } from "../../../../helpers/url_helper";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { ProductHelper } from "../../Products/helper/product_helper";
import { MatMaterialPriceContext } from "../context/Context";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";

const helper = new ProductHelper();

const ListMatMaterialPriceV2 = () => {
    document.title = "Tipo - Material | Quality";

    const { updateMatMaterialPriceData, matMaterialPriceData } = useContext(MatMaterialPriceContext);

    const [matMaterialPriceList, setMatMaterialPriceList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [openModalAdd, setOpenModalAdd] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "tipo_tapete", label: "Tipo", type: "text", editable: true, searchable: true },
        { key: "tipo_material", label: "Material", type: "text", editable: true, searchable: true },
        { key: "precioBase", label: "Precio Base", type: "price", editable: true, searchable: true },
    ]


    // Cargar datos
    const fetchMatMaterialPrices = async () => {
        setLoading(true);
        setError(null);

        helper.getMatMaterialPrices()
            .then(async (response) => {
                let matMaterialPrices = response;
                if (matMaterialPrices && Array.isArray(matMaterialPrices) && matMaterialPrices.length > 0) {
                    setMatMaterialPriceList(matMaterialPrices);
                    updateMatMaterialPriceData({ ...matMaterialPriceData, matMaterialPriceList: [...matMaterialPriceData.matMaterialPriceList, matMaterialPrices] });
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
        fetchMatMaterialPrices();
    }, [matMaterialPriceData.reloadTableMatMaterialPriceList]);

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
            const response = await fetch(`${BASE_URL}/customers/typeCustomer/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los tipos de cliente seleccionados")
            }

            // Actualizar estado local
            setClientTypes((prev) => prev.filter((item) => !ids.includes(item._id)))
            updateCustomerData({ ...customerData, reloadTableTypeCustomer: !customerData.reloadTableTypeCustomer });
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleOpenModalAdd = () => {
        updateMatMaterialPriceData({ ...matMaterialPriceData, openModalAddMaterialPrice: true });
    }

    const handleCloseModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
        updateMatMaterialPriceData({ ...matMaterialPriceData, openModalAddMaterialPrice: !matMaterialPriceData.openModalAddMaterialPrice });
    }

    useEffect(() => {
        setOpenModalAdd(matMaterialPriceData.openModalAddMaterialPrice);
    }, [matMaterialPriceData.openModalAddMaterialPrice]);

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de tipo - material"
            pageTitleBreadcrumb="Tipo - Material"
            main={
                <Fragment>
                    <ModalAddMaterialPrice
                        isOpen={openModalAdd}
                        closeModal={handleCloseModalAdd} />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleOpenModalAdd}>
                                        <FaPlus className="me-1" /> Nuevo Tipo
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={matMaterialPriceList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de tipo - material"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchMatMaterialPrices}
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

export default ListMatMaterialPriceV2
