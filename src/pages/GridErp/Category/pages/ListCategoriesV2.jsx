"use client"

import { useState, useEffect, useContext, Fragment } from "react"
import { Row, Col, Card, CardHeader, CardBody, Button, Alert } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "../../../../Components/Common/DataTableCustom";
import { CategoryHelper } from "../helper/category_helper";
import { useNavigate } from "react-router-dom";
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView";
import { Loader } from "lucide-react";
import { BASE_URL } from "../../../../helpers/url_helper";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { CategoryProductContext } from "../context/categoryProductContext";
import { DrawerCreateCategory } from "../components/DrawerCreateCategory";


const helper = new CategoryHelper();

const ListCategoriesV2 = () => {
    document.title = "Categorías | Quality Erp";

    const { updateCategoryData, categoryData } = useContext(CategoryProductContext);
    const navigate = useNavigate();
    const [categoryList, setCategoryList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [rowCount, setRowCount] = useState(0);
    const [reload, setReload] = useState(false);

    // Columnas para la tabla
    const columns = [
        { key: "name", label: "Nombre", type: "text", editable: true, searchable: true },
        { key: "shortCode", label: "Código corto", type: "text", editable: true, searchable: true },
        { key: "description", label: "Descripción", type: "text", editable: true, searchable: true },
        { key: "createdAt", label: "Creado", type: "date", editable: false, searchable: true },
    ]

    // Cargar datos
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);

        helper.getCategories(page, limit)
            .then(async (response) => {
                let categories = response?.data;
                let totalRowCount = response?.totalRowCount;
                if (categories && Array.isArray(categories) && categories.length > 0) {
                    let parseCategories = categories.map((c) => {
                        return {
                            _id: c?._id,
                            name: c?.name,
                            shortCode: c?.shortCode,
                            description: c?.description,
                            createdAt: c?.createdAt,
                        }
                    });
                    setCategoryList(parseCategories);
                    setRowCount(totalRowCount);
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
        fetchCategories();
    }, [page, limit, reload]);

    const handleAddCategory = () => {
        updateCategoryData({ ...categoryData, openDrawer: true });
    };

    const handleUpdate = async (updatedCategory) => {
        setError(null);
        if (!updatedCategory) {
            setError("No se ha seleccionado ninguna categoría")
            return false
        }
        try {
            let token = getToken();
            const response = await fetch(`${BASE_URL}/products/category/update/${updatedCategory?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updatedCategory?.name,
                    shortCode: updatedCategory?.shortCode,
                    description: updatedCategory?.description
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar la categoría")
            }
            setSuccessMessage("Categoría actualizada correctamente");
            //actualizar estado local
            setCategoryList((prev) => prev.map((item) => (item._id === updatedCategory._id ? updatedCategory : item)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    };

    const handleDelete = async (id) => {
        try {
            let token = getToken();
            const response = await fetch(`${BASE_URL}/products/category/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el cliente")
            }

            setSuccessMessage("Categoría eliminada correctamente");
            //actualizar estado local
            setCategoryList((prev) => prev.filter((item) => item._id !== id))
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
            let token = getToken();
            const response = await fetch(`${BASE_URL}/products/category/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los clientes seleccionados")
            }
            setSuccessMessage("Categorías eliminadas correctamente");
            //actualizar estado local
            setCategoryList((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    };

    if (loading) {
        return <Loader />
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de Categorías"
            pageTitleBreadcrumb="Categorías"
            main={
                <Fragment>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <Button color="light" onClick={handleAddCategory}>
                                        <FaPlus className="me-1" /> Nueva Categoría
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}
                                    {
                                        successMessage && (
                                            <Alert color="success" toggle={() => setSuccessMessage(null)}>
                                                {successMessage}
                                            </Alert>
                                        )
                                    }

                                    <DrawerCreateCategory />

                                    <DataTable
                                        data={categoryList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Categorías"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchCategories}
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

export default ListCategoriesV2;