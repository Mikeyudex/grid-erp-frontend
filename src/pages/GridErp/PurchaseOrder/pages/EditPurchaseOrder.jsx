"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Button,
    Alert,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
} from "reactstrap"
import { ArrowLeft, Save, AlertTriangle } from "lucide-react"
import OrderGrid from "../components/order-item-grid"
import { ToastContainer } from "react-toastify";
import "../styles/purchase-order.css";

// En un caso real, estos datos vendrían de una API o base de datos
// Aquí usamos datos de ejemplo para la demostración
const pedidosEjemplo = [
    {
        id: "1",
        fecha: "2023-05-15",
        estado: "completado",
        cliente: {
            id: 1,
            nombre: "Juan Pérez",
            empresa: "Empresa A",
            email: "juan@empresaa.com",
            telefono: "555-123-4567",
            direccion: "Calle Principal 123, Ciudad",
        },
        productos: [
            {
                id: 1,
                productName: "Tapete para Sala",
                pieces: 3,
                selectedPieces: [1, 2, 3],
                matType: "PREMIUM",
                materialType: "ST-DIAMANTE",
                quantity: 1,
                basePrice: 105000,
                observations: "Color beige, bordes reforzados",
                adjustedPrice: 105000,
            },
            {
                id: 2,
                productName: "Tapete para Comedor",
                pieces: 5,
                selectedPieces: [1, 2, 3, 4, 5],
                matType: "ESTÁNDAR A",
                materialType: "PR-BEIGE LISO",
                quantity: 2,
                basePrice: 120000,
                observations: "Diseño personalizado con logo",
                adjustedPrice: 240000,
            },
        ],
        subtotal: 345000,
        impuestos: 65550,
        total: 410550,
        fechaEntrega: "2023-05-30",
        notas: "Entrega en horario de oficina. Cliente preferente.",
    },
    {
        id: "2",
        fecha: "2023-06-10",
        estado: "en_proceso",
        cliente: {
            id: 2,
            nombre: "María López",
            empresa: "Empresa B",
            email: "maria@empresab.com",
            telefono: "555-987-6543",
            direccion: "Avenida Central 456, Ciudad",
        },
        productos: [
            {
                id: 1,
                productName: "Tapete para Oficina",
                pieces: 4,
                selectedPieces: [1, 2, 3, 4],
                matType: "ESTÁNDAR B",
                materialType: "ST-KUBIK",
                quantity: 3,
                basePrice: 99000,
                observations: "Resistente al tráfico intenso",
                finalPrice: 297000,
            },
        ],
        subtotal: 297000,
        impuestos: 56430,
        total: 353430,
        fechaEntrega: "2023-06-25",
        notas: "Requiere instalación profesional.",
    },
]

export default function EditPurchaseOrder() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { state } = useLocation();
    const [pedido, setPedido] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [orderItems, setOrderItems] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {

        // Simulamos la carga de datos desde una API
        setLoading(true)
        setError(null)

        setTimeout(() => {
            try {
                const pedidoEncontrado = state?.pedido;

                if (!pedidoEncontrado) {
                    setError("Pedido no encontrado")
                    setLoading(false)
                    return
                }

                setPedido(pedidoEncontrado)
                setOrderItems(
                    pedidoEncontrado.productos.map((item) => ({
                        ...item,
                        productName: item.productName,
                        pieces: item.pieces,
                        selectedPieces: item.selectedPieces,
                        matType: item.matType,
                        materialType: item.materialType,
                        quantity: item.quantity,
                        basePrice: item.basePrice,
                        observations: item.observations,
                        finalPrice: item.finalPrice,
                        adjustedPrice: item.finalPrice,
                    })),
                )
                setSelectedClient({
                    id: pedidoEncontrado.cliente.id,
                    name: pedidoEncontrado.cliente.nombre,
                    company: pedidoEncontrado.cliente.empresa,
                    email: pedidoEncontrado.cliente.email,
                })
                setLoading(false)
            } catch (err) {
                setError("Error al cargar los datos del pedido")
                setLoading(false)
            }
        }, 800)
    }, [id])

    // Manejadores para los cambios en los productos
    const handleAddItem = (item) => {
        setOrderItems([...orderItems, item])
        setHasChanges(true)
    }

    const handleUpdateItem = (index, item) => {
        const newItems = [...orderItems]
        newItems[index] = item
        setOrderItems(newItems)
        setHasChanges(true)
    }

    const handleRemoveItem = (index) => {
        const newItems = [...orderItems]
        newItems.splice(index, 1)
        setOrderItems(newItems)
        setHasChanges(true)
    }

    const handleClientSelect = (client) => {
        setSelectedClient(client)
        setHasChanges(true)
    }

    // Función para guardar los cambios
    const handleSaveChanges = async () => {
        setSaving(true)
        setError(null)
        setSuccess(false)

        // Simulamos una llamada a la API para guardar los cambios
        try {
            // Aquí iría la lógica para enviar los datos actualizados al backend
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Actualizamos el pedido local con los cambios
            const updatedPedido = {
                ...pedido,
                cliente: {
                    id: selectedClient.id,
                    nombre: selectedClient.name,
                    empresa: selectedClient.company,
                    email: selectedClient.email,
                },
                productos: orderItems,
                // Recalculamos totales
                subtotal: orderItems.reduce((sum, item) => sum + item.finalPrice, 0),
            }

            // Actualizamos el impuesto y total
            updatedPedido.impuestos = Math.round(updatedPedido.subtotal * 0.19)
            updatedPedido.total = updatedPedido.subtotal + updatedPedido.impuestos

            setPedido(updatedPedido)
            setSuccess(true)
            setHasChanges(false)

            // Después de un tiempo, redirigimos a la vista de detalles
            setTimeout(() => {
                navigate(`/purchase-orders/view-detail/${id}`)
            }, 1500)
        } catch (err) {
            setError("Error al guardar los cambios. Inténtelo de nuevo.")
        } finally {
            setSaving(false)
        }
    }

    const handleVolver = () => {
        if (hasChanges) {
            if (window.confirm("Hay cambios sin guardar. ¿Está seguro que desea salir?")) {
                return navigate(`/purchase-orders/view-detail/${id}`)
            }
        } else {
            return navigate(`/purchase-orders/view-detail/${id}`)
        }
    }

    // Calculamos el total del pedido
    const calculateTotal = () => {
        const subtotal = orderItems.reduce((sum, item) => sum + item.finalPrice, 0)
        const impuestos = 0//Math.round(subtotal * 0.19)
        return {
            subtotal,
            impuestos,
            total: subtotal + impuestos,
        }
    }

    if (loading) {
        return (
            <div className="page-content">
                <Container className="py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando datos del pedido...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (error && !pedido) {
        return (
            <Container className="py-5">
                <Alert color="danger" className="d-flex align-items-center">
                    <AlertTriangle size={24} className="me-2" />
                    <div>{error}</div>
                </Alert>
                <div className="text-center mt-4">
                    <Button color="primary" onClick={() => router.push("/pedidos")}>
                        <ArrowLeft size={18} className="me-2" /> Volver a Pedidos
                    </Button>
                </div>
            </Container>
        )
    }

    const { subtotal, impuestos, total } = calculateTotal()

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container className="py-4 mb-5" fluid>
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-4">
                    <BreadcrumbItem>
                        <a href="/purchase-orders" className="text-decoration-none">
                            Pedidos
                        </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <a href={`/purchase-orders/view-detail/${id}`} className="text-decoration-none">
                            Pedido #{pedido.orderNumber}
                        </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Editar</BreadcrumbItem>
                </Breadcrumb>

                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <Button color="light" onClick={handleVolver} className="me-3">
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h1 className="mb-0">Editar Pedido #{pedido.orderNumber}</h1>
                            <div className="text-muted">Modifique los detalles del pedido y guarde los cambios</div>
                        </div>
                    </div>
                    <Button
                        color="primary"
                        onClick={handleSaveChanges}
                        disabled={saving || !hasChanges}
                        className="d-flex align-items-center gap-2"
                    >
                        {saving ? <Spinner size="sm" /> : <Save size={18} />}
                        Guardar Cambios
                    </Button>
                </div>

                {/* Mensajes de alerta */}
                {error && (
                    <Alert color="danger" className="mb-4 d-flex align-items-center">
                        <AlertTriangle size={20} className="me-2" />
                        <div>{error}</div>
                    </Alert>
                )}

                {success && (
                    <Alert color="success" className="mb-4">
                        Cambios guardados correctamente. Redirigiendo...
                    </Alert>
                )}

                {/* Formulario de edición */}
                <Card className="shadow-sm mb-4">
                    <CardHeader className="card-header-custom">
                        <h5 className="mb-0">Detalles del Pedido</h5>
                    </CardHeader>
                    <CardBody>
                        <OrderGrid
                            selectedClient={selectedClient}
                            onClientSelect={handleClientSelect}
                            orderItems={orderItems}
                            onAddItem={handleAddItem}
                            onUpdateItem={handleUpdateItem}
                            onRemoveItem={handleRemoveItem}
                            isEditMode={true}
                        />
                    </CardBody>
                </Card>

                {/* Resumen de costos */}
                {orderItems.length > 0 && (
                    <Card className="shadow-sm mb-4">
                        <CardHeader className="card-header-custom">
                            <h5 className="mb-0">Resumen de Costos</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Notas Adicionales</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Añadir notas o instrucciones especiales..."
                                            defaultValue={pedido.notas}
                                            onChange={() => setHasChanges(true)}
                                        ></textarea>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Subtotal:</span>
                                            <span>${subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Impuestos (19%):</span>
                                            <span>${impuestos.toLocaleString()}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between fw-bold">
                                            <span>Total:</span>
                                            <span>${total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                )}

                {/* Botones de acción */}
                <div className="d-flex justify-content-between">
                    <Button color="light" onClick={handleVolver}>
                        <ArrowLeft size={18} className="me-2" /> Cancelar
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleSaveChanges}
                        disabled={saving || !hasChanges}
                        className="d-flex align-items-center gap-2"
                    >
                        {saving ? <Spinner size="sm" /> : <Save size={18} />}
                        Guardar Cambios
                    </Button>
                </div>
            </Container>
        </div>
    )
}
