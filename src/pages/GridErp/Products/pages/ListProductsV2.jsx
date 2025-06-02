import { Fragment, useState, useEffect, useContext } from "react"
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView"
import { Alert, Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { FaPlus } from "react-icons/fa"
import DataTable from "../../../../Components/Common/DataTableCustom"
import { useNavigate } from "react-router-dom"
import { ProductHelper } from "../helper/product_helper"
import { UploadIcon } from "lucide-react"
import { ImportProductContext } from "../context/imports/importProductContext"
import { DrawerProductsImport } from "../components/DrawerImportProduct"
import { getToken } from "../../../../helpers/jwt-token-access/get_token"
import { BASE_URL } from "../../../../helpers/url_helper"

const helper = new ProductHelper();
const companyId = '3423f065-bb88-4cc5-b53a-63290b960c1a';
const marketplaces = { woocommerce: 'woocommerce', meli: 'meli' };

const ListProductsV2 = () => {
    document.title = "Productos | Quality Erp";

    const { updateImportData, importData } = useContext(ImportProductContext);
    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [reloadData, setReloadData] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [openDrawerImport, setOpenDrawerImport] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20, });

    const fetchCategories = async () => {
        try {
            let responseData = await helper.getCategoriesFullByCompanySelect(companyId);
            let data = responseData?.data;
            if (data && Array.isArray(data) && data.length > 0) {
                let categories = data.map((c) => {
                    return {
                        value: c?.value,
                        label: c?.label
                    }
                });
                setCategories(categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError(error?.message);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        fetchCategories();
        helper.getProducts(page, limit)
            .then(async (response) => {
                let products = response?.data;
                let totalRowCount = response?.totalRowCount;
                if (products && Array.isArray(products) && products.length > 0) {
                    let parseProducts = products.map((p) => {
                        return {
                            _id: p?._id,
                            image: p?.additionalConfigs?.images?.[0] ?? "",
                            /* name: p?.name, */
                            sku: p?.sku,
                            category: p?.categoryName,
                            subCategory: p?.name,
                            stock: p?.stock,
                            warehouse: p?.warehouseName,
                            salePrice: p?.salePrice,
                            costPrice: p?.costPrice,
                            createdAt: p?.createdAt,
                            syncInfo: p?.syncInfo
                        }
                    });
                    setProductList(parseProducts);
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
        fetchProducts();
    }, [page, limit, reloadData]);

    const handleAddProduct = () => {
        return navigate("/products/lobby")
    };

    const handleOpenDrawer = () => {
        updateImportData({ ...importData, openDrawer: true });
    };

    const handleUpdate = async (updatedProduct) => {
        setError(null);
        if (!updatedProduct) {
            setError("No se ha seleccionado ningún producto");
            return false;
        }
        try {
            let token = getToken();
            const response = await fetch(`${BASE_URL}/products/updateProduct/${updatedProduct._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_category: updatedProduct?.category,
                    name: updatedProduct?.name,
                    salePrice: updatedProduct?.salePrice,
                    costPrice: updatedProduct?.costPrice,
                }),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el producto")
            }

            setProductList((prev) => prev.map((item) => (item._id === updatedProduct._id ? updatedProduct : item)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    };

    const handleDelete = async (id) => {
        setError(null);
        try {
            let token = getToken();
            const response = await fetch(`${BASE_URL}/products/deleteProduct/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Error al eliminar el producto")
            }

            setProductList((prev) => prev.filter((item) => item._id !== id))
            return true
        } catch (error) {
            console.log(error);
            setError(error.message);
            return false
        }
    };

    const handleBulkDelete = async (ids) => { 
        setError(null);
        try {
            let token = getToken();
            const response = await fetch(`${BASE_URL}/products/product/bulkDelete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ids }),
            })

            if (!response.ok) {
                throw new Error("Error al eliminar los productos seleccionados")
            }

            setProductList((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (error) {
            console.log(error);
            setError(error.message);
            return false
        }
    };

    const columns = [
        /*  { key: "name", label: "Nombre", type: "text", editable: true, searchable: true }, */
        { key: "category", label: "Marca", type: "select", editable: true, searchable: true, options: categories},
        { key: "subCategory", label: "Línea", type: "text", editable: true, searchable: true },
       /*  { key: "costPrice", label: "Precio de costo", type: "price", editable: true, searchable: true }, */
        { key: "salePrice", label: "Precio de venta", type: "price", editable: true, searchable: true },
        { key: "createdAt", label: "Creado", type: "date", editable: false, searchable: true },
    ];


    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Lista de de productos"
            pageTitleBreadcrumb="Productos"
            main={
                <Fragment>
                    <DrawerProductsImport
                        openDrawer={openDrawerImport}
                        setOpenDrawer={setOpenDrawerImport}
                    />
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Button title="Nuevo Producto" color="light" onClick={handleAddProduct}>
                                            <FaPlus className="me-1" /> Nuevo
                                        </Button>

                                        <Button title="Importar productos" color="light" onClick={handleOpenDrawer}>
                                            <UploadIcon className="me-1" /> Importar
                                        </Button>
                                    </div>

                                </CardHeader>
                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={productList}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Productos"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchProducts}
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

export default ListProductsV2