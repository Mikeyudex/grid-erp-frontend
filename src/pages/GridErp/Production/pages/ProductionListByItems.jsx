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
    Input,
    InputGroup,
    Form,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
    Pagination,
    PaginationItem,
    PaginationLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap"
import {
    Search,
    ChevronDown,
    CheckSquare,
    Square,
    User,
    Clock,
    Filter,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Edit,
    ChevronLeft,
    ChevronRightIcon,
    Download,
} from "lucide-react"

// Importar el helper para las operaciones de API
import { PurchaseHelper } from "../../PurchaseOrder/helper/purchase_helper"
import { ProductHelper } from "../../Products/helper/product_helper"
import { UserHelper } from "../../Users/helpers/user_helper"
import { footerStyle } from "./footerStyle"
import ModalCambioEstado from "../components/ModalCambioEstado"
import ModalAsignacion from "../components/ModalAsignacion"
import { ProductionHelper } from "../helper/production-helper"
import { IndexedDBService } from "../../../../helpers/indexedDb/indexed-db-helper"
import ModalAsignacionXZona from "../components/ModalAsignacionZona"
import { AuthHelper } from "../../Auth/helpers/auth_helper"

const productHelper = new ProductHelper();
const userHelper = new UserHelper();
const productionHelper = new ProductionHelper();
const authHelper = new AuthHelper();
const indexedDBService = new IndexedDBService();

export default function ProductionListByItems() {
    document.title = "Ordenes de Producción - Items | Quality";
    const [selectedItems, setSelectedItems] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState([])
    const [filterEstado, setFilterEstado] = useState("")
    const [asignacionModalOpen, setAsignacionModalOpen] = useState(false)
    const [asignacionZonaModalOpen, setAsignacionZonaModalOpen] = useState(false)
    const [agentesProduccion, setAgentesProduccion] = useState([])
    const [selectedAgent, setSelectedAgent] = useState("")
    const [items, setItems] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [cambioEstadoModalOpen, setCambioEstadoModalOpen] = useState(false)
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [reloadTable, setReloadTable] = useState(false);
    const [zones, setZones] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [selectedPedidos, setSelectedPedidos] = useState([]);

    // Estados para operaciones asíncronas
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // Crear una instancia del helper
    const purchaseHelper = new PurchaseHelper()

    // Estados para filtros de fecha
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [filtroFechaActivo, setFiltroFechaActivo] = useState(false)

    // Estados para ordenamiento
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc") // "asc" o "desc"

    // Estados para filtros por columna
    const [columnFiltersItems, setColumnFilters] = useState({
        id: "",
        ciudad: "",
        cliente: "",
        producto: "",
        marca: "",
        linea: "",
        tipo: "",
        material: "",
        piezas: "",
        cantidad: "",
        estado: filterEstado,
        asignado: "",
    })

    // Función para manejar el ordenamiento
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleGetPurchaseOrders = async () => {
        try {
            let userValue = await indexedDBService.getItemById(localStorage.getItem("userId"));
            let zoneId = userValue?.zoneId;
            let response = await productHelper.getPurchaseOrdersFromViewProduction(currentPage, itemsPerPage, zoneId);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetUsers = async () => {
        try {
            let response = await userHelper.getUsers();
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetZones = async () => {
        let response = await authHelper.getZones();
        if (response?.statusCode === 200) {
            setZones(response?.data);
        }
        if (response?.error) {
            console.log(response?.message);
        }
    };

    useEffect(() => {
        handleGetUsers()
            .then(async (data) => {
                let users = data;
                let usersMap = users.map((u) => {
                    return {
                        id: u.id,
                        nombre: `${u.name} ${u.lastname}`,
                        departamento: u.role,
                        disponible: u.active,
                    }
                }).filter(u => u.departamento !== 'admin');
                setAgentesProduccion(usersMap);
            })
            .catch(e => console.log(e))

    }, []);

    useEffect(() => {
        handleGetZones()
    }, []);

    useEffect(() => {
        if (!agentesProduccion || agentesProduccion.length === 0) return;
        setIsLoading(true);
        handleGetPurchaseOrders()
            .then(async (data) => {
                let purchaseOrders = data;
                let items = [];
                for (const po of purchaseOrders) {
                    for (const item of po.details) {
                        items.push({
                            id: po.orderNumber,
                            fecha: po.createdAt,
                            cliente: po.cliente,
                            productId: item.productId,
                            nombre: item.productName,
                            tipo: item.matType,
                            material: item.materialType,
                            piezas: item.pieces,
                            piecesNames: item.piecesNames,
                            cantidad: item.quantityItem,
                            estado: item.itemStatus,
                            asignado: {
                                id: po?.zoneId?._id || null,
                                nombre: po?.zoneId?.name || null,
                            },
                            marca: item?.marca,
                            linea: item?.productName,
                            fechaEntrega: po.deliveryDate,
                            itemId: item._id,
                            zone: po?.zoneId,
                            orderId: po._id,
                        })
                    }
                };
                setItems(items);
                setFilteredItems(items);
            })
            .catch(e => console.log(e))
            .finally(() => {
                setIsLoading(false);
            });
    }, [reloadTable, agentesProduccion]);

    // Aplicar filtros
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        let filtered = [...items];

        // Aplicar filtro general de búsqueda si existe
        if (term) {
            filtered = filtered.filter(
                (item) =>
                    (String(item?.id).includes(term) ||
                        item?.cliente?.nombre.toLowerCase().includes(term) ||
                        item?.cliente?.ciudad.toLowerCase().includes(term) ||
                        (item.cliente.empresa && item.cliente.empresa.toLowerCase().includes(term))) &&
                    (filterEstado === "" || item.estado === filterEstado),
            )
        }

        // Aplicar filtros por columna
        if (columnFiltersItems.id) {
            filtered = filtered.filter((item) => String(item?.id).includes(columnFiltersItems.id.toLowerCase()))
        }

        if (columnFiltersItems.ciudad) {
            filtered = filtered.filter((item) => item.ciudad.toLowerCase().includes(columnFiltersItems.ciudad.toLowerCase()))
        }

        if (columnFiltersItems.cliente) {
            filtered = filtered.filter(
                (item) =>
                    item.cliente.nombre.toLowerCase().includes(columnFiltersItems.cliente.toLowerCase()) ||
                    (item.cliente.empresa && item.cliente.empresa.toLowerCase().includes(columnFiltersItems.cliente.toLowerCase())),
            )
        }

        if (columnFiltersItems.producto) {
            filtered = filtered.filter((item) => item.nombre.toLowerCase().includes(columnFiltersItems.producto.toLowerCase()))
        }

        if (columnFiltersItems.marca) {
            filtered = filtered.filter((item) => item.marca.toLowerCase().includes(columnFiltersItems.marca.toLowerCase()))
        }

        if (columnFiltersItems.linea) {
            filtered = filtered.filter((item) => item.linea.toLowerCase().includes(columnFiltersItems.linea.toLowerCase()))
        }

        if (columnFiltersItems.tipo) {
            filtered = filtered.filter((item) =>
                item.tipo.toLowerCase().includes(columnFiltersItems.tipo.toLowerCase()),
            )
        }

        if (columnFiltersItems.material) {
            filtered = filtered.filter((item) => item.material.toLowerCase().includes(columnFiltersItems.material.toLowerCase()))
        }

        if (columnFiltersItems.piezas) {
            filtered = filtered.filter((item) => item.piezas.toString().includes(columnFiltersItems.piezas))
        }

        if (columnFiltersItems.cantidad) {
            filtered = filtered.filter((item) => item.cantidad.toString().includes(columnFiltersItems.cantidad))
        }

        if (columnFiltersItems.estado) {
            filtered = filtered.filter((item) => item.estado === columnFiltersItems.estado)
        }

        if (columnFiltersItems.asignado) {
            filtered = filtered.filter(
                (item) => item.asignado && item.asignado.nombre.toLowerCase().includes(columnFiltersItems.asignado.toLowerCase()),
            )
        }

        // Aplicar filtro de fechas si está activo
        if (filtroFechaActivo && fechaInicio && fechaFin) {
            const fechaInicioObj = new Date(fechaInicio)
            const fechaFinObj = new Date(fechaFin)
            // Ajustar la fecha fin para incluir todo el día
            fechaFinObj.setHours(23, 59, 59, 999);
            fechaFinObj.setUTCHours(fechaFinObj.getUTCHours() - 5)
            fechaFinObj.setUTCHours(fechaFinObj.getUTCHours() + 24)


            filtered = filtered.filter((item) => {
                if (!item.asignado || !item.asignado.fecha) return false
                const fechaAsignacion = new Date(item.asignado.fecha)
                return fechaAsignacion >= fechaInicioObj && fechaAsignacion <= fechaFinObj
            })
        }

        // Aplicar ordenamiento si hay un campo seleccionado
        if (sortField) {
            filtered.sort((a, b) => {
                let valueA, valueB

                // Determinar los valores a comparar según el campo
                if (sortField === "id") {
                    valueA = a.id
                    valueB = b.id
                } else if (sortField === "ciudad") {
                    valueA = a.ciudad
                    valueB = b.ciudad
                } else if (sortField === "cliente") {
                    valueA = a.cliente.nombre
                    valueB = b.cliente.nombre
                } else if (sortField === "producto") {
                    valueA = a.producto
                    valueB = b.producto
                } else if (sortField === "marca") {
                    valueA = a.marca
                    valueB = b.marca
                } else if (sortField === "linea") {
                    valueA = a.linea
                    valueB = b.linea
                } else if (sortField === "tipo") {
                    valueA = a.tipo
                    valueB = b.tipo
                } else if (sortField === "material") {
                    valueA = a.material
                    valueB = b.material
                } else if (sortField === "piezas") {
                    valueA = a.piezas
                    valueB = b.piezas
                    return sortDirection === "asc" ? valueA - valueB : valueB - valueA
                } else if (sortField === "cantidad") {
                    valueA = a.cantidad
                    valueB = b.cantidad
                    return sortDirection === "asc" ? valueA - valueB : valueB - valueA
                } else if (sortField === "estado") {
                    valueA = a.estado
                    valueB = b.estado
                } else if (sortField === "asignado") {
                    valueA = a.asignado ? a.asignado.nombre : ""
                    valueB = b.asignado ? b.asignado.nombre : ""
                }

                // Para campos de texto, usar localeCompare
                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
                }

                // Para otros tipos de datos, usar comparación directa
                return sortDirection === "asc" ? valueA - valueB : valueB - valueA
            })
        }
        setFilteredItems(filtered)
    }, [
        searchTerm,
        filterEstado,
        filtroFechaActivo,
        fechaInicio,
        fechaFin,
        sortField,
        sortDirection,
        columnFiltersItems
    ])

    // Función para manejar cambios en los filtros de columna
    const handleColumnFilterChange = (column, value) => {
        setColumnFilters((prev) => ({
            ...prev,
            [column]: value,
        }))
    }

    // Función para manejar el filtro de estado
    const handleFilterChange = (e) => {
        const estado = e.target.value
        setFilterEstado(estado)
        setColumnFilters({
            ...columnFiltersItems,
            estado: estado,
        })
    }


    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
        setSearchTerm("")
        setFilterEstado("")
        setColumnFilters({
            id: "",
            ciudad: "",
            cliente: "",
            producto: "",
            marca: "",
            linea: "",
            tipo: "",
            material: "",
            piezas: "",
            cantidad: "",
            estado: "",
            asignado: "",
        })
        limpiarFiltroFechas();
        setCurrentPage(1);
    }

    const handleSearch = (e) => {
        e.preventDefault()
        // La búsqueda ya se aplica en el useEffect
    }

    const handleRefresh = () => {
        setReloadTable(!reloadTable);
    }

    const toggleItemSelection = (itemId) => {
        console.log('itemId: ', itemId);

        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId))
        } else {
            setSelectedItems([...selectedItems, itemId])
        }
    }

    const toggleSelectAllItems = () => {
        if (selectedItems.length === filteredItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(filteredItems.map((item) => item.itemId))
        }
    }

    const openAsignacionModal = () => {
        if (selectedItems.length === 0) {
            alert("Por favor, seleccione al menos un producto para asignar")
            return
        }
        setAsignacionModalOpen(true)
    }

    const openAsignacionXZonaModal = () => {
        if (selectedPedidos.length === 0) {
            alert("Por favor, seleccione al menos un pedido para asignar la zona")
            return
        }
        setAsignacionZonaModalOpen(true)
    }

    // Función para asignar productos a un agente
    const handleAsignarProductos = async () => {
        if (!selectedAgent) {
            alert("Por favor, seleccione un agente de producción")
            return
        }

        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
            // Procesar cada producto seleccionado
            const agente = agentesProduccion.find((a) => a.id.toString() === selectedAgent)
            if (!agente) {
                throw new Error("Agente no encontrado")
            }

            // Crear un array de promesas para todas las asignaciones
            const asignacionPromises = []
            const updatedItems = [...items]

            // Preparar las actualizaciones y las promesas
            selectedItems.forEach((itemId) => {
                // Encontrar el item correspondiente
                const itemIndex = updatedItems.findIndex((item) => item.id === itemId)
                if (itemIndex !== -1) {
                    // Añadir la promesa para este producto
                    asignacionPromises.push(
                        purchaseHelper
                            .assignItemToProductionOperator(updatedItems[itemIndex].pedidoId, itemId, agente.id)
                            .then(() => {
                                // Actualizar el estado local del producto
                                updatedItems[itemIndex].estado = "en_produccion"
                                updatedItems[itemIndex].asignado = {
                                    id: agente.id,
                                    nombre: agente.nombre,
                                    fecha: new Date().toISOString().split("T")[0],
                                }
                            }),
                    )
                }
            })

            // Ejecutar todas las asignaciones en paralelo
            await Promise.all(asignacionPromises)

            // Actualizar el estado local con los cambios
            setItems(updatedItems)
            setFilteredItems(
                filteredItems.map((item) => {
                    const updatedItem = updatedItems.find((i) => i.id === item.id)
                    return updatedItem || item
                }),
            )

            setSuccessMessage(`${selectedItems.length} productos asignados correctamente a ${agente.nombre}`)

            // Cerrar modal y limpiar selección
            setTimeout(() => {
                setAsignacionModalOpen(false)
                setSelectedItems([])
                setSelectedAgent("")
                setSuccessMessage("")
            }, 1500)
        } catch (error) {
            console.error("Error al asignar productos:", error)
            setErrorMessage("Ocurrió un error al asignar los productos. Por favor, inténtelo de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    // Función para cambiar el estado de los productos
    const handleCambiarEstado = async () => {
        if (!nuevoEstado) {
            alert("Por favor, seleccione un nuevo estado")
            return
        }

        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
            // Procesar cada producto seleccionado
            const cambioEstadoPromises = []
            const updatedItems = [...items]

            // Preparar las actualizaciones y las promesas
            selectedItems.forEach((itemId) => {
                // Encontrar el item correspondiente
                const itemIndex = updatedItems.findIndex((item) => {
                    return item.itemId === itemId
                })
                console.log(itemIndex);
                if (itemIndex !== -1) {
                    // Datos para el cambio de estado
                    const data = {
                        status: nuevoEstado,
                    }

                    // Añadir la promesa para este producto
                    const userId = localStorage.getItem("userId");

                    cambioEstadoPromises.push(
                        purchaseHelper
                            .changeStatusByItem(updatedItems[itemIndex].orderId, itemId, userId, data)
                            .then(() => {
                                // Actualizar el estado local del producto
                                updatedItems[itemIndex].estado = nuevoEstado

                                // Si el estado es "pendiente", eliminar la asignación
                                if (nuevoEstado === "pendiente") {
                                    updatedItems[itemIndex].asignado = null
                                }
                            }),
                    )
                }
            })

            // Ejecutar todos los cambios de estado en paralelo
            await Promise.all(cambioEstadoPromises)

            setSuccessMessage(
                `Estado de ${selectedItems.length} productos cambiado correctamente a "${productionHelper.getEstadoTextItem(nuevoEstado)}"`,
            );

            setReloadTable(!reloadTable);

            // Cerrar modal y limpiar selección
            setTimeout(() => {
                setCambioEstadoModalOpen(false)
                setSelectedItems([])
                setNuevoEstado("")
                setSuccessMessage("")
            }, 1500)
        } catch (error) {
            console.error("Error al cambiar el estado de los productos:", error)
            setErrorMessage("Ocurrió un error al cambiar el estado. Por favor, inténtelo de nuevo.")
        } finally {
            setIsLoading(false)
        }
    };

    /* const handleAsignarProductosXZona = async () => {
        if (!selectedZoneId) {
            alert("Por favor, seleccione una zona de producción")
            return
        }

        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")

        // Crear un array de promesas para todas las asignaciones
        const asignacionPromises = []
        //const updatedPedidos = [...pedidos]

        try {
            //agregar la zona seleccionada a cada pedido
            selectedPedidos.forEach((pedido) => {
                asignacionPromises.push(
                    purchaseHelper.assignOrderToZone(pedido?._id, selectedZoneId, localStorage.getItem("userId")).then(() => {
                        console.log('Pedido asignado');
                    }),
                )
            })

            await Promise.all(asignacionPromises)

            setSuccessMessage(`${selectedPedidos.length} productos asignados correctamente a zona ${zones.find((z) => z._id === selectedZoneId)?.name}`)
            setReloadTable(!reloadTable);
            // Cerrar modal y limpiar selección
            setTimeout(() => {
                setAsignacionZonaModalOpen(false)
                setSelectedZoneId(null)
                setSuccessMessage("")
                setSelectedPedidos([])
            }, 1500)
        } catch (error) {
            console.error("Error al asignar pedidos:", error)
            setErrorMessage("Ocurrió un error al asignar los pedidos. Por favor, inténtelo de nuevo.")
        } finally {
            setIsLoading(false);
        }
    }; */

    const getProductosSeleccionadosInfo = () => {
        let count = 0
        const pedidosInfo = {}
        filteredItems.forEach((producto) => {
            if (selectedItems.includes(producto.itemId)) {
                count++
                if (!pedidosInfo[producto.itemId]) {
                    pedidosInfo[producto.itemId] = {
                        cliente: producto.cliente.nombre,
                        count: 1,
                        id: producto.id,
                    }
                } else {
                    pedidosInfo[producto.itemId].count++
                }
            }
        })

        return {
            count,
            pedidosInfo: Object.entries(pedidosInfo).map(([itemId, info]) => ({
                id: info.id,
                cliente: info.cliente,
                count: info.count,
                itemId
            })),
        }
    }

    const openCambioEstadoModal = () => {
        if (selectedItems.length === 0) {
            alert("Por favor, seleccione al menos un producto para cambiar su estado")
            return
        }
        setCambioEstadoModalOpen(true)
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

    // Función para aplicar el filtro de fechas
    const aplicarFiltroFechas = () => {
        if (fechaInicio && fechaFin) {
            setFiltroFechaActivo(true)
        } else {
            alert("Por favor, seleccione un rango de fechas completo")
        }
    }

    // Función para limpiar el filtro de fechas
    const limpiarFiltroFechas = () => {
        setFechaInicio("")
        setFechaFin("")
        setFiltroFechaActivo(false)
    }

    const productosSeleccionadosInfo = getProductosSeleccionadosInfo();

    // Calcular índices para paginación
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

    // Función para cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <Container fluid className="py-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gestión de Items de Pedidos</h1>
                <div className="d-flex gap-2">
                    <Button title="Actualizar" color="light" className="d-flex align-items-center gap-2" onClick={handleRefresh}>
                        <RefreshCw size={18} />
                    </Button>
                    {selectedItems.length > 0 && (
                        <Button color="primary" onClick={openAsignacionXZonaModal} className="d-flex align-items-center gap-2">
                            <User size={18} /> Asignar Seleccionados ({selectedItems.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Modal de Asignación */}
            <ModalAsignacion
                asignacionModalOpen={asignacionModalOpen}
                setAsignacionModalOpen={setAsignacionModalOpen}
                productosSeleccionadosInfo={productosSeleccionadosInfo}
                agentesProduccion={agentesProduccion}
                handleAsignarProductos={handleAsignarProductos}
                setSelectedAgent={setSelectedAgent}
                selectedAgent={selectedAgent}
                isLoading={isLoading}
                errorMessage={errorMessage}
                successMessage={successMessage}
            />

            {/* Modal de Cambio de Estado */}
            <ModalCambioEstado
                cambioEstadoModalOpen={cambioEstadoModalOpen}
                setCambioEstadoModalOpen={setCambioEstadoModalOpen}
                productosSeleccionadosInfo={productosSeleccionadosInfo}
                nuevoEstado={nuevoEstado}
                handleCambiarEstado={handleCambiarEstado}
                selectedProducts={selectedItems}
                setNuevoEstado={setNuevoEstado}
                isLoading={isLoading}
                errorMessage={errorMessage}
                successMessage={successMessage}
                statusOptions={productionHelper.getStatusOptionsByProduct()}
                viewName={"productos"}
            />

            {/* Modal de Asignación de zona */}
            {/* <ModalAsignacionXZona
                asignacionZonaModalOpen={asignacionZonaModalOpen}
                setAsignacionZonaModalOpen={setAsignacionZonaModalOpen}
                productosSeleccionadosInfo={productosSeleccionadosInfo}
                zonas={zones}
                handleAsignarProductosXZona={handleAsignarProductosXZona}
                setSelectedZoneId={setSelectedZoneId}
                selectedZoneId={selectedZoneId}
                isLoading={isLoading}
                errorMessage={errorMessage}
                successMessage={successMessage}
                selectedPedidos={selectedPedidos}
            /> */}

            {/* Filtros */}
            <Card className="shadow-sm mb-4">

                <CardBody>
                    <Row>
                        <Col md={8}>
                            <Form onSubmit={handleSearch}>
                                <InputGroup>
                                    <Input
                                        placeholder="Buscar por ID, producto, cliente o empresa..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Button color="primary" title="Buscar">
                                        <Search size={18} />
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Input type="select" value={filterEstado} onChange={handleFilterChange}>
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="fabricacion">Fabricación</option>
                                <option value="inventario">Inventario</option>
                                <option value="finalizado">Finalizado</option>
                            </Input>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {selectedItems.length > 0 && (
                <Alert color="info" className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <CheckCircle size={18} className="me-2" />
                        <span>
                            <strong>{selectedItems.length}</strong> productos seleccionados
                        </span>
                    </div>
                    <div>
                        {/* <Button color="primary" size="sm" onClick={openAsignacionXZonaModal} className="me-2">
                            Asignar Seleccionados
                        </Button> */}
                        <Button color="secondary" size="sm" onClick={openCambioEstadoModal}>
                            Cambiar Estado
                        </Button>
                    </div>
                </Alert>
            )}

            <Card className="shadow-sm mb-5">
                <div className="table-responsive">
                    <Table hover style={{ minHeight: '19rem' }} className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: "2%" }}>
                                    <div
                                        onClick={toggleSelectAllItems}
                                        style={{ cursor: "pointer" }}
                                        className="d-flex justify-content-center"
                                    >
                                        {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? (
                                            <CheckSquare size={18} />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </div>
                                </th>
                                <th style={{ width: "6%" }} onClick={() => handleSort("pedidoId")} className="cursor-pointer">
                                    # Pedido {sortField === "pedidoId" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "8%" }} onClick={() => handleSort("ciudad")} className="cursor-pointer">
                                    Ciudad {sortField === "ciudad" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "12%" }} onClick={() => handleSort("cliente")} className="cursor-pointer">
                                    Cliente {sortField === "cliente" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                {/* <th style={{ width: "12%" }} onClick={() => handleSort("producto")} className="cursor-pointer">
                                    Producto {sortField === "producto" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th> */}
                                <th style={{ width: "8%" }} onClick={() => handleSort("marca")} className="cursor-pointer">
                                    Marca {sortField === "marca" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "8%" }} onClick={() => handleSort("linea")} className="cursor-pointer">
                                    Línea {sortField === "linea" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "8%" }} onClick={() => handleSort("tipo")} className="cursor-pointer">
                                    Tipo Tapete {sortField === "tipo" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "8%" }} onClick={() => handleSort("material")} className="cursor-pointer">
                                    Material {sortField === "material" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "6%" }} onClick={() => handleSort("piezas")} className="cursor-pointer">
                                    Piezas {sortField === "piezas" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "6%" }} onClick={() => handleSort("cantidad")} className="cursor-pointer">
                                    Cant. {sortField === "cantidad" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "8%" }} onClick={() => handleSort("estado")} className="cursor-pointer">
                                    Estado {sortField === "estado" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                                <th style={{ width: "10%" }} onClick={() => handleSort("asignado")} className="cursor-pointer">
                                    Sede asignada {sortField === "asignado" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                </th>
                            </tr>
                            {/* Fila de filtros por columna */}
                            <tr className="bg-light">
                                <th></th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.id}
                                        onChange={(e) => handleColumnFilterChange("id", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.ciudad}
                                        onChange={(e) => handleColumnFilterChange("ciudad", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.cliente}
                                        onChange={(e) => handleColumnFilterChange("cliente", e.target.value)}
                                    />
                                </th>
                                {/* <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.producto}
                                        onChange={(e) => handleColumnFilterChange("producto", e.target.value)}
                                    />
                                </th> */}
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.marca}
                                        onChange={(e) => handleColumnFilterChange("marca", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.linea}
                                        onChange={(e) => handleColumnFilterChange("linea", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.tipo}
                                        onChange={(e) => handleColumnFilterChange("tipo", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.material}
                                        onChange={(e) => handleColumnFilterChange("material", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.piezas}
                                        onChange={(e) => handleColumnFilterChange("piezas", e.target.value)}
                                    />
                                </th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.cantidad}
                                        onChange={(e) => handleColumnFilterChange("cantidad", e.target.value)}
                                    />
                                </th>
                                <th>{/* El filtro de estado ya está implementado en el dropdown */}</th>
                                <th>
                                    <Input
                                        type="text"
                                        bsSize="sm"
                                        placeholder="Buscar..."
                                        value={columnFiltersItems.asignado}
                                        onChange={(e) => handleColumnFilterChange("asignado", e.target.value)}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.itemId} className={selectedItems.includes(item.itemId) ? "bg-light" : ""}>
                                        <td className="text-center align-middle">
                                            <div
                                                onClick={() => toggleItemSelection(item.itemId)}
                                                style={{ cursor: "pointer" }}
                                                className="d-flex justify-content-center"
                                            >
                                                {selectedItems.includes(item.itemId) ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </div>
                                        </td>
                                        <td>#{item.id}</td>
                                        <td>{item?.cliente?.ciudad}</td>
                                        <td>
                                            <div className="fw-medium">{item.cliente.nombre}</div>
                                            {item.cliente.empresa && <small className="text-muted">{item.cliente.empresa}</small>}
                                        </td>
                                        {/*   <td>{item.nombre}</td> */}
                                        <td>{item.marca}</td>
                                        <td>{item.linea}</td>
                                        <td>{item.tipo}</td>
                                        <td>{item.material}</td>
                                        <td>{item.piezas}</td>
                                        <td>{item.cantidad}</td>
                                        <td>
                                            <Badge color={productionHelper.getStatusBadgeColorItem(item.estado)}>{productionHelper.getEstadoTextItem(item.estado)}</Badge>
                                        </td>
                                        <td>
                                            {item.asignado ? (
                                                <div>
                                                    <div className="fw-medium">{item.asignado.nombre}</div>
                                                    {/* <small className="text-muted d-flex align-items-center">
                                                        <Clock size={12} className="me-1" />
                                                        {item.asignado.fecha ? formatDate(item.asignado.fecha) : "No asignado"}
                                                    </small> */}
                                                </div>
                                            ) : (
                                                <span className="text-muted">Libre</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="text-center py-4">
                                        <div className="text-muted">No se encontraron productos con los filtros aplicados</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            {/* Badges de filtros activos */}
            {(filtroFechaActivo || filterEstado || Object.values(columnFiltersItems).some((x) => x)) && (
                <div className="mt-2 mb-5 d-flex flex-wrap gap-2">
                    {filtroFechaActivo && (
                        <Badge color="light" className="d-flex align-items-center p-2 text-dark">
                            <Calendar size={14} className="me-1" />
                            <small>
                                {tipoFecha === "creacion" ? "Creación" : "Entrega"}: {moment(fechaInicio, "YYYY-MM-DD").format("DD/MM/YYYY")} - {moment(fechaFin, "YYYY-MM-DD").format("DD/MM/YYYY")}
                            </small>
                            <Button close size="sm" onClick={limpiarFiltroFechas} className="ms-2" />
                        </Badge>
                    )}
                    {filterEstado && (
                        <Badge color="light" className="d-flex align-items-center p-2 text-dark">
                            <small>Estado: {productionHelper.getEstadoTextItem(filterEstado)}</small>
                            {/*  <Button close size="sm" onClick={() => setFilterEstado("")} className="ms-2" /> */}
                            <Button
                                close
                                size="sm"
                                onClick={() => {
                                    setFilterEstado("")
                                    handleColumnFilterChange("estado", "")
                                }}
                                className="ms-2"
                            />
                        </Badge>
                    )}
                    {Object.entries(columnFiltersItems).map(([key, value]) => {
                        if (value && key !== "estado") {
                            return (
                                <Badge key={key} color="light" className="d-flex align-items-center p-2 text-dark">
                                    <small>
                                        {key}: {value}
                                    </small>
                                    <Button close size="sm" onClick={() => handleColumnFilterChange(key, "")} className="ms-2" />
                                </Badge>
                            )
                        }
                        return null
                    })}
                    <Button color="secondary" size="sm" onClick={clearAllFilters}>
                        Limpiar todos los filtros
                    </Button>
                </div>
            )}

            {/* Espacio adicional para evitar que el footer fijo tape contenido */}
            <div style={{ height: "60px" }}></div>

            {/* Footer con paginación y acciones - Fijo en la parte inferior */}
            <div style={footerStyle}>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    {/* Información y acciones */}
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <div className="text-muted me-4">
                            <small>
                                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} de{" "}
                                {filteredItems.length} pedidos
                            </small>
                        </div>

                        {selectedItems.length > 0 && (
                            <div className="d-flex align-items-center">
                                <Badge color="primary" pill className="me-2">
                                    {selectedItems.length}
                                </Badge>
                                <UncontrolledDropdown>
                                    <DropdownToggle color="light" size="sm" className="d-flex align-items-center">
                                        Acciones <ChevronDown size={14} className="ms-1" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                       {/*  <DropdownItem onClick={openAsignacionModal}>
                                            <User size={14} className="me-2" /> Asignar zona a pedidos
                                        </DropdownItem> */}
                                        <DropdownItem onClick={openCambioEstadoModal}>
                                            <Edit size={14} className="me-2" /> Cambiar estado
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>
                                            <Download size={14} className="me-2" /> Exportar seleccionados
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    <div className="d-flex align-items-center">
                        <div className="me-3 d-flex align-items-center">
                            <small className="text-muted me-2">Mostrar</small>
                            <Input
                                type="select"
                                bsSize="sm"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value))
                                    setCurrentPage(1)
                                }}
                                style={{ width: "60px" }}
                                className="form-select-sm"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Input>
                        </div>

                        <Pagination size="sm" className="mb-0">
                            <PaginationItem disabled={currentPage === 1}>
                                <PaginationLink previous onClick={() => paginate(currentPage - 1)}>
                                    <ChevronLeft size={14} />
                                </PaginationLink>
                            </PaginationItem>

                            {totalPages <= 5 ? (
                                // Si hay 5 páginas o menos, mostrar todas
                                Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <PaginationItem key={number} active={number === currentPage}>
                                        <PaginationLink onClick={() => paginate(number)}>{number}</PaginationLink>
                                    </PaginationItem>
                                ))
                            ) : (
                                // Si hay más de 5 páginas, mostrar un subconjunto
                                <>
                                    {/* Primera página */}
                                    {currentPage > 2 && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => paginate(1)}>1</PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {/* Elipsis si estamos lejos del inicio */}
                                    {currentPage > 3 && (
                                        <PaginationItem disabled>
                                            <PaginationLink>...</PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {/* Página anterior si no estamos en la primera */}
                                    {currentPage > 1 && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => paginate(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {/* Página actual */}
                                    <PaginationItem active>
                                        <PaginationLink onClick={() => paginate(currentPage)}>{currentPage}</PaginationLink>
                                    </PaginationItem>
                                    {/* Página siguiente si no estamos en la última */}
                                    {currentPage < totalPages && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => paginate(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {/* Elipsis si estamos lejos del final */}
                                    {currentPage < totalPages - 2 && (
                                        <PaginationItem disabled>
                                            <PaginationLink>...</PaginationLink>
                                        </PaginationItem>
                                    )}

                                    {/* Última página */}
                                    {currentPage < totalPages - 1 && (
                                        <PaginationItem>
                                            <PaginationLink onClick={() => paginate(totalPages)}>{totalPages}</PaginationLink>
                                        </PaginationItem>
                                    )}
                                </>
                            )}

                            <PaginationItem disabled={currentPage === totalPages}>
                                <PaginationLink next onClick={() => paginate(currentPage + 1)}>
                                    <ChevronRightIcon size={14} />
                                </PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    </div>
                </div>
            </div>
        </Container>
    )
}
