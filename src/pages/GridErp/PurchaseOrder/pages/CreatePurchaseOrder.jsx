"use client"

import { useState, useEffect } from "react"
import OrderForm from "../components/order-form"
import { ToastContainer } from "react-toastify"
import { Col, Container, Row } from "reactstrap"
import BreadCrumb from "../../Products/components/BreadCrumb";
import { ProductHelper } from "../../Products/helper/product_helper"


const productHelper = new ProductHelper();

export default function PurchaseOrderPage() {
    const [orderItems, setOrderItems] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const handleGetProducts = async () => {
        try {
            let response = await productHelper.getProductsLite(1, 100);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

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

                    {selectedClient && (
                        <div className="mt-2 p-2 bg-light rounded mb-4">
                            <span className="fw-medium">Cliente: </span>
                            <span>{selectedClient.name}</span>
                            {selectedClient.company && <span className="ms-2 text-muted">({selectedClient.company})</span>}
                        </div>
                    )}

                    <OrderForm
                        onAddItem={addOrderItem}
                        orderItems={orderItems}
                        onUpdateItem={updateOrderItem}
                        onRemoveItem={removeOrderItem}
                        selectedClient={selectedClient}
                        onClientSelect={handleClientSelect}
                        products={products}
                    />

                    <Row className="mt-4">
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
                    </Row>
                </Container>
            </div>
        )
    }
}

