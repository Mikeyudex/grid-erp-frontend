"use client"
import React, { Fragment } from "react"
import { useState, useEffect } from "react"
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Table,
    Badge,
    Button,
    Input,
    InputGroup,
    Form,
    Collapse,
    Pagination,
    PaginationItem,
    PaginationLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledTooltip,
} from "reactstrap"
import {
    Search,
    ChevronDown,
    ChevronRight,
    CheckSquare,
    Square,
    User,
    Clock,
    RefreshCw,
    CheckCircle,
    Edit,
    ChevronLeft,
    ChevronRightIcon,
    Calendar,
    Filter,
    InfoIcon,
    Check,
    MapPinPlus
} from "lucide-react"
import ModalAsignacion from "../components/ModalAsignacion"
import ModalCambioEstado from "../components/ModalCambioEstado"
import { ProductHelper } from "../../Products/helper/product_helper"
import { UserHelper } from "../../Users/helpers/user_helper"
import moment from "moment"
import { footerStyle } from "./footerStyle"
import { PurchaseHelper } from "../../PurchaseOrder/helper/purchase_helper"
import { ProductionHelper } from "../helper/production-helper"
import { AuthHelper } from "../../Auth/helpers/auth_helper"
import ModalAsignacionXZona from "../components/ModalAsignacionZona"
import { IndexedDBService } from "../../../../helpers/indexedDb/indexed-db-helper"

const productHelper = new ProductHelper();
const userHelper = new UserHelper();
const productionHelper = new ProductionHelper();
const authHelper = new AuthHelper();
const indexedDBService = new IndexedDBService();

export default function ProductionListPage() {
    document.title = "Ordenes de Producción | Quality";
    const [expandedRows, setExpandedRows] = useState({})
    const [selectedProducts, setSelectedProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredPedidos, setFilteredPedidos] = useState([])
    const [filterEstado, setFilterEstado] = useState("")
    const [asignacionModalOpen, setAsignacionModalOpen] = useState(false)
    const [asignacionZonaModalOpen, setAsignacionZonaModalOpen] = useState(false)
    const [agentesProduccion, setAgentesProduccion] = useState([])
    const [selectedAgent, setSelectedAgent] = useState("")
    const [pedidos, setPedidos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [cambioEstadoModalOpen, setCambioEstadoModalOpen] = useState(false)
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [reloadTable, setReloadTable] = useState(false);
    const [zones, setZones] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [selectedPedidos, setSelectedPedidos] = useState([]);

    // Nuevos estados para el filtro de fechas
    const [tipoFecha, setTipoFecha] = useState("creacion")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [filtroFechaActivo, setFiltroFechaActivo] = useState(false);

    // estados de carga para las operaciones asíncronas
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // estados para el ordenamiento después de los estados existentes
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc") // "asc" o "desc"
    // Añadir nuevos estados para los filtros por columna después de los estados existentes
    const [columnFilters, setColumnFilters] = useState({
        id: "",
        ciudad: "",
        fecha: "",
        cliente: "",
        fechaEntrega: "",
        estado: filterEstado, // Inicializar con el filtro de estado existente
        productos: "",
        zone: "",
    })

    // Añadir función para manejar cambios en los filtros de columna
    const handleColumnFilterChange = (column, value) => {
        setColumnFilters({
            ...columnFilters,
            [column]: value,
        })
    }

    const purchaseHelper = new PurchaseHelper();

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
                let parsedPurchaseOrders = purchaseOrders.map((po) => {
                    return {
                        _id: po._id,
                        id: po.orderNumber,
                        fecha: po.createdAt,
                        cliente: po.cliente,
                        productos: po.details.map((item) => {
                            return {
                                id: item._id,
                                productId: item.productId,
                                nombre: item.productName,
                                tipo: item.matType,
                                material: item.materialType,
                                piezas: item.pieces,
                                piecesNames: item.piecesNames,
                                cantidad: item.quantityItem,
                                estado: item.itemStatus,
                                asignado: {
                                    id: item?.assignedId || null,
                                    nombre: agentesProduccion.find((a) => a.id === item.assignedId)?.nombre || null,
                                    fecha: item?.assignedAt || null,
                                },
                                marca: item?.marca,
                                linea: item?.productName,
                            }
                        }),
                        estado: po.status,
                        fechaEntrega: po.deliveryDate,
                        zoneId: po.zoneId,
                    }
                });
                setPedidos(parsedPurchaseOrders);
                setFilteredPedidos(parsedPurchaseOrders);
            })
            .catch(e => console.log(e))
            .finally(() => {
                setIsLoading(false);
            });
    }, [reloadTable, agentesProduccion]);

    // Aplicar filtros
    useEffect(() => {
        const term = searchTerm.toLowerCase()
        let filtered = pedidos;

        // Aplicar filtro general de búsqueda si existe
        if (term) {
            filtered = filtered.filter(
                (pedido) =>
                    (String(pedido?.id).includes(term) ||
                        pedido?.cliente?.nombre.toLowerCase().includes(term) ||
                        (pedido?.cliente?.ciudad && pedido?.cliente.ciudad.toLowerCase().includes(term)) ||
                        (pedido.cliente?.empresa && pedido?.cliente.empresa.toLowerCase().includes(term))) &&
                    (filterEstado === "" || pedido.estado === filterEstado),
            )
        }
        // Aplicar filtros por columna
        if (columnFilters.id) {
            filtered = filtered.filter((pedido) => String(pedido?.id).includes(columnFilters.id.toLowerCase()))
        }

        if (columnFilters.ciudad) {
            filtered = filtered.filter((pedido) => pedido.cliente.ciudad.toLowerCase().includes(columnFilters.ciudad.toLowerCase()))
        }

        if (columnFilters.fecha) {
            filtered = filtered.filter((pedido) => pedido.fecha.toLowerCase().includes(columnFilters.fecha.toLowerCase()))
        }

        if (columnFilters.cliente) {
            filtered = filtered.filter(
                (pedido) =>
                    pedido.cliente.nombre.toLowerCase().includes(columnFilters.cliente.toLowerCase()) ||
                    (pedido.cliente.empresa &&
                        pedido.cliente.empresa.toLowerCase().includes(columnFilters.cliente.toLowerCase())),
            )
        }

        if (columnFilters.fechaEntrega) {
            filtered = filtered.filter((pedido) =>
                pedido.fechaEntrega.toLowerCase().includes(columnFilters.fechaEntrega.toLowerCase()),
            )
        }

        if (columnFilters.estado) {
            filtered = filtered.filter((pedido) => pedido.estado === columnFilters.estado)
        }

        if (columnFilters.zone) {
            filtered = filtered.filter((pedido) => pedido.zoneId?.name.toLowerCase().includes(columnFilters.zone.toLowerCase()))
        }

        if (columnFilters.productos) {
            filtered = filtered.filter((pedido) =>
                pedido.productos.some((producto) =>
                    producto.nombre.toLowerCase().includes(columnFilters.productos.toLowerCase()),
                ),
            )
        }

        // Aplicar filtro de fechas si está activo
        if (filtroFechaActivo && fechaInicio && fechaFin) {
            //set utc to fechaFinObj substract 5 hours
            const fechaInicioObj = new Date(fechaInicio)
            const fechaFinObj = new Date(fechaFin);
            fechaFinObj.setHours(23, 59, 59, 999);
            fechaFinObj.setUTCHours(fechaFinObj.getUTCHours() - 5)
            fechaFinObj.setUTCHours(fechaFinObj.getUTCHours() + 24)

            filtered = filtered.filter((pedido) => {
                const fechaPedido = new Date(tipoFecha === "creacion" ? pedido.fecha : pedido.fechaEntrega)
                return fechaPedido >= fechaInicioObj && fechaPedido <= fechaFinObj
            })
        }
        if (sortField) {
            filtered.sort((a, b) => {
                let valueA, valueB

                // Determinar los valores a comparar según el campo
                if (sortField === "estado") {
                    valueA = a.estado
                    valueB = b.estado
                }
                // Aquí se pueden añadir más campos para ordenar en el futuro

                if (sortDirection === "asc") {
                    return valueA.localeCompare(valueB)
                } else {
                    return valueB.localeCompare(valueA)
                }
            })
        }
        setFilteredPedidos(filtered);

    }, [
        searchTerm,
        filterEstado,
        filtroFechaActivo,
        fechaInicio,
        fechaFin,
        tipoFecha,
        sortField,
        sortDirection,
        columnFilters
    ]);

    // Actualizar la función handleFilterChange para sincronizar con columnFilters
    const handleFilterChange = (e) => {
        const estado = e.target.value
        setFilterEstado(estado)
        setColumnFilters({
            ...columnFilters,
            estado: estado,
        })
    }

    const handleFilterChangeStatusColumn = (status) => {
        setFilterEstado(status)
        setColumnFilters({
            ...columnFilters,
            estado: status,
        })
    }

    // Añadir función para limpiar todos los filtros
    const clearAllFilters = () => {
        setSearchTerm("")
        setFilterEstado("")
        setColumnFilters({
            id: "",
            fecha: "",
            cliente: "",
            fechaEntrega: "",
            estado: "",
            productos: "",
        })
        limpiarFiltroFechas()
    }

    const toggleRowExpand = (id) => {
        setExpandedRows({
            ...expandedRows,
            [id]: !expandedRows[id],
        })
    }

    const handleSearch = (e) => {
        e.preventDefault()
        // La búsqueda ya se aplica en el useEffect
    }

    const handleRefresh = () => {
        setReloadTable(!reloadTable);
    }

    const handlePedidoToggle = (pedidoId) => {
        togglePedidoSelection(pedidoId);
        toggleAllProductsInOrder(pedidoId);
    };

    const togglePedidoSelection = (pedidoId) => {
        const pedido = filteredPedidos.find((p) => p.id === pedidoId)

        if (!pedido) return;
        // Verificamos si ya está seleccionado
        const isSelected = selectedPedidos.find((pedido) => pedido.id === pedidoId);

        if (isSelected) {
            // Deseleccionar el pedido
            let newSelectedPedidos = selectedPedidos.filter((pedido) => pedido.id !== pedidoId);
            setSelectedPedidos(newSelectedPedidos);

        } else {
            // Seleccionar el pedido
            let newSelectedPedidos = [...selectedPedidos, pedido];
            setSelectedPedidos(newSelectedPedidos);
        }
    };

    const toggleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId))
        } else {
            setSelectedProducts([...selectedProducts, productId])
        }
    }

    const toggleAllProductsInOrder = (pedidoId) => {
        const pedido = filteredPedidos.find((p) => p.id === pedidoId)
        if (!pedido) return;

        const productIds = pedido.productos
            .filter((producto) => producto.estado !== "completado")
            .map((producto) => producto.id)

        // Verificar si todos los productos del pedido ya están seleccionados
        const allSelected = productIds.every((id) => selectedProducts.includes(id))

        if (allSelected) {
            // Deseleccionar todos los productos del pedido
            setSelectedProducts(selectedProducts.filter((id) => !productIds.includes(id)))
        } else {
            // Seleccionar todos los productos del pedido que no estén ya seleccionados
            const newSelectedProducts = [...selectedProducts]
            productIds.forEach((id) => {
                if (!newSelectedProducts.includes(id)) {
                    newSelectedProducts.push(id)
                }
            })
            setSelectedProducts(newSelectedProducts);
        }
    }

    const openAsignacionModal = () => {
        if (selectedProducts.length === 0) {
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
            const updatedPedidos = [...pedidos]

            // Preparar las actualizaciones y las promesas
            selectedProducts.forEach((productId) => {
                // Encontrar el pedido y producto correspondiente
                for (const pedido of updatedPedidos) {
                    const producto = pedido.productos.find((p) => p.id === productId)
                    if (producto) {
                        // Añadir la promesa para este producto
                        asignacionPromises.push(
                            purchaseHelper.assignItemToProductionOperator(pedido._id, productId, agente.id).then(() => {
                                // Actualizar el estado local del producto
                                producto.estado = "fabricacion"
                                producto.asignado = {
                                    id: agente.id,
                                    nombre: agente.nombre,
                                    fecha: new Date().toISOString().split("T")[0],
                                }
                            }),
                        )
                        break // Salir del bucle una vez encontrado
                    }
                }
            })

            // Ejecutar todas las asignaciones en paralelo
            await Promise.all(asignacionPromises)

            // Actualizar el estado local con los cambios
            setPedidos(updatedPedidos)
            setFilteredPedidos(
                filteredPedidos.map((pedido) => {
                    const updatedPedido = updatedPedidos.find((p) => p._id === pedido._id)
                    return updatedPedido || pedido
                }),
            )

            setSuccessMessage(`${selectedProducts.length} productos asignados correctamente a ${agente.nombre}`)
            setReloadTable(!reloadTable);
            // Cerrar modal y limpiar selección
            setTimeout(() => {
                setAsignacionModalOpen(false)
                setSelectedProducts([])
                setSelectedAgent("")
                setSuccessMessage("")
            }, 1500)
        } catch (error) {
            console.error("Error al asignar productos:", error)
            setErrorMessage("Ocurrió un error al asignar los productos. Por favor, inténtelo de nuevo.")
        } finally {
            setIsLoading(false);
        }
    }

    const handleAsignarProductosXZona = async () => {
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
    };

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
            const updatedPedidos = [...pedidos]

            // Preparar las actualizaciones y las promesas
            selectedProducts.forEach((productId) => {
                // Encontrar el pedido y producto correspondiente
                for (const pedido of updatedPedidos) {
                    const producto = pedido.productos.find((p) => p.id === productId)
                    if (producto) {
                        // Datos para el cambio de estado
                        const data = {
                            status: nuevoEstado
                        }

                        // Añadir la promesa para este producto
                        const userId = localStorage.getItem("userId") || "66d4ed2f825f2d54204555c1";

                        cambioEstadoPromises.push(
                            purchaseHelper.changeStatusPurchaseOrder(pedido._id, productId, userId, data).then(() => {
                                // Actualizar el estado local del producto
                                producto.estado = nuevoEstado

                                // Si el estado es "pendiente", eliminar la asignación
                                if (nuevoEstado === "pendiente") {
                                    producto.asignado = null
                                }
                            }),
                        )
                        break // Salir del bucle una vez encontrado
                    }
                }
            })

            // Ejecutar todos los cambios de estado en paralelo
            await Promise.all(cambioEstadoPromises)

            // Actualizar el estado local con los cambios
            setPedidos(updatedPedidos)
            setFilteredPedidos(
                filteredPedidos.map((pedido) => {
                    const updatedPedido = updatedPedidos.find((p) => p._id === pedido._id)
                    return updatedPedido || pedido
                }),
            )

            setSuccessMessage(
                `Estado de ${selectedProducts.length} productos cambiado correctamente a "${productionHelper.getEstadoTextItem(nuevoEstado)}"`,
            );
            setReloadTable(!reloadTable);
            // Cerrar modal y limpiar selección
            setTimeout(() => {
                setCambioEstadoModalOpen(false)
                setSelectedProducts([])
                setNuevoEstado("")
                setSuccessMessage("")
            }, 1500)
        } catch (error) {
            console.error("Error al cambiar el estado de los productos:", error)
            setErrorMessage("Ocurrió un error al cambiar el estado. Por favor, inténtelo de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    const getProductosSeleccionadosInfo = () => {
        let count = 0
        const pedidosInfo = {}

        filteredPedidos.forEach((pedido) => {
            pedido.productos.forEach((producto) => {
                if (selectedProducts.includes(producto.id)) {
                    count++
                    if (!pedidosInfo[pedido.id]) {
                        pedidosInfo[pedido.id] = {
                            cliente: pedido.cliente.nombre,
                            count: 1,
                        }
                    } else {
                        pedidosInfo[pedido.id].count++
                    }
                }
            })
        })

        return {
            count,
            pedidosInfo: Object.entries(pedidosInfo).map(([id, info]) => ({
                id,
                cliente: info.cliente,
                count: info.count,
            })),
        }
    }

    const openCambioEstadoModal = () => {
        if (selectedProducts.length === 0) {
            alert("Por favor, seleccione al menos un producto para cambiar su estado")
            return
        }
        setCambioEstadoModalOpen(true)
    }

    const areAllProductsInOrderSelected = (pedidoId) => {
        const pedido = filteredPedidos.find((p) => p.id === pedidoId)
        if (!pedido) return false;

        const selectableProducts = pedido.productos.filter((producto) => producto.estado !== "completado")
        if (selectableProducts.length === 0) return false

        return selectableProducts.every((producto) => selectedProducts.includes(producto.id))
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
    const currentPedidos = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage)

    // Función para cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div className="page-content">
            <Container fluid className="py-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h1>Panel de Producción</h1>
                    <div className="d-flex gap-2">
                        <Button title="Actualizar" color="light" className="d-flex align-items-center gap-2" onClick={handleRefresh}>
                            <RefreshCw size={18} />
                        </Button>
                        {(selectedProducts.length > 0 || selectedPedidos.length > 0) && (
                            <Fragment>
                                {/*  <Button title="Asignar productos seleccionados" color="light" onClick={openAsignacionModal} className="d-flex align-items-center gap-2">
                                    <User size={18} />  ({selectedProducts.length})
                                </Button> */}

                                <Button title="Asignar pedidos seleccionados" color="light" onClick={openAsignacionXZonaModal} className="d-flex align-items-center gap-2">
                                    <MapPinPlus size={18} />  ({selectedPedidos.length})
                                </Button>

                                <Button title="Cambiar estado" color="light" size="sm" onClick={openCambioEstadoModal}>
                                    <Check size={18} />
                                </Button>
                            </Fragment>
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
                    selectedProducts={selectedProducts}
                    setNuevoEstado={setNuevoEstado}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    successMessage={successMessage}
                    statusOptions={productionHelper.getStatusOptionsByOrder()}
                />

                {/* Modal de Asignación de zona */}
                <ModalAsignacionXZona
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
                />

                {/* Card de busqueda */}
                <Card className="shadow-sm mb-2">
                    <CardBody>
                        <Row>
                            <Col md={8}>
                                <Form onSubmit={handleSearch}>
                                    <InputGroup>
                                        <Input
                                            placeholder="Buscar por ID, ciudad, cliente o empresa..."
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
                                    <option value="libre">Libre</option>
                                    <option value="asignado">Asignado</option>
                                    <option value="fabricacion">En Fabricación</option>
                                    <option value="despachado">Despachado</option>
                                </Input>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Card className="shadow-sm">
                    <div className="table-responsive">
                        <Table hover style={{ minHeight: '19rem' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "3%" }}></th>
                                    <th style={{ width: "8%" }}>#</th>
                                    <th style={{ width: "13%" }}>Ciudad</th>
                                    <th style={{ width: "12%" }} className="position-relative">
                                        Fecha
                                        <UncontrolledDropdown className="d-inline-block ms-1">
                                            <DropdownToggle color="link" size="sm" className="p-0 text-muted">
                                                {filtroFechaActivo && tipoFecha === "creacion" ? (
                                                    <Filter size={12} className="text-primary" />
                                                ) : (
                                                    <Filter size={12} />
                                                )}
                                            </DropdownToggle>
                                            <DropdownMenu className="p-3" style={{ width: "280px" }}>
                                                <div className="mb-2">
                                                    <small className="text-muted d-block mb-1">Filtrar por fecha de creación</small>
                                                    <div className="d-flex gap-2 mb-2">
                                                        <Input
                                                            type="date"
                                                            value={fechaInicio}
                                                            onChange={(e) => setFechaInicio(e.target.value)}
                                                            bsSize="sm"
                                                            className="flex-grow-1"
                                                        />
                                                        <Input
                                                            type="date"
                                                            value={fechaFin}
                                                            onChange={(e) => setFechaFin(e.target.value)}
                                                            bsSize="sm"
                                                            className="flex-grow-1"
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <Button
                                                            color="secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setTipoFecha("creacion")
                                                                limpiarFiltroFechas()
                                                            }}
                                                        >
                                                            Limpiar
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setTipoFecha("creacion")
                                                                aplicarFiltroFechas()
                                                            }}
                                                            disabled={!fechaInicio || !fechaFin}
                                                        >
                                                            Aplicar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </th>
                                    <th style={{ width: "15%" }}>Cliente</th>
                                    <th style={{ width: "15%" }} className="position-relative">
                                        Entrega
                                        <UncontrolledDropdown className="d-inline-block ms-1">
                                            <DropdownToggle color="link" size="sm" className="p-0 text-muted">
                                                {filtroFechaActivo && tipoFecha === "entrega" ? (
                                                    <Filter size={12} className="text-primary" />
                                                ) : (
                                                    <Filter size={12} />
                                                )}
                                            </DropdownToggle>
                                            <DropdownMenu className="p-3" style={{ width: "280px" }}>
                                                <div className="mb-2">
                                                    <small className="text-muted d-block mb-1">Filtrar por fecha de entrega</small>
                                                    <div className="d-flex gap-2 mb-2">
                                                        <Input
                                                            type="date"
                                                            value={fechaInicio}
                                                            onChange={(e) => setFechaInicio(e.target.value)}
                                                            bsSize="sm"
                                                            className="flex-grow-1"
                                                        />
                                                        <Input
                                                            type="date"
                                                            value={fechaFin}
                                                            onChange={(e) => setFechaFin(e.target.value)}
                                                            bsSize="sm"
                                                            className="flex-grow-1"
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <Button
                                                            color="secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setTipoFecha("entrega")
                                                                limpiarFiltroFechas()
                                                            }}
                                                        >
                                                            Limpiar
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setTipoFecha("entrega")
                                                                aplicarFiltroFechas()
                                                            }}
                                                            disabled={!fechaInicio || !fechaFin}
                                                        >
                                                            Aplicar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                        {filtroFechaActivo && tipoFecha === "entrega" && (
                                            <Badge
                                                color="info"
                                                pill
                                                className="position-absolute"
                                                style={{ top: "1px", right: "2px", fontSize: "8px" }}
                                            >
                                                •
                                            </Badge>
                                        )}
                                    </th>
                                    <th style={{ width: "10%" }}>
                                        <div
                                            className="d-inline-block ms-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleSort("estado")}
                                        >
                                            Estado
                                        </div>
                                        {sortField === "estado" && <span className="ms-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                        <UncontrolledDropdown className="d-inline-block ms-1">
                                            <DropdownToggle color="link" size="sm" className="p-0 text-muted">
                                                {filterEstado ? <Filter size={12} className="text-primary" /> : <Filter size={12} />}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => handleFilterChangeStatusColumn("")} active={filterEstado === ""}>
                                                    Todos los estados
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => handleFilterChangeStatusColumn("libre")}
                                                    active={filterEstado === "libre"}
                                                >
                                                    Libre
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => handleFilterChangeStatusColumn("asignado")}
                                                    active={filterEstado === "asignado"}
                                                >
                                                    Asignado
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => handleFilterChangeStatusColumn("fabricacion")}
                                                    active={filterEstado === "fabricacion"}
                                                >
                                                    En Producción
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => handleFilterChangeStatusColumn("despachado")}
                                                    active={filterEstado === "despachado"}
                                                >
                                                    Despachado
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                        {filterEstado && (
                                            <Badge
                                                color="info"
                                                pill
                                                className="position-absolute"
                                                style={{ top: "-5px", right: "-5px", fontSize: "8px" }}
                                            >
                                                •
                                            </Badge>
                                        )}

                                    </th>
                                    <th style={{ width: "10%" }}>Sede</th>
                                    <th style={{ width: "15%" }}>Productos</th>
                                </tr>
                                {/* Fila de filtros por columna */}
                                <tr className="bg-light">
                                    <th></th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar #..."
                                            value={columnFilters.id}
                                            onChange={(e) => handleColumnFilterChange("id", e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar ciudad..."
                                            value={columnFilters.ciudad}
                                            onChange={(e) => handleColumnFilterChange("ciudad", e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar fecha..."
                                            value={columnFilters.fecha}
                                            onChange={(e) => handleColumnFilterChange("fecha", e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar cliente..."
                                            value={columnFilters.cliente}
                                            onChange={(e) => handleColumnFilterChange("cliente", e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar fecha entrega..."
                                            value={columnFilters.fechaEntrega}
                                            onChange={(e) => handleColumnFilterChange("fechaEntrega", e.target.value)}
                                        />
                                    </th>
                                    <th>{/* El filtro de estado ya está implementado en el dropdown */}</th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar sede..."
                                            value={columnFilters.zone}
                                            onChange={(e) => handleColumnFilterChange("zone", e.target.value)}
                                        />
                                    </th>
                                    <th>
                                        <Input
                                            type="text"
                                            bsSize="sm"
                                            placeholder="Buscar productos..."
                                            value={columnFilters.productos}
                                            onChange={(e) => handleColumnFilterChange("productos", e.target.value)}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading && (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">
                                                <div className="text-muted">Cargando...</div>
                                            </td>
                                        </tr>
                                    )
                                }
                                {currentPedidos.length > 0 ? (
                                    currentPedidos.map((pedido) => (
                                        <React.Fragment key={pedido.id}>
                                            <tr key={pedido.id}>
                                                <td className="text-center">
                                                    <Button
                                                        color="link"
                                                        className="p-0 text-dark"
                                                        onClick={() => toggleRowExpand(pedido.id)}
                                                        aria-label={expandedRows[pedido.id] ? "Contraer fila" : "Expandir fila"}
                                                    >
                                                        {expandedRows[pedido.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    </Button>
                                                </td>
                                                <td>#{pedido.id}</td>
                                                <td>{pedido?.cliente?.ciudad || "Sin ciudad"}</td>
                                                <td>{formatDate(pedido.fecha)}</td>
                                                <td>
                                                    <div className="fw-medium">{pedido.cliente.nombre}</div>
                                                    {pedido.cliente.empresa && <small className="text-muted">{pedido.cliente.empresa}</small>}
                                                </td>
                                                <td>{formatDate(pedido.fechaEntrega)}</td>
                                                <td>
                                                    <Badge color={productionHelper.getStatusBadgeColorOrder(pedido.estado)}>{productionHelper.getEstadoTextOrder(pedido.estado)}</Badge>
                                                </td>
                                                <td>{pedido.zoneId?.name}</td>
                                                <td>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span>{pedido.productos.length} productos</span>
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                /*  toggleAllProductsInOrder(pedido.id) */
                                                                handlePedidoToggle(pedido.id)
                                                            }}
                                                            style={{ cursor: "pointer" }}
                                                            className="d-flex align-items-center"
                                                        >
                                                            {areAllProductsInOrderSelected(pedido.id) ? (
                                                                <CheckSquare size={18} className="text-primary" />
                                                            ) : (
                                                                <Square size={18} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr key={`collapse-${pedido.id}`}>
                                                <td colSpan="8" className="p-0 border-0">
                                                    <Collapse isOpen={expandedRows[pedido.id]}>
                                                        <div className="bg-light p-3 w-100">
                                                            <h6 className="mb-3">Productos del Pedido #{pedido.id}</h6>
                                                            <Table bordered size="sm" className="bg-white">
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: "5%" }}></th>
                                                                        <th style={{ width: "40%" }}>Producto</th>
                                                                        <th style={{ width: "15%" }}>Tipo / Material</th>
                                                                        <th style={{ width: "10%" }}>Piezas</th>
                                                                        <th style={{ width: "10%" }}>Cantidad</th>
                                                                        <th style={{ width: "15%" }}>Estado</th>
                                                                        {/*  <th style={{ width: "20%" }}>Asignado a</th> */}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {pedido.productos.map((producto) => (
                                                                        <tr key={producto.id}>
                                                                            <td className="text-center p-1">

                                                                                <div
                                                                                    onClick={() => toggleProductSelection(producto.id)}
                                                                                    style={{ cursor: "pointer" }}
                                                                                    className="d-flex justify-content-center p-1"
                                                                                >
                                                                                    {selectedProducts.includes(producto.id) ? (
                                                                                        <CheckSquare size={18} className="text-primary" />
                                                                                    ) : (
                                                                                        <Square size={18} />
                                                                                    )}
                                                                                </div>

                                                                            </td>
                                                                            <td className="p-1">
                                                                                <div><strong>{producto.nombre}</strong>  </div>
                                                                                <span>Marca:</span><small className="text-muted"> {producto?.marca}</small> | {" "}
                                                                                <span>Linea:</span><small className="text-muted"> {producto?.linea}</small>
                                                                            </td>
                                                                            <td>
                                                                                <div>{producto.tipo}</div>
                                                                                <small className="text-muted">{producto.material}</small>
                                                                            </td>
                                                                            <td className="p-1">
                                                                                {producto.piezas}
                                                                                {/* Tooltip Piezas */}
                                                                                <UncontrolledTooltip placement="top" target="piezas">
                                                                                    <div className="d-flex flex-column">
                                                                                        <div className="fw-bold">Piezas:</div>
                                                                                        <div className="text-muted">
                                                                                            {producto.piecesNames.join(", ")}
                                                                                        </div>
                                                                                    </div>
                                                                                </UncontrolledTooltip>
                                                                                <InfoIcon id="piezas" size={16} className="ms-1 cursor-pointer" />
                                                                            </td>
                                                                            <td className="p-1">{producto.cantidad}</td>
                                                                            <td className="p-1">
                                                                                <Badge color={productionHelper.getStatusBadgeColorItem(producto.estado)}>
                                                                                    {productionHelper.getEstadoTextItem(producto.estado)}
                                                                                </Badge>
                                                                            </td>
                                                                            {/* <td className="p-1">
                                                                                {producto.asignado?.id ? (
                                                                                    <div>
                                                                                        <div className="fw-medium">{producto.asignado.nombre}</div>
                                                                                        <small className="text-muted d-flex align-items-center">
                                                                                            <Clock size={12} className="me-1" />
                                                                                            {formatDate(producto.asignado.fecha)}
                                                                                        </small>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span className="text-muted">No asignado</span>
                                                                                )}
                                                                            </td> */}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Collapse>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            {
                                                !isLoading && (
                                                    <div className="text-muted">No se encontraron pedidos con los filtros aplicados</div>
                                                )
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>

                {(filtroFechaActivo || filterEstado || Object.values(columnFilters).some((x) => x)) && (
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
                                <small>Estado: {productionHelper.getEstadoTextOrder(filterEstado)}</small>
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
                        {Object.entries(columnFilters).map(([key, value]) => {
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
                <div style={{ height: "50px" }}></div>

                {/* Footer con paginación y acciones - Fijo en la parte inferior */}
                <div style={footerStyle}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        {/* Información y acciones */}
                        <div className="d-flex align-items-center mb-3 mb-md-0">
                            <div className="text-muted me-4">
                                <small>
                                    Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPedidos.length)} de{" "}
                                    {filteredPedidos.length} pedidos
                                </small>
                            </div>

                            {selectedProducts.length > 0 && (
                                <div className="d-flex align-items-center">
                                    <Badge color="primary" pill className="me-2">
                                        {selectedProducts.length}
                                    </Badge>
                                    <UncontrolledDropdown>
                                        <DropdownToggle color="light" size="sm" className="d-flex align-items-center">
                                            Acciones <ChevronDown size={14} className="ms-1" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={openAsignacionModal}>
                                                <User size={14} className="me-2" /> Asignar productos
                                            </DropdownItem>
                                            <DropdownItem onClick={openCambioEstadoModal}>
                                                <Edit size={14} className="me-2" /> Cambiar estado
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            )}
                        </div>

                        {/* Paginación simplificada */}
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
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </Input>
                            </div>

                            <Pagination size="sm" className="mb-0" style={{ paddingTop: "15px" }}>
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
        </div>
    )
}
