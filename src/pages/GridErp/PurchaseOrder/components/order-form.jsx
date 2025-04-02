"use client"

import { useState } from "react"
import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    InputGroup,
    InputGroupText,
} from "reactstrap"
import { PlusCircle, Trash2, Edit2, User, Search } from "lucide-react";
import OrderItemForm from "./order-item-form"


export default function OrderForm({
    orderItems,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    selectedClient,
    onClientSelect,
    products
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [clientSearchTerm, setClientSearchTerm] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);

    // Sample client list - in a real app, this would come from an API
    const clients = [
        { id: 1, name: "Juan Pérez", company: "Empresa A", email: "juan@empresaa.com" },
        { id: 2, name: "María López", company: "Empresa B", email: "maria@empresab.com" },
        { id: 3, name: "Carlos Rodríguez", company: "Empresa C", email: "carlos@empresac.com" },
        { id: 4, name: "Ana Martínez", company: "Empresa D", email: "ana@empresad.com" },
        { id: 5, name: "Pedro Sánchez", company: null, email: "pedro@gmail.com" },
        { id: 6, name: "Laura García", company: "Empresa E", email: "laura@empresae.com" },
    ]

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

    const toggleClientModal = () => {
        setClientModalOpen(!clientModalOpen)
        if (!clientModalOpen) {
            setFilteredClients(clients)
            setClientSearchTerm("")
        }
    }

    const toggleAddItemForm = () => {
        setIsAdding(!isAdding);
    }

    const toggleUpdateItemForm = () => {
        setEditingIndex(null);
    }

    const handleClientSearch = (e) => {
        const searchTerm = e.target.value
        setClientSearchTerm(searchTerm)

        if (searchTerm.trim() === "") {
            setFilteredClients(clients)
        } else {
            const filtered = clients.filter(
                (client) =>
                    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())),
            )
            setFilteredClients(filtered)
        }
    }

    const handleSelectClient = (client) => {
        onClientSelect(client)
        toggleClientModal()
    }

    return (
        <div>
            {/* Client Selection Modal */}
            <Modal isOpen={clientModalOpen} toggle={toggleClientModal}>
                <ModalHeader toggle={toggleClientModal}>Seleccionar Cliente</ModalHeader>
                <ModalBody>
                    <InputGroup className="mb-3">
                        <InputGroupText>
                            <Search size={16} />
                        </InputGroupText>
                        <Input placeholder="Buscar cliente..." value={clientSearchTerm} onChange={handleClientSearch} />
                    </InputGroup>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                                <div
                                    key={client.id}
                                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                                    onClick={() => handleSelectClient(client)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="fw-medium">{client.name}</div>
                                    {client.company && <div className="small text-muted">{client.company}</div>}
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-3 text-muted">No se encontraron clientes</div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleClientModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

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
                <div className="d-flex gap-2 mb-4">
                    <Button color="secondary" onClick={toggleClientModal} className="d-flex align-items-center gap-2">
                        <User size={18} />
                        {selectedClient ? "Cambiar Cliente" : "Seleccionar Cliente"}
                    </Button>

                    <Button
                        color="primary"
                        onClick={() => setIsAdding(true)}
                        className="d-flex align-items-center gap-2"
                        disabled={!selectedClient}
                    >
                        <PlusCircle size={18} />
                        Añadir Producto
                    </Button>
                </div>
            )}

            {/* Add New Item Form */}
            {isAdding && (
                <OrderItemForm
                    onSubmit={handleAddItem}
                    onCancel={handleCancelAdd}
                    isOpen={isAdding}
                    toggle={toggleAddItemForm}
                    products={products}
                />
            )}

            {/* Edit Item Form */}
            {editingIndex !== null && (
                <OrderItemForm
                    initialValues={orderItems[editingIndex]}
                    onSubmit={handleUpdateItem}
                    onCancel={handleCancelEdit}
                    isOpen={editingIndex !== null}
                    toggle={toggleUpdateItemForm}
                    products={products}
                />
            )}
        </div>
    )
}

