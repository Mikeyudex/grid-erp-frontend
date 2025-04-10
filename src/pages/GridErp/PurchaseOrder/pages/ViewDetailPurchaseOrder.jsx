"use client"

import { useState, useEffect } from "react"
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
    Badge,
    Button,
    ListGroup,
    ListGroupItem,
} from "reactstrap"
import { ArrowLeft, Printer, FileText, Edit, Clock } from "lucide-react";
import { useParams } from 'react-router-dom';
import { ProductHelper } from "../../Products/helper/product_helper";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "../../Products/components/BreadCrumb";

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
                finalPrice: 105000,
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
                finalPrice: 240000,
            },
        ],
        subtotal: 345000,
        impuestos: 65550,
        total: 410550,
        fechaEntrega: "2023-05-30",
        notas: "Entrega en horario de oficina. Cliente preferente.",
        historial: [
            { fecha: "2023-05-15 09:30", accion: "Pedido creado", usuario: "Admin" },
            { fecha: "2023-05-16 14:20", accion: "Pago recibido", usuario: "Sistema" },
            { fecha: "2023-05-20 11:15", accion: "En producción", usuario: "Operario" },
            { fecha: "2023-05-28 16:40", accion: "Listo para entrega", usuario: "Logística" },
            { fecha: "2023-05-30 10:25", accion: "Entregado", usuario: "Repartidor" },
        ],
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
        historial: [
            { fecha: "2023-06-10 13:45", accion: "Pedido creado", usuario: "Admin" },
            { fecha: "2023-06-11 09:10", accion: "Pago recibido", usuario: "Sistema" },
            { fecha: "2023-06-15 14:30", accion: "En producción", usuario: "Operario" },
        ],
    },
]


const helper = new ProductHelper();

export default function ViewDetailPurchaseOrder() {

    const [pedido, setPedido] = useState(null)
    const [loading, setLoading] = useState(true)
    let { id } = useParams();

    useEffect(() => {
        // Simulamos la carga de datos desde una API
        setLoading(true)
        helper.getPurchaseOrderById(id)
            .then(async (response) => {
                let data = response.data;
                console.log(data);
                let mappingData = {
                    id: data._id,
                    fecha: new Date(data?.createdAt).toLocaleDateString("es-ES"),
                    estado: data?.status,
                    cliente: {
                        id: data?.clientId?._id,
                        nombre: data?.clientId?.name + " " + data?.clientId?.lastname,
                        empresa: data?.clientId?.commercialName,
                        email: data?.clientId?.email,
                        telefono: data?.clientId?.phone,
                        direccion: data?.clientId?.shippingAddress + " " + data?.clientId?.shippingCity,
                    },
                    productos: data?.details.map((item) => {
                        return {
                            id: item.productId,
                            productName: item?.productName,
                            pieces: item?.pieces,
                            selectedPieces: item?.piecesNames,
                            matType: item?.matType,
                            materialType: item?.materialType,
                            quantity: item?.quantityItem,
                            basePrice: item?.priceItem,
                            observations: item?.observations,
                            finalPrice: item?.priceItem,
                            totalItem: item?.totalItem,
                        }
                    }),
                    subtotal: data?.totalOrder,
                    impuestos: data?.tax,
                    total: data?.totalOrder,
                    historial: [],
                    fechaEntrega: new Date(data?.createdAt).toLocaleDateString("es-ES"),
                }
                if (mappingData) {
                    setPedido(mappingData);
                }
                return;
            })
            .catch(e => console.log(e))
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleVolver = () => {
        window.location.href = "/purchase-orders"
    }

    const handleImprimir = () => {
        window.print()
    }

    // Función para obtener el texto de las piezas seleccionadas
    const getSelectedPiecesText = (selectedPieces) => {
        if (!selectedPieces || selectedPieces.length === 0) {
            return "Ninguna"
        }

        return selectedPieces
            .join(", ")
    }

    // Función para obtener el color del badge según el estado
    const getEstadoBadgeColor = (estado) => {
        switch (estado) {
            case "pendiente":
                return "warning"
            case "en_proceso":
                return "primary"
            case "completado":
                return "success"
            case "cancelado":
                return "danger"
            default:
                return "secondary"
        }
    }

    // Función para obtener el texto del estado
    const getEstadoText = (estado) => {
        switch (estado) {
            case "pendiente":
                return "Pendiente"
            case "en_proceso":
                return "En Proceso"
            case "completado":
                return "Completado"
            case "cancelado":
                return "Cancelado"
            default:
                return "Desconocido"
        }
    }

    if (loading) {
        return (
            <div className="page-content">
                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Detalle de pedido" pageTitle="Ordenes de pedido" />
                    <Row>
                        <div className="card-body pt-2 mt-1">
                            <Container className="py-5">
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p className="mt-3">Cargando detalles del pedido...</p>
                                </div>
                            </Container>
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }

    if (!pedido) {
        return (
            <div className="page-content">
                <ToastContainer closeButton={false} limit={1} />
                <Container fluid>
                    <BreadCrumb title="Detalle de pedido" pageTitle="Ordenes de pedido" />
                    <Row>
                        <div className="card-body pt-2 mt-1">
                            <Container className="py-5">
                                <div className="text-center">
                                    <h2>Pedido no encontrado</h2>
                                    <p className="text-muted">El pedido que estás buscando no existe o ha sido eliminado.</p>
                                    <Button color="primary" onClick={handleVolver} className="mt-3">
                                        <ArrowLeft size={18} className="me-2" /> Volver
                                    </Button>
                                </div>
                            </Container>
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Detalle de pedido" pageTitle="Ordenes de pedido" />
                <Row>
                    <div className="card-body pt-2 mt-1">

                        <Container className="py-4 mb-5">
                            {/* Encabezado */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center">
                                    <Button color="light" onClick={handleVolver} className="me-3">
                                        <ArrowLeft size={18} />
                                    </Button>
                                    <div>
                                        <h1 className="mb-0">Pedido #{pedido.id}</h1>
                                        <div className="text-muted">
                                            Creado el {formatDate(pedido.fecha)} ·
                                            <Badge color={getEstadoBadgeColor(pedido.estado)} className="ms-2">
                                                {getEstadoText(pedido.estado)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button color="light" onClick={handleImprimir}>
                                        <Printer size={18} className="me-2" /> Imprimir
                                    </Button>
                                    <Button color="primary">
                                        <Edit size={18} className="me-2" /> Editar Pedido
                                    </Button>
                                </div>
                            </div>

                            <Row>
                                {/* Información del Cliente y Detalles del Pedido */}
                                <Col md={4} className="mb-4">
                                    <Card className="shadow-sm h-100">
                                        <CardHeader className="bg-light">
                                            <h5 className="mb-0">Información del Cliente</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <h6 className="fw-bold">{pedido.cliente.nombre}</h6>
                                            {pedido.cliente.empresa && <p className="mb-2">{pedido.cliente.empresa}</p>}
                                            <p className="mb-1">
                                                <strong>Email:</strong> {pedido.cliente.email}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Teléfono:</strong> {pedido.cliente.telefono}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Dirección:</strong> {pedido.cliente.direccion}
                                            </p>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col md={4} className="mb-4">
                                    <Card className="shadow-sm h-100">
                                        <CardHeader className="bg-light">
                                            <h5 className="mb-0">Detalles del Pedido</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <p className="mb-1">
                                                <strong>Fecha de Pedido:</strong> {formatDate(pedido.fecha)}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Fecha de Entrega:</strong> {formatDate(pedido.fechaEntrega)}
                                            </p>
                                            <p className="mb-3">
                                                <strong>Estado:</strong>{" "}
                                                <Badge color={getEstadoBadgeColor(pedido.estado)}>{getEstadoText(pedido.estado)}</Badge>
                                            </p>
                                            <h6 className="fw-bold">Resumen de Costos</h6>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Subtotal:</span>
                                                <span>${pedido.subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Impuestos (19%):</span>
                                                <span>${pedido.impuestos.toLocaleString()}</span>
                                            </div>
                                            <div className="d-flex justify-content-between fw-bold">
                                                <span>Total:</span>
                                                <span>${pedido.total.toLocaleString()}</span>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col md={4} className="mb-4">
                                    <Card className="shadow-sm h-100">
                                        <CardHeader className="bg-light">
                                            <h5 className="mb-0">Historial del Pedido</h5>
                                        </CardHeader>
                                        <CardBody className="p-0">
                                            <ListGroup flush>
                                                {pedido.historial.map((evento, index) => (
                                                    <ListGroupItem key={index} className="border-0 border-bottom">
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-3">
                                                                <Clock size={18} className="text-muted" />
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium">{evento.accion}</div>
                                                                <div className="small text-muted">
                                                                    {evento.fecha} · {evento.usuario}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Productos del Pedido */}
                            <Card className="shadow-sm mb-4">
                                <CardHeader className="bg-light">
                                    <h5 className="mb-0">Productos ({pedido.productos.length})</h5>
                                </CardHeader>
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }}>#</th>
                                                <th style={{ width: "25%" }}>Producto</th>
                                                <th style={{ width: "15%" }}>Piezas</th>
                                                <th style={{ width: "15%" }}>Tipo / Material</th>
                                                <th style={{ width: "10%" }}>Cantidad</th>
                                                <th style={{ width: "15%" }}>Precio Unitario</th>
                                                <th style={{ width: "15%" }} className="text-end">
                                                    Precio Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.productos.map((producto, index) => (
                                                <tr key={producto.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="fw-medium">{producto.productName}</div>
                                                        {producto.observations && <small className="text-muted d-block">{producto.observations}</small>}
                                                    </td>
                                                    <td>
                                                        <div>{producto.pieces} piezas</div>
                                                        <small className="text-muted d-block">{getSelectedPiecesText(producto.selectedPieces)}</small>
                                                    </td>
                                                    <td>
                                                        <div>{producto.matType}</div>
                                                        <small className="text-muted d-block">{producto.materialType}</small>
                                                    </td>
                                                    <td>{producto.quantity}</td>
                                                    <td>${producto.basePrice.toLocaleString()}</td>
                                                    <td className="text-end fw-bold">${producto.finalPrice.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-group-divider">
                                            <tr>
                                                <td colSpan="6" className="text-end fw-bold">
                                                    Subtotal:
                                                </td>
                                                <td className="text-end fw-bold">${pedido.subtotal.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6" className="text-end">
                                                    Impuestos (19%):
                                                </td>
                                                <td className="text-end">${pedido.impuestos.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6" className="text-end fw-bold">
                                                    Total:
                                                </td>
                                                <td className="text-end fw-bold h5 mb-0">${pedido.total.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </div>
                            </Card>

                            {/* Notas Adicionales */}
                            {pedido.notas && (
                                <Card className="shadow-sm mb-4">
                                    <CardHeader className="bg-light">
                                        <h5 className="mb-0">Notas Adicionales</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="mb-0">{pedido.notas}</p>
                                    </CardBody>
                                </Card>
                            )}

                            {/* Botones de Acción */}
                            <div className="d-flex justify-content-between">
                                <Button color="light" onClick={handleVolver}>
                                    <ArrowLeft size={18} className="me-2" /> Volver a Pedidos
                                </Button>
                                <div className="d-flex gap-2">
                                    <Button color="light" onClick={handleImprimir}>
                                        <Printer size={18} className="me-2" /> Imprimir
                                    </Button>
                                    <Button color="light">
                                        <FileText size={18} className="me-2" /> Exportar PDF
                                    </Button>
                                    <Button color="primary">
                                        <Edit size={18} className="me-2" /> Editar Pedido
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </div>
                </Row>
            </Container>
        </div>

    )
}
