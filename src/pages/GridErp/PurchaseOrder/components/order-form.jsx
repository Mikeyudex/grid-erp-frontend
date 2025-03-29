"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Edit2 } from "lucide-react"
import OrderItemForm from "./order-item-form"
import { Button, Table } from "reactstrap"


export default function OrderForm({ orderItems, onAddItem, onUpdateItem, onRemoveItem }) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)

    const handleAddItem = (item) => {
        onAddItem(item)
        setIsAdding(false)
    }

    const handleUpdateItem = (item) => {
        if (editingIndex !== null) {
            onUpdateItem(editingIndex, item)
            setEditingIndex(null)
        }
    }

    const handleEditItem = (index) => {
        setEditingIndex(index)
        setIsAdding(false)
    }

    const handleCancelEdit = () => {
        setEditingIndex(null)
    }

    const handleCancelAdd = () => {
        setIsAdding(false)
    }

    return (
        <div>
            {/* Order Items List */}
            {orderItems.length > 0 && (
                <div className="table-responsive mb-4">
                    <Table hover>
                        <thead>
                            <tr className="bg-light">
                                <th>Producto</th>
                                <th>Tapete</th>
                                <th>Material</th>
                                <th>Cant.</th>
                                <th className="text-end">Precio</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="fw-medium">{item.productName}</div>
                                        <div className="small text-muted">{item.pieces} piezas</div>
                                    </td>
                                    <td>{item.matType}</td>
                                    <td>{item.materialType}</td>
                                    <td>{item.quantity}</td>
                                    <td className="text-end fw-medium">${item.finalPrice?.toLocaleString()}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button
                                                color="link"
                                                className="p-1 text-primary"
                                                onClick={() => handleEditItem(index)}
                                                aria-label="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button
                                                color="link"
                                                className="p-1 text-danger"
                                                onClick={() => onRemoveItem(index)}
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Add New Item Button */}
            {!isAdding && editingIndex === null && (
                <Button color="primary" onClick={() => setIsAdding(true)} className="d-flex align-items-center gap-2">
                    <PlusCircle size={18} />
                    Añadir Producto
                </Button>
            )}

            {/* Add New Item Form */}
            {isAdding && (
                <div className="border rounded p-3 mt-4 bg-white shadow-sm">
                    <h3 className="h5 fw-semibold mb-3">Añadir Producto</h3>
                    <OrderItemForm onSubmit={handleAddItem} onCancel={handleCancelAdd} />
                </div>
            )}

            {/* Edit Item Form */}
            {editingIndex !== null && (
                <div className="border rounded p-3 mt-4 bg-white shadow-sm">
                    <h3 className="h5 fw-semibold mb-3">Editar Producto</h3>
                    <OrderItemForm
                        initialValues={orderItems[editingIndex]}
                        onSubmit={handleUpdateItem}
                        onCancel={handleCancelEdit}
                    />
                </div>
            )}
        </div>
    )
}

