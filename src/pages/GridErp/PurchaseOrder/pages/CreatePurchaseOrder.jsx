"use client"

import { useState } from "react"
import OrderForm from "../components/order-form"
import { ToastContainer } from "react-toastify"
import { Col, Container, Row } from "reactstrap"
import BreadCrumb from "../../Products/components/BreadCrumb"

export default function PurchaseOrderPage() {
    const [orderItems, setOrderItems] = useState([])

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
    }

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Crear Orden de Pedido" pageTitle="Pedidos" />

                <OrderForm
                    onAddItem={addOrderItem}
                    orderItems={orderItems}
                    onUpdateItem={updateOrderItem}
                    onRemoveItem={removeOrderItem}
                />

                <Row className="mt-4">
                    <Col>
                        <div className="bg-light p-3 rounded shadow-sm">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h5 fw-semibold mb-0">Total del Pedido:</h2>
                                <span className="h4 fw-bold mb-0">${calculateTotal().toLocaleString()}</span>
                            </div>

                            <div className="mt-3 d-flex justify-content-end">
                                <button className="btn btn-success">Finalizar Pedido</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

