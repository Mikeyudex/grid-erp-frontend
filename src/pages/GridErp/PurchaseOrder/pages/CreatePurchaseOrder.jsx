"use client"

import { useState, useEffect } from "react"
import OrderForm from "../components/order-form"
import { ToastContainer } from "react-toastify"
import { Col, Container, Row } from "reactstrap"
import BreadCrumb from "../../Products/components/BreadCrumb";
import { ProductHelper } from "../../Products/helper/product_helper"
import { obtenerAtributosUnicos, transformarDatos } from "../utils/order"
import OrderGrid from "../components/order-item-grid"


const productHelper = new ProductHelper();

export default function PurchaseOrderPage() {
    const [orderItems, setOrderItems] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [clients, setClients] = useState([]);
    const [typeOfPieces, setTypeOfPieces] = useState([]);
    const [matMaterialPrices, setMatMaterialPrices] = useState([]);
    const [matTypeOptions, setMatTypeOptions] = useState([]);
    const [materialTypeOptions, setMaterialTypeOptions] = useState([]);

    const handleGetProducts = async () => {
        try {
            let response = await productHelper.getProductsLite(1, 100);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetClients = async () => {
        try {
            let response = await productHelper.getClients(0, 100, ["_id", "name", "lastname", "commercialName", "email"]);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetTypeOfPieces = async () => {
        try {
            let response = await productHelper.getTypeOfPieces();
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetMatMaterialPrices = async () => {
        try {
            let response = await productHelper.getMatMaterialPrices();
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const addOrderItem = (item) => {
        setOrderItems([...orderItems, item])
    }

    const updateOrderItem = (index, item) => {
        const newItems = [...orderItems]
        newItems[index] = item
        setOrderItems(newItems)
    }

    const removeOrderItem = (index) => {
        const newItems = [...orderItems]
        newItems.splice(index, 1)
        setOrderItems(newItems)
    }

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.finalPrice || 0), 0)
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client)
    };

    useEffect(() => {
        handleGetClients()
            .then(async (data) => {
                let clients = (data || [])
                    .map((c) => ({ ...c, id: c._id, name: `${c.name} ${c.lastname}`, company: c.commercialName }));
                setClients(clients);
            })
            .catch(e => console.log(e))
    }, []);

    useEffect(() => {
        handleGetTypeOfPieces()
            .then(async (data) => {
                setTypeOfPieces(data);
            })
            .catch(e => console.log(e))
    }, []);

    useEffect(() => {
        handleGetMatMaterialPrices()
            .then(async (data) => {
                //mapear los objetos que sean diferentes

                let matTypeOptions = obtenerAtributosUnicos(data, "tipo_tapete");
                let materialTypeOptions = obtenerAtributosUnicos(data, "tipo_material");
                setMatTypeOptions(matTypeOptions);
                setMaterialTypeOptions(materialTypeOptions);
                let transformedData = transformarDatos(data);
                console.log(transformedData);
                setMatMaterialPrices(transformedData);
            })
            .catch(e => console.log(e))
    }, []);

    useEffect(() => {
        handleGetProducts()
            .then(async (data) => {
                let products = data;
                setProducts(products);
            })
            .catch(e => console.log(e))
            .finally(() => {
                setIsLoadingProducts(false);
            });
    }, []);

    if (isLoadingProducts) {
        return (
            <div className="page-content">
                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Crear Orden de Pedido" pageTitle="Pedidos" />

                    <div className="d-flex justify-content-center mt-5">
                        <div className="spinner-border text-primary" role="status">
                        </div>
                        <h6 className="ms-3 fw-semibold">Cargando productos...</h6>
                    </div>
                </Container>
            </div>
        )
    } else {
        return (
            <div className="page-content">
                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Crear Orden de Pedido" pageTitle="Pedidos" />

                    {/* {selectedClient && (
                        <div className="mt-2 p-2 bg-light rounded mb-4">
                            <span className="fw-medium">Cliente: </span>
                            <span>{selectedClient.name}</span>
                            {selectedClient.company && <span className="ms-2 text-muted">({selectedClient.company})</span>}
                        </div>
                    )} */}

                    {/* <OrderForm
                        onAddItem={addOrderItem}
                        orderItems={orderItems}
                        onUpdateItem={updateOrderItem}
                        onRemoveItem={removeOrderItem}
                        selectedClient={selectedClient}
                        onClientSelect={handleClientSelect}
                        products={products}
                        clients={clients}
                        typeOfPieces={typeOfPieces}
                        matMaterialPrices={matMaterialPrices}
                        matTypeOptions={matTypeOptions}
                        materialTypeOptions={materialTypeOptions}
                    /> */}

                    {/*    <Row className="mt-4">
                        <Col>
                            <div className="bg-light p-3 rounded shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h2 className="h5 fw-semibold mb-0">Total del Pedido:</h2>
                                    <span className="h4 fw-bold mb-0">${calculateTotal().toLocaleString()}</span>
                                </div>

                                <div className="mt-3 d-flex justify-content-end">
                                    <button className="btn btn-success" disabled={!selectedClient}>
                                        Finalizar Pedido
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row> */}

                    <OrderGrid
                        selectedClient={selectedClient}
                        onClientSelect={handleClientSelect}
                        clients={clients}
                        products={products}
                        typeOfPieces={typeOfPieces}
                        matMaterialPrices={matMaterialPrices}
                        matTypeOptions={matTypeOptions}
                        materialTypeOptions={materialTypeOptions}
                    />
                </Container>
            </div>
        )
    }
}

