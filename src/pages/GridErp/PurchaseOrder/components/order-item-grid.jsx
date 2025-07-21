"use client"

import { useState, useEffect, useRef, Fragment } from "react"
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
    FormText,
    ListGroup,
    ListGroupItem,
    Alert,
    Label,
    FormGroup,
    Row,
    Col,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import {
    PlusCircle,
    Trash2,
    Edit2,
    User,
    Search,
    Check,
    Save,
    X,
    CheckSquare,
    Square,
    Edit,
    CheckCircle,
    StoreIcon,
    CreditCard,
} from "lucide-react"
import { ProductHelper } from "../../Products/helper/product_helper"
import DropdownPortal from "./DropdownPortal"
import { CREATE_PURCHASE_ORDER } from "../../Products/helper/url_helper"
import { validatePayload } from "../utils/purchase-order.utils";
import "./index.css";
import { PurchaseHelper, purchaseOrderStatus } from "../helper/purchase_helper";
import AssignModal from "./assign-modal";
import { AuthHelper } from "../../Auth/helpers/auth_helper";
import { CollapsibleSection } from "../../../../Components/Common/CollapsibleSection";
import moment from "moment";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { BASE_URL, UPLOAD_FILE } from "../../../../helpers/url_helper";
import ToastComponent from "../../../../Components/Common/Toast";


const productHelper = new ProductHelper();
const authHelper = new AuthHelper();
const purchaseOrderHelper = new PurchaseHelper();

export default function OrderGrid({
    selectedClient,
    onClientSelect,
    clients,
    products,
    matTypeOptions,
    materialTypeOptions,
    matMaterialPrices,
    // Nuevos props para modo edición
    orderItems: initialOrderItems = [],
    onAddItem = null,
    onUpdateItem = null,
    onRemoveItem = null,
    isEditMode = false,
    accountList,
}) {
    const [orderItems, setOrderItems] = useState(initialOrderItems)
    const [clientModalOpen, setClientModalOpen] = useState(false)
    const [clientSearchTerm, setClientSearchTerm] = useState("")
    const [filteredClients, setFilteredClients] = useState(clients);
    const [orderStatus, setOrderStatus] = useState(purchaseOrderStatus.libre);
    const [selectedContact, setSelectedContact] = useState(null);

    // Estado para el modal de piezas
    const [piecesModalOpen, setPiecesModalOpen] = useState(false)
    const [selectedPiecesTemp, setSelectedPiecesTemp] = useState([])
    const [typeOfPiecesRow, setTypeOfPiecesRow] = useState([])
    const [editingRowIndex, setEditingRowIndex] = useState(null)

    // Estados para edición en línea
    const [productSearchTerm, setProductSearchTerm] = useState("")
    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [productSelected, setProductSelected] = useState(null);
    const [editingCell, setEditingCell] = useState(null)
    const [observationsModalOpen, setObservationsModalOpen] = useState(false)
    const [currentObservations, setCurrentObservations] = useState("")
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);
    const rowRefs = useRef([]);
    const [rowError, setRowError] = useState({ rowIndex: null, message: "" });

    // Estados para selección de filas
    const [selectedRows, setSelectedRows] = useState([])
    const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false)
    const [bulkEditData, setBulkEditData] = useState({
        matType: "",
        materialType: "",
    });
    const [filteredMaterialTypes, setFilteredMaterialTypes] = useState([]);
    const [asignacionModalOpen, setAsignacionModalOpen] = useState(false);
    const [zones, setZones] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [editingZone, setEditingZone] = useState(false);
    const [editingDateOrder, setEditingDateOrder] = useState(false);
    const [editingContact, setEditingContact] = useState(false);
    const [orderDate, setOrderDate] = useState(null);
    // Estados para controlar las secciones colapsables
    const [openSections, setOpenSections] = useState({
        customer: false,
        products: true,
        total: false,
        methodOfPayment: false,
    });

    // Estados para formas de pago (agregar después de los otros estados)
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [messsageAlert, setMesssageAlert] = useState('');
    const [typeModal, setTypeModal] = useState('success');
    const [isOpenModal, setIsOpenModal] = useState(false);

    // Función para crear una nueva forma de pago vacía
    const createEmptyPaymentMethod = () => {
        return {
            cuenta: "",
            fecha: new Date().toISOString().split("T")[0], // Fecha actual por defecto
            valor: 0,
            soporte: null,
        }
    }


    // Actualizar orderItems cuando cambian los initialOrderItems en modo edición
    useEffect(() => {
        if (isEditMode && initialOrderItems.length > 0) {
            setOrderItems(initialOrderItems)
        }
    }, [initialOrderItems, isEditMode]);

    useEffect(() => {
        handleGetZones()
    }, []);

    const handleGetZones = async () => {
        let response = await authHelper.getZonesFetch();
        let zones = response.data;
        if (zones && Array.isArray(zones) && zones.length > 0) {
            setZones(zones);
        } else {
            setMesssageAlert('Ocurrió un error al obtener las sedes.');
            setTypeModal('danger');
            setIsOpenModal(true);
        }
    };

    // Crear una nueva fila vacía
    const createEmptyRow = () => {
        return {
            productName: "",
            productId: "",
            pieces: /* typeOfPieces.slice(0, 3).length || */ 0,
            selectedPieces: /* typeOfPieces.slice(0, 3).map((p) => p._id) || */[],
            matType: "Selecciona una opción",
            materialType: "Selecciona una opción",
            quantity: 1,
            basePrice: 0,
            observations: "",
            finalPrice: 0,
            adjustedPrice: 0,
        }
    }

    // Añadir una nueva fila
    const addNewRow = () => {
        /* if (!selectedClient) {
            alert("Por favor, seleccione un cliente primero")
            return
        } */
        //setOrderItems([...orderItems, createEmptyRow()])
        setProductSelected(null);
        const newRow = createEmptyRow()

        if (isEditMode && onAddItem) {
            // En modo edición, notificar al componente padre
            onAddItem(newRow)
        } else {
            // En modo creación, manejar internamente
            setOrderItems([...orderItems, newRow])
        }
    }

    // Eliminar una fila
    const removeRow = (index) => {
        if (isEditMode && onRemoveItem) {
            // En modo edición, notificar al componente padre
            onRemoveItem(index)
        } else {
            // En modo creación, manejar internamente
            const newItems = [...orderItems]
            newItems.splice(index, 1)
            setOrderItems(newItems)
        }
        // Actualizar selección de filas
        setSelectedRows(
            selectedRows
                .filter((rowIndex) => rowIndex !== index)
                .map((rowIndex) => (rowIndex > index ? rowIndex - 1 : rowIndex)),
        )
    }

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    const handleGetAdjustedPrice = async (productId, matType, materialType, quantity, typeCustomerId) => {
        try {
            if (!productId || !matType || !materialType || !quantity || !typeCustomerId) {
                return 0;
            }
            const response = await productHelper.calcularPrecioFinalProducto(productId, matType, materialType, quantity, typeCustomerId);
            return response?.data?.precioFinal || 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    const handleGetAdjustedPriceFromBasePrice = async (basePrice, matType, materialType, quantity, typeCustomerId) => {
        try {
            if (!basePrice || !matType || !materialType || !quantity || !typeCustomerId) {
                return 0;
            }
            const response = await productHelper.calcularPrecioFinalProductoDesdePrecioBase(basePrice, matType, materialType, quantity, typeCustomerId);
            return response?.data?.precioFinal || 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    // Actualizar un valor en una celda
    const updateCellValue = (rowIndex, field, value, product = null) => {
        const newItems = [...orderItems]
        newItems[rowIndex] = {
            ...newItems[rowIndex],
            [field]: value,
        }

        if (field === "productName" && product) {
            newItems[rowIndex] = {
                ...newItems[rowIndex],
                productName: product.name,
                productId: product.id,
                basePrice: product.salePrice || 0,
                selectedPieces: product?.typeOfPieces.slice(0, 3).map((p) => p._id),
                pieces: product?.typeOfPieces.slice(0, 3).length || 0,
            }
            setTypeOfPiecesRow(product?.typeOfPieces)
        }

        // Actualizar precio base y final si cambia el tipo de tapete o material
        if (field === "matType" || field === "materialType" || field === "quantity") {
            const item = newItems[rowIndex]

            handleGetAdjustedPriceFromBasePrice(item.basePrice, item.matType, item.materialType, item.quantity, selectedClient?.typeCustomerId)
                .then(data => {
                    console.log(data);

                    let adjustedPrice = data;
                    let finalPrice = adjustedPrice * item.quantity;

                    // Asegurarse de volver a copiar y actualizar
                    const updatedItems = [...newItems];
                    updatedItems[rowIndex] = {
                        ...updatedItems[rowIndex],
                        adjustedPrice: adjustedPrice,
                        finalPrice: finalPrice,
                    };

                    setOrderItems(updatedItems);
                });

            return;
        }
        if (isEditMode && onUpdateItem) {
            // En modo edición, notificar al componente padre
            onUpdateItem(rowIndex, newItems[rowIndex])
        } else {
            // En modo creación, manejar internamente
            setOrderItems(newItems)
        }
    }

    const handleOnChangeBasePrice = (rowIndex, value) => {
        const newItems = [...orderItems];
        const item = newItems[rowIndex];

        handleGetAdjustedPriceFromBasePrice(value, item.matType, item.materialType, item.quantity, selectedClient?.typeCustomerId)
            .then(data => {
                let adjustedPrice = data;
                let finalPrice = adjustedPrice * item.quantity;

                // Asegurarse de volver a copiar y actualizar
                const updatedItems = [...newItems];
                updatedItems[rowIndex] = {
                    ...updatedItems[rowIndex],
                    adjustedPrice: adjustedPrice,
                    finalPrice: finalPrice,
                };

                setOrderItems(updatedItems); // ✅ Actualizamos después del cálculo
                setEditingCell(null);
            });

        return;
    }

    // Abrir modal de piezas para una fila específica
    const openPiecesModal = (rowIndex) => {
        setEditingRowIndex(rowIndex)
        setSelectedPiecesTemp([...orderItems[rowIndex].selectedPieces])
        setPiecesModalOpen(true)
    }

    // Guardar selección de piezas
    const savePiecesSelection = () => {
        if (editingRowIndex !== null) {
            const updatedItem = {
                ...orderItems[editingRowIndex],
                selectedPieces: selectedPiecesTemp,
                pieces: selectedPiecesTemp.length,
            }

            if (isEditMode && onUpdateItem) {
                // En modo edición, notificar al componente padre
                onUpdateItem(editingRowIndex, updatedItem)
            } else {
                // En modo creación, manejar internamente
                const newItems = [...orderItems]
                newItems[editingRowIndex] = updatedItem
                setOrderItems(newItems)
            }

            setPiecesModalOpen(false)
            setEditingRowIndex(null)
        }
    }

    // Manejar selección/deselección de piezas
    const handlePieceToggle = (pieceId) => {
        if (selectedPiecesTemp.includes(pieceId)) {
            setSelectedPiecesTemp(selectedPiecesTemp.filter((id) => id !== pieceId))
        } else {
            setSelectedPiecesTemp([...selectedPiecesTemp, pieceId])
        }
    }

    // Seleccionar/deseleccionar todas las piezas
    const handleSelectAllPieces = () => {
        if (selectedPiecesTemp.length === typeOfPiecesRow.length) {
            setSelectedPiecesTemp([])
        } else {
            setSelectedPiecesTemp(typeOfPiecesRow.map((pieza) => pieza.id))
        }
    }

    // Obtener texto de piezas seleccionadas
    const getSelectedPiecesText = (selectedPieces) => {
        if (!selectedPieces || selectedPieces.length === 0) {
            return "Ninguna pieza seleccionada"
        }

        const selectedNames = selectedPieces
            .map((id) => {
                const pieza = typeOfPiecesRow.find((p) => p._id === id)
                return pieza ? pieza.name : ""
            })
            .filter(Boolean)

        return selectedNames.join(", ")
    }

    // Funciones para el modal de cliente
    const toggleClientModal = () => {
        setClientModalOpen(!clientModalOpen)
        if (!clientModalOpen) {
            setFilteredClients(clients)
            setClientSearchTerm("")
        }
    }

    const handleClientSearch = (e) => {
        const searchTerm = e.target.value
        setClientSearchTerm(searchTerm)

        if (searchTerm.trim() === "") {
            setFilteredClients(clients)
        } else {
            const filtered = clients.filter(
                (client) => {
                    console.log(client);
                    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (client.documento && client.documento.includes(searchTerm)) ||
                        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
                },
            )
            setFilteredClients(filtered)
        }
    }

    const handleSelectClient = (client) => {
        onClientSelect(client)
        toggleClientModal();
    }

    const clearProductSelection = (rowIndex) => {
        setProductSearchTerm("")
        const newItems = [...orderItems];
        newItems[rowIndex] = {
            ...newItems[rowIndex],
            productName: "",
            productId: "",
            basePrice: 0,
            adjustedPrice: 0,
        }
        setOrderItems(newItems);
        setProductSelected(null);
    }

    // Funciones para búsqueda de productos
    useEffect(() => {
        if (productSearchTerm) {
            setFilteredProducts(products.filter((product) => product?.name.toLowerCase().includes(productSearchTerm.toLowerCase())));
        } else {
            setFilteredProducts(products)
        }
    }, [productSearchTerm])

    // Abrir modal de observaciones
    const openObservationsModal = (rowIndex) => {
        setEditingRowIndex(rowIndex)
        setCurrentObservations(orderItems[rowIndex].observations)
        setObservationsModalOpen(true)
    }

    // Guardar observaciones
    const saveObservations = () => {
        if (editingRowIndex !== null) {
            const updatedItem = {
                ...orderItems[editingRowIndex],
                observations: currentObservations,
            }

            if (isEditMode && onUpdateItem) {
                // En modo edición, notificar al componente padre
                onUpdateItem(editingRowIndex, updatedItem)
            } else {
                // En modo creación, manejar internamente
                const newItems = [...orderItems]
                newItems[editingRowIndex] = updatedItem
                setOrderItems(newItems)
            }

            setObservationsModalOpen(false)
            setEditingRowIndex(null)
        }
    }

    // Calcular total del pedido
    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.adjustedPrice || 0), 0)
    };

    // Funciones para selección de filas
    const toggleRowSelection = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index))
        } else {
            setSelectedRows([...selectedRows, index])
        }
    }

    const toggleSelectAllRows = () => {
        if (selectedRows.length === orderItems.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(orderItems.map((_, index) => index))
        }
    }

    const openBulkEditModal = () => {
        setBulkEditData({
            matType: "",
            materialType: "",
        })
        setBulkEditModalOpen(true)
    }

    const handleBulkEditChange = (field, value) => {
        setBulkEditData({
            ...bulkEditData,
            [field]: value,
        })
    }

    const applyBulkEdit = () => {
        const newItems = [...orderItems]

        selectedRows.forEach((rowIndex) => {
            if (bulkEditData.matType) {
                newItems[rowIndex].matType = bulkEditData.matType
            }

            if (bulkEditData.materialType) {
                newItems[rowIndex].materialType = bulkEditData.materialType
            }

            if (bulkEditData.quantity) {
                newItems[rowIndex].quantity = bulkEditData.quantity
            }

            // Recalcular precio base y final
            if (bulkEditData.matType || bulkEditData.materialType || bulkEditData.quantity) {

                if (newItems[rowIndex].matType == "" ||
                    newItems[rowIndex].matType == "Selecciona una opción" ||
                    newItems[rowIndex].materialType == "" ||
                    newItems[rowIndex].materialType == "Selecciona una opción" ||
                    newItems[rowIndex].quantity == 0) {
                    setBulkEditModalOpen(false);
                    return;
                }

                handleGetAdjustedPrice(
                    newItems[rowIndex].productId,
                    newItems[rowIndex].matType,
                    newItems[rowIndex].materialType,
                    newItems[rowIndex].quantity,
                    selectedClient?.typeCustomerId
                )
                    .then(data => {
                        let adjustedPrice = data;
                        newItems[rowIndex].adjustedPrice = adjustedPrice;
                        newItems[rowIndex].finalPrice = adjustedPrice;

                        if (isEditMode && onUpdateItem) {
                            // En modo edición, notificar al componente padre para cada fila modificada
                            selectedRows.forEach((rowIndex) => {
                                onUpdateItem(rowIndex, newItems[rowIndex])
                            })
                        } else {
                            // En modo creación, manejar internamente
                            setOrderItems(newItems);
                            setBulkEditModalOpen(false);
                        }
                    });
            }
        })
    }

    //Limpiar los datos de la tabla y dejar una fila en blanco
    const handleCleanTable = () => {
        setOrderItems([]);
        setProductSelected(null);
        setEditingRowIndex(null);
    }

    const handleSelectZone = (zoneId) => {
        setSelectedZoneId(zoneId);
    }

    const handleOpenAssignModal = async () => {
        setAsignacionModalOpen(true);
    }

    //crear un nuevo pedido
    const handleSubmit = async () => {
        setMesssageAlert('');
        setTypeModal('');
        setIsOpenModal(false);
        try {
            let payload = {
                clientId: selectedClient._id,
                itemsQuantity: orderItems.length,
                totalOrder: calculateTotal(),
                tax: 0,
                discount: 0,
                status: selectedZoneId ? purchaseOrderStatus.asignado : purchaseOrderStatus.libre,
                details: orderItems.map((item) => {
                    return {
                        matType: item.matType,
                        materialType: item.materialType,
                        productId: item.productId,
                        pieces: item.pieces,
                        piecesNames: item.selectedPieces.map((p) => {
                            return typeOfPiecesRow.find((t) => t._id === p)?.name;
                        }),
                        priceItem: item.adjustedPrice / item.quantity,
                        quantityItem: item.quantity,
                        totalItem: item.adjustedPrice,
                        observations: item.observations,
                    }
                }),
                createdBy: localStorage.getItem("userId"),
                zoneId: selectedZoneId,
                methodOfPayment: paymentMethods.map((m) => {
                    return {
                        accountId: m.cuenta,
                        paymentDate: m.fecha,
                        value: m.valor,
                        paymentSupport: m.soporte,
                        typeOperation: "ventas"
                    }
                }),
            }
            const validation = validatePayload(payload);

            if (!validation.valid) {
                setRowError({ rowIndex: validation.rowIndex, message: validation.message });

                if (typeof validation.rowIndex === "number" && rowRefs.current[validation.rowIndex]) {
                    rowRefs.current[validation.rowIndex].scrollIntoView({ behavior: "smooth", block: "center" });
                    rowRefs.current[validation.rowIndex].classList.add("border", "border-danger");

                    setTimeout(() => {
                        rowRefs.current[validation.rowIndex]?.classList.remove("border", "border-danger");
                    }, 3000);
                }

                // Auto-limpiar mensaje de error a los 5 segundos
                setTimeout(() => {
                    setRowError({ rowIndex: null, message: "" });
                }, 5000);

                return;
            }

            setRowError({ rowIndex: null, message: "" }); // limpiar errores anteriores

            let response = await fetch(CREATE_PURCHASE_ORDER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (response && response.status === 201) {
                let data = await response.json();
                handleCleanTable();
                setMesssageAlert(data?.message);
                setTypeModal('success');
                setIsOpenModal(true);
                setSelectedRows([]);
                setEditingRowIndex(null);
                setSelectedZoneId(null);
            }
        } catch (error) {
            console.log(error);
            setMesssageAlert('Ocurrió un error :(, intenta más tarde.');
            setTypeModal('danger');
            setIsOpenModal(true);
        }
    }

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    }

    useEffect(() => {
        addNewRow();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            return purchaseOrderHelper.handleKeyDown(e, createEmptyRow, setOrderItems);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Agregar nueva forma de pago
    const addPaymentMethod = () => {
        setPaymentMethods([...paymentMethods, createEmptyPaymentMethod()])
    }

    // Eliminar forma de pago
    const removePaymentMethod = (index) => {
        const newMethods = [...paymentMethods]
        newMethods.splice(index, 1)
        setPaymentMethods(newMethods)
    }

    // Actualizar forma de pago
    const updatePaymentMethod = (index, field, value) => {
        const newMethods = [...paymentMethods]
        newMethods[index] = {
            ...newMethods[index],
            [field]: value,
        }
        setPaymentMethods(newMethods)
    }

    // Manejar carga de archivos
    const handleFileUpload = async (index, file) => {
        if (file) {
            let formData = new FormData();
            formData.append("file", file);
            let token = getToken();
            let response = await fetch(`${BASE_URL}${UPLOAD_FILE}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            let data = await response.json();
            let url = data?.url;
            if (url) {
                url = `${BASE_URL}${url}`;
            }
            const newMethods = [...paymentMethods]
            newMethods[index] = {
                ...newMethods[index],
                soporte: url,
            }
            setPaymentMethods(newMethods)
        }
    }

    // Calcular total de pagos (actualizar para usar 'valor' en lugar de 'monto')
    const calculateTotalPayments = () => {
        return paymentMethods.reduce((total, method) => total + (method.valor || 0), 0)
    }


    return (
        <>
            {
                isOpenModal && (
                    < ToastComponent
                        text={messsageAlert}
                        duration={4000}
                        gravity="top"
                        position="right"
                        stopOnFocus={true}
                        close={true}
                        className={typeModal === 'success' ? "toastify-success" : "toastify-danger"}
                        style={typeModal === 'success' ? { background: "linear-gradient(to right, #00b09b, #96c93d)" } : { background: "linear-gradient(to right, #e55353, #f06595)" }}
                    />
                )
            }

            {/* Modal de Selección de Cliente */}
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
                        {(filteredClients && filteredClients.length > 0) ? (
                            filteredClients.map((client) => (
                                <div
                                    key={client.id}
                                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                                    onClick={() => handleSelectClient(client)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="fw-medium">{client.name}</div>
                                    {client.company && <div className="small text-muted">{client.company} - {client.documento}</div>}
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

            {/* Modal de Selección de Piezas */}
            <Modal isOpen={piecesModalOpen} toggle={() => setPiecesModalOpen(false)}>
                <ModalHeader toggle={() => setPiecesModalOpen(false)}>Seleccionar Piezas</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <Button color="secondary" outline size="sm" onClick={handleSelectAllPieces} className="w-100">
                            {selectedPiecesTemp.length === typeOfPiecesRow.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
                        </Button>
                    </div>
                    <ListGroup>
                        {typeOfPiecesRow.map((pieza) => (
                            <ListGroupItem
                                key={pieza._id}
                                action
                                active={selectedPiecesTemp.includes(pieza._id)}
                                onClick={() => handlePieceToggle(pieza._id)}
                                className="d-flex justify-content-between align-items-center"
                            >
                                {pieza?.name}
                                {selectedPiecesTemp.includes(pieza?._id) && <Check size={18} />}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    <div className="mt-3 text-center">
                        <FormText>
                            Piezas seleccionadas: {selectedPiecesTemp.length} de {typeOfPiecesRow.length}
                        </FormText>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setPiecesModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={savePiecesSelection}>
                        Guardar Selección
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal de Observaciones */}
            <Modal isOpen={observationsModalOpen} toggle={() => setObservationsModalOpen(false)}>
                <ModalHeader toggle={() => setObservationsModalOpen(false)}>Observaciones del Cliente</ModalHeader>
                <ModalBody>
                    <Input
                        type="textarea"
                        rows={5}
                        value={currentObservations}
                        onChange={(e) => setCurrentObservations(e.target.value)}
                        placeholder="Añadir observaciones o especificaciones..."
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setObservationsModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={saveObservations}>
                        Guardar
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal de Edición Masiva */}
            <Modal isOpen={bulkEditModalOpen} toggle={() => setBulkEditModalOpen(false)}>
                <ModalHeader toggle={() => setBulkEditModalOpen(false)}>
                    Editar {selectedRows.length} productos seleccionados
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="bulkMatType" className="fw-medium">
                            Tipo de Tapete
                        </Label>
                        <Input
                            type="select"
                            id="bulkMatType"
                            value={bulkEditData.matType}
                            onChange={(e) => {
                                handleBulkEditChange("matType", e.target.value);
                                purchaseOrderHelper.filterMaterialByMat(e.target.value, setFilteredMaterialTypes, matMaterialPrices);
                            }}
                        >
                            <option value="">-- Sin cambios --</option>
                            {(matTypeOptions ?? []).map((mat, idx) => (
                                <option key={idx} value={mat}>
                                    {mat}
                                </option>
                            ))}
                        </Input>
                        <FormText>Deje en blanco para mantener los valores actuales.</FormText>
                    </FormGroup>

                    <FormGroup>
                        <Label for="bulkMaterialType" className="fw-medium">
                            Tipo de Material
                        </Label>
                        <Input
                            type="select"
                            id="bulkMaterialType"
                            value={bulkEditData.materialType}
                            onChange={(e) => handleBulkEditChange("materialType", e.target.value)}
                        >
                            <option value="">-- Sin cambios --</option>
                            {(filteredMaterialTypes ?? []).map((matType, idx) => (
                                <option key={idx} value={matType}>
                                    {matType}
                                </option>
                            ))}
                        </Input>
                        <FormText>Deje en blanco para mantener los valores actuales.</FormText>
                    </FormGroup>

                    <FormGroup>
                        <Label for="bulkQuantity" className="fw-medium">
                            Cantidad
                        </Label>
                        <Input
                            id="bulkQuantity"
                            type="number"
                            min="1"
                            value={bulkEditData.quantity}
                            onChange={(e) => handleBulkEditChange("quantity", e.target.value)}
                            autoFocus
                        />
                        <FormText>Deje en blanco para mantener los valores actuales.</FormText>
                    </FormGroup>


                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setBulkEditModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={applyBulkEdit}>
                        Aplicar Cambios
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal de Asignación */}
            <AssignModal
                isOpen={asignacionModalOpen}
                toggle={() => setAsignacionModalOpen(false)}
                zones={zones}
                onSelectZone={handleSelectZone}
                selectedZoneId={selectedZoneId}
            />

            {/* Botones de Acción */}
            <div className="d-flex gap-2 mb-4">
                <Button color="secondary" onClick={toggleClientModal} className="d-flex align-items-center gap-2">
                    <User size={18} />
                    {selectedClient ? "Cambiar Cliente" : "Seleccionar Cliente"}
                </Button>

                {/* <Button
                    color="primary"
                    onClick={addNewRow}
                    className="d-flex align-items-center gap-2"
                    disabled={!selectedClient}
                >
                    <PlusCircle size={18} />
                    Añadir Producto
                </Button> */}

                <Button
                    color="light"
                    onClick={handleOpenAssignModal}
                    className="d-flex align-items-center gap-2"
                    disabled={!selectedClient}
                >
                    <CheckCircle size={18} />
                    Asignar Pedido
                </Button>

                {selectedRows.length > 0 && (
                    <Button color="info" onClick={openBulkEditModal} className="d-flex align-items-center gap-2 ms-auto">
                        <Edit size={18} />
                        Editar {selectedRows.length} seleccionados
                    </Button>
                )}
            </div>

            <div>

                {/* Datos del cliente */}
                <CollapsibleSection
                    id="customer"
                    title="Datos del Cliente"
                    icon={User}
                    isOpen={openSections.customer}
                    onToggle={toggleSection}
                >
                    <div className="p-3 rounded shadow-sm mb-4">
                        <Row>
                            <Col md={6}>
                                <div>
                                    <span className="fw-medium">Cliente: </span>
                                    <span>{selectedClient?.name ?? "Sin seleccionar"}</span>
                                    {selectedClient?.company && <span className="ms-2 text-muted">({selectedClient?.company})</span>}
                                </div>
                            </Col>
                            <Col md={6} className="mb-2">
                                <div className="d-flex align-items-center">
                                    <span className="fw-medium me-2">Contacto: </span>
                                    <div className="p-1 w-100 cursor-pointer"
                                        onClick={() => setEditingContact(true)}>
                                        {
                                            editingContact ? (
                                                <Input
                                                    style={{
                                                        border: 'none !important',
                                                        borderBottom: '2px solid #ccc !important',
                                                        backgroundColor: 'transparent',
                                                        color: '#132649',
                                                        '&:focus': { border: 'none', boxShadow: 'none' },
                                                        fontSize: '1em',
                                                        padding: '3px',
                                                    }}
                                                    bsSize="sm"
                                                    type="select"
                                                    id="contact"
                                                    name="contact"
                                                    value={selectedContact?.contactName}
                                                    onChange={(e) => {
                                                        handleSelectContact(selectedClient?.contacts?.find((c) => c.contactName === e.target.value));
                                                        setEditingContact(false);
                                                    }}
                                                    onBlur={() => setEditingContact(false)}
                                                    className="form-control"
                                                >
                                                    <option value="0">Seleccione el contacto</option>
                                                    {
                                                        selectedClient?.contacts?.map((contact, idx) => {
                                                            return (<option key={idx} label={`${contact.contactName} ${contact.contactLastname}`} value={contact.contactName}></option>)
                                                        })
                                                    }
                                                </Input>
                                            ) :
                                                (
                                                    <span>{selectedContact ? `${selectedContact.contactName} ${selectedContact.contactLastname}` : "Sin seleccionar"}</span>
                                                )
                                        }
                                    </div>


                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6} className="mb-2">
                                <div>
                                    <span className="fw-medium">Categoría: </span>
                                    <span>{selectedClient?.typeCustomerName ?? "Sin seleccionar"}</span>
                                </div>
                            </Col>
                            <Col md={6} className="mb-2">
                                <div>
                                    <span className="fw-medium">Vendedor: </span>
                                    <span>{"Sin seleccionar"}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-2">
                                <div className="d-flex align-items-center">
                                    <span className="fw-medium" style={{ width: "17%" }}>Fecha de pedido: </span>
                                    <div className="p-1 w-80 cursor-pointer"
                                        onClick={() => setEditingDateOrder(true)}>
                                        {
                                            editingDateOrder ? (
                                                <Input
                                                    style={{
                                                        border: 'none !important',
                                                        borderBottom: '2px solid #ccc !important',
                                                        backgroundColor: 'transparent',
                                                        color: '#132649',
                                                        '&:focus': { border: 'none', boxShadow: 'none' },
                                                        fontSize: '1em',
                                                        padding: '3px',
                                                    }}
                                                    type="date"
                                                    value={orderDate}
                                                    onChange={(e) => {
                                                        setOrderDate(e.target.value);
                                                        setEditingDateOrder(false);
                                                    }}
                                                    onBlur={() => setEditingDateOrder(false)}
                                                    autoFocus
                                                />
                                            ) :
                                                (
                                                    <span>{orderDate ? moment(orderDate).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY")}</span>
                                                )
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-2">
                                <div className="d-flex align-items-center">
                                    <span className="fw-medium">Sede: </span>
                                    <div
                                        className="p-1 w-100 cursor-pointer"
                                        onClick={() => setEditingZone(true)}
                                    >
                                        {editingZone ? (
                                            <Input
                                                style={{
                                                    border: 'none !important',
                                                    borderBottom: '2px solid #ccc !important',
                                                    backgroundColor: 'transparent',
                                                    color: '#132649',
                                                    '&:focus': { border: 'none', boxShadow: 'none' },
                                                    fontSize: '1em',
                                                    padding: '3px',
                                                    marginLeft: "2px"
                                                }}
                                                type="select"
                                                value={selectedZoneId}
                                                onChange={(e) => {
                                                    handleSelectZone(e.target.value)
                                                    setEditingZone(false)
                                                }}
                                                onBlur={() => setEditingZone(false)}
                                                autoFocus
                                                className="form-control"
                                            >
                                                <option value="0">Selecciona una sede</option>
                                                {zones.map((zone) => (
                                                    <option key={zone._id} value={zone._id}>{zone.name}</option>
                                                ))}
                                            </Input>

                                        ) : (
                                            <span>{zones.find((z) => z._id === selectedZoneId)?.name ?? "Ninguna"}</span>
                                        )}
                                    </div>

                                </div>
                            </Col>
                        </Row>

                    </div>
                </CollapsibleSection >
            </div >


            {/* Datos del producto */}
            <CollapsibleSection
                id="products"
                title="Datos del pedido"
                icon={StoreIcon}
                isOpen={openSections.products}
                onToggle={toggleSection}
            >
                {
                    orderItems.length > 0 && (
                        <div className="table-responsive mb-4">
                            <Table bordered hover>
                                <thead>
                                    <tr className="text-center bg-light">
                                        <th style={{ width: "3%" }}>
                                            <div
                                                onClick={toggleSelectAllRows}
                                                style={{ cursor: "pointer" }}
                                                className="d-flex justify-content-center"
                                            >
                                                {selectedRows.length === orderItems.length && orderItems.length > 0 ? (
                                                    <CheckSquare size={18} />
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </div>
                                        </th>
                                        <th style={{ width: "25%" }}>Producto</th>
                                        <th style={{ width: "5%" }}>Piezas</th>
                                        <th style={{ width: "15%" }}>Tipo Tapete</th>
                                        <th style={{ width: "15%" }}>Material</th>
                                        <th style={{ width: "5%" }}>Cantidad</th>
                                        <th style={{ width: "10%" }}>Precio Unitario</th>
                                        <th style={{ width: "10%" }}>Precio Final</th>
                                        <th style={{ width: "7%" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody style={{ backgroundColor: "#faf9fb" }}>
                                    {orderItems.map((item, index) => (
                                        <Fragment key={index}>
                                            <tr
                                                key={index}
                                                ref={el => rowRefs.current[index] = el}
                                                className={selectedRows.includes(index) ? "row-selected-to-editing" : ""}
                                            >
                                                {/* Checkbox de selección */}
                                                <td className="text-center align-middle">
                                                    <div
                                                        onClick={() => toggleRowSelection(index)}
                                                        style={{ cursor: "pointer" }}
                                                        className="d-flex justify-content-center"
                                                    >
                                                        {selectedRows.includes(index) ? <CheckSquare size={18} /> : <Square size={18} />}
                                                    </div>
                                                </td>
                                                {/* Producto */}
                                                <td>
                                                    <div
                                                        className="p-1 cursor-pointer"
                                                        onClick={() => setEditingCell({ row: index, field: "productName" })}
                                                    >
                                                        {editingCell?.row === index && editingCell?.field === "productName" ? (
                                                            <div className="position-relative">
                                                                <InputGroup>
                                                                    <Input
                                                                        innerRef={inputRef}
                                                                        size={"sm"}
                                                                        type="text"
                                                                        value={productSearchTerm || item.productName}
                                                                        onChange={(e) => setProductSearchTerm(e.target.value)}
                                                                        onFocus={() => {
                                                                            setProductSearchTerm("")
                                                                        }}
                                                                        onBlur={() => {
                                                                            setTimeout(() => {
                                                                                setEditingCell(null)
                                                                                setProductSearchTerm("")
                                                                            }, 200)
                                                                        }}
                                                                        autoFocus
                                                                        autoComplete="off"
                                                                        required
                                                                        placeholder="Buscar producto..."
                                                                        className="form-control"
                                                                    />
                                                                    {(productSearchTerm || item.productName) && (
                                                                        <Button
                                                                            size="sm"
                                                                            color="secondary"
                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                            onClick={() => clearProductSelection(index)}
                                                                        >
                                                                            <X size={8} />
                                                                        </Button>
                                                                    )}
                                                                </InputGroup>

                                                                {productSearchTerm && inputRef.current && (
                                                                    <DropdownPortal
                                                                        targetRef={inputRef}
                                                                        onClickOutside={() => {
                                                                            setEditingCell(null);
                                                                            setProductSearchTerm("");
                                                                        }}
                                                                    >
                                                                        {filteredProducts.map((product, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="p-1 border-bottom"
                                                                                onClick={() => {
                                                                                    updateCellValue(index, "productName", product?.name, product);
                                                                                    setProductSearchTerm("");
                                                                                    setEditingCell(null);
                                                                                    setProductSelected(product);
                                                                                }}
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                {product?.name}
                                                                            </div>
                                                                        ))}
                                                                    </DropdownPortal>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            item.productName || <span className="text-muted">Seleccionar producto</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Piezas */}
                                                <td>
                                                    <div
                                                        className="p-1 cursor-pointer d-flex justify-content-between align-items-center"
                                                        onClick={() => openPiecesModal(index)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <span>{item.pieces}</span>
                                                        <Button color="link" size="sm" className="p-0">
                                                            <Edit2 size={14} />
                                                        </Button>
                                                    </div>
                                                    {/*   <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                                                {getSelectedPiecesText(item.selectedPieces)}
                                            </small> */}
                                                </td>

                                                {/* Tipo Tapete */}
                                                <td>
                                                    <div
                                                        className="p-1"
                                                        onClick={() => setEditingCell({ row: index, field: "matType" })}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {editingCell?.row === index && editingCell?.field === "matType" ? (
                                                            <Input
                                                                type="select"
                                                                value={item.matType}
                                                                onChange={(e) => {
                                                                    updateCellValue(index, "matType", e.target.value)
                                                                    setEditingCell(null);
                                                                    purchaseOrderHelper.filterMaterialByMat(e.target.value, setFilteredMaterialTypes, matMaterialPrices);
                                                                }}
                                                                onBlur={() => setEditingCell(null)}
                                                                autoFocus
                                                            >
                                                                <option value="0">Selecciona una opción</option>
                                                                {matTypeOptions.map((mat, idx) => (
                                                                    <option key={idx} value={mat}>
                                                                        {mat}
                                                                    </option>
                                                                ))}
                                                            </Input>

                                                        ) : (
                                                            item.matType
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Material */}
                                                <td>
                                                    <div
                                                        className="p-1"
                                                        onClick={() => setEditingCell({ row: index, field: "materialType" })}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {editingCell?.row === index && editingCell?.field === "materialType" ? (
                                                            <Input
                                                                type="select"
                                                                value={item.materialType}
                                                                onChange={(e) => {
                                                                    updateCellValue(index, "materialType", e.target.value)
                                                                    setEditingCell(null)
                                                                }}
                                                                onBlur={() => setEditingCell(null)}
                                                                autoFocus
                                                            >
                                                                <option value="0">Selecciona una opción</option>
                                                                {filteredMaterialTypes.map((matType, index) => (
                                                                    <option key={index} value={matType}>
                                                                        {matType}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                        ) : (
                                                            item.materialType
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Cantidad */}
                                                <td>
                                                    <div
                                                        className="p-1"
                                                        onClick={() => setEditingCell({ row: index, field: "quantity" })}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {editingCell?.row === index && editingCell?.field === "quantity" ? (
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    updateCellValue(index, "quantity", Number.parseInt(e.target.value) || 1)
                                                                }}
                                                                onBlur={() => setEditingCell(null)}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Precio Base */}
                                                <td className="text-end">
                                                    {/*  <div className="p-2">${item.basePrice?.toLocaleString()}</div> */}
                                                    <div
                                                        className="p-1"
                                                        onClick={() => setEditingCell({ row: index, field: "basePrice" })}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {editingCell?.row === index && editingCell?.field === "basePrice" ? (
                                                            <Input
                                                                type="number"
                                                                value={item.basePrice}
                                                                onChange={(e) => {
                                                                    updateCellValue(index, "basePrice", Number.parseInt(e.target.value) || 1)
                                                                }}
                                                                onBlur={() => handleOnChangeBasePrice(index, item.basePrice)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        handleOnChangeBasePrice(index, item.basePrice);
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <div>${item.basePrice?.toLocaleString()}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* Precio ajustado */}
                                                <td className="text-end">
                                                    <div className="p-1 fw-bold">${item.adjustedPrice?.toLocaleString()}</div>
                                                </td>

                                                {/* Acciones */}
                                                <td>
                                                    <div className="d-flex justify-content-center gap-1">
                                                        <Button
                                                            color="link"
                                                            className="p-1 text-primary"
                                                            onClick={() => openObservationsModal(index)}
                                                            title="Observaciones"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button
                                                            color="link"
                                                            className="p-1 text-danger"
                                                            onClick={() => removeRow(index)}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {rowError.rowIndex === index && (
                                                <tr>
                                                    <td colSpan={10} className="text-danger p-1 bg-light border-bottom">
                                                        <div className="inline-error">{rowError.message}</div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        /* ) : (
                           selectedClient && (
                               <Alert color="info" className="text-center">
                                   No hay productos en el pedido. Haga clic en "Añadir Producto" para comenzar.
                               </Alert>
                           ) */
                    )
                }

            </CollapsibleSection>

            <CollapsibleSection id="methodOfPayment" title="Formas de pago" icon={CreditCard} isOpen={openSections.methodOfPayment} onToggle={toggleSection}>
                <Row>
                    <Col md={12}>
                        {orderItems.length > 0 && (
                            <div className="bg-light p-4 rounded shadow-sm mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="h5 fw-semibold mb-0">Formas de Pago</h2>
                                    <Button color="primary" size="sm" onClick={addPaymentMethod} className="d-flex align-items-center gap-2">
                                        <PlusCircle size={16} />
                                        Agregar Pago
                                    </Button>
                                </div>

                                {paymentMethods.length > 0 ? (
                                    <div className="table-responsive mb-3">
                                        <Table bordered hover size="sm">
                                            <thead>
                                                <tr className="bg-white">
                                                    <th style={{ width: "25%" }}>Cuenta</th>
                                                    <th style={{ width: "20%" }}>Fecha</th>
                                                    <th style={{ width: "20%" }}>Valor</th>
                                                    <th style={{ width: "25%" }}>Soporte</th>
                                                    <th style={{ width: "10%" }} className="text-center">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paymentMethods.map((method, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <Input
                                                                type="select"
                                                                value={method.cuenta}
                                                                onChange={(e) => updatePaymentMethod(index, "cuenta", e.target.value)}
                                                                size="sm"
                                                            >
                                                                <option value="">Seleccionar cuenta...</option>
                                                                {accountList.map((cuenta, idx) => (
                                                                    <option key={idx} value={cuenta?._id}>
                                                                        {cuenta?.name}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="date"
                                                                value={method.fecha}
                                                                onChange={(e) => updatePaymentMethod(index, "fecha", e.target.value)}
                                                                size="sm"
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="1000"
                                                                value={method.valor}
                                                                onChange={(e) => updatePaymentMethod(index, "valor", Number(e.target.value) || 0)}
                                                                placeholder="$0"
                                                                size="sm"
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                                                    size="sm"
                                                                    style={{ display: "none" }}
                                                                    id={`file-input-${index}`}
                                                                />
                                                                <Button
                                                                    color="outline-secondary"
                                                                    size="sm"
                                                                    onClick={() => document.getElementById(`file-input-${index}`).click()}
                                                                    className="d-flex align-items-center gap-1"
                                                                >
                                                                    <PlusCircle size={14} />
                                                                    {method.soporte ? "Cambiar" : "Subir"}
                                                                </Button>
                                                                {method.soporte && (
                                                                    <div className="d-flex align-items-center gap-1">
                                                                        <span className="small text-success">✓ Archivo</span>
                                                                        <Button
                                                                            color="link"
                                                                            size="sm"
                                                                            className="p-0 text-danger"
                                                                            onClick={() => updatePaymentMethod(index, "soporte", null)}
                                                                            title="Eliminar archivo"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <Button
                                                                color="link"
                                                                className="p-1 text-danger"
                                                                onClick={() => removePaymentMethod(index)}
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="table-group-divider">
                                                <tr>
                                                    <td colSpan="2" className="text-end fw-bold">
                                                        Total Pagado:
                                                    </td>
                                                    <td className="fw-bold">${calculateTotalPayments().toLocaleString()}</td>
                                                    <td colSpan="2"></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="2" className="text-end fw-bold">
                                                        Saldo Pendiente:
                                                    </td>
                                                    <td
                                                        className={`fw-bold ${(calculateTotal() - calculateTotalPayments()) > 0 ? "text-danger" : "text-success"}`}
                                                    >
                                                        ${(calculateTotal() - calculateTotalPayments()).toLocaleString()}
                                                    </td>
                                                    <td colSpan="2"></td>
                                                </tr>
                                            </tfoot>
                                        </Table>
                                    </div>
                                ) : (
                                    <Alert color="info" className="text-center mb-3">
                                        No hay formas de pago registradas. Haga clic en "Agregar Pago" para comenzar.
                                    </Alert>
                                )}
                            </div>
                        )}
                    </Col>
                </Row>
            </CollapsibleSection >

            {/* Total del Pedido */}
            {
                orderItems.length > 0 && !isEditMode && (
                    <div className="bg-light p-3 rounded shadow-sm mb-4" style={{ position: "sticky", bottom: '25px', height: '110px' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="h5 fw-semibold mb-0">Total del Pedido:</h2>
                            <span className="h4 fw-bold mb-0">${calculateTotal().toLocaleString()}</span>
                        </div>

                        <div className="mt-3 d-flex justify-content-between">
                            <div>

                            </div>

                            <Button
                                color="success"
                                className="d-flex align-items-center gap-2"
                                onClick={handleSubmit}
                            >
                                <Save size={18} />
                                Finalizar Pedido
                            </Button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

