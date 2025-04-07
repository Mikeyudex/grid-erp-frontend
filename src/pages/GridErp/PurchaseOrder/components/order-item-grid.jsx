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
} from "reactstrap"
import { PlusCircle, Trash2, Edit2, User, Search, Check, Save, X } from "lucide-react"
import { ProductHelper } from "../../Products/helper/product_helper"
import DropdownPortal from "./DropdownPortal"
import { CREATE_PURCHASE_ORDER } from "../../Products/helper/url_helper"
import { validatePayload } from "../utils/purchase-order.utils";
import "./index.css";


const productHelper = new ProductHelper()

export default function OrderGrid({
    selectedClient,
    onClientSelect,
    clients,
    products,
    typeOfPieces,
    matMaterialPrices,
    matTypeOptions,
    materialTypeOptions
}) {
    const [orderItems, setOrderItems] = useState([])
    const [clientModalOpen, setClientModalOpen] = useState(false)
    const [clientSearchTerm, setClientSearchTerm] = useState("")
    const [filteredClients, setFilteredClients] = useState(clients)

    // Estado para el modal de piezas
    const [piecesModalOpen, setPiecesModalOpen] = useState(false)
    const [selectedPiecesTemp, setSelectedPiecesTemp] = useState([])
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

    // Crear una nueva fila vacía
    const createEmptyRow = () => {
        return {
            productName: "",
            productId: "",
            pieces: typeOfPieces.slice(0, 3).length || 0,
            selectedPieces: typeOfPieces.slice(0, 3).map((p) => p._id) || [],
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
        if (!selectedClient) {
            alert("Por favor, seleccione un cliente primero")
            return
        }
        setOrderItems([...orderItems, createEmptyRow()])
        setProductSelected(null);
    }

    // Eliminar una fila
    const removeRow = (index) => {
        const newItems = [...orderItems]
        newItems.splice(index, 1)
        setOrderItems(newItems)
    }

    const handleGetAdjustedPrice = async (productId, matType, materialType, quantity) => {
        try {
            if (!productId || !matType || !materialType || !quantity) {
                return 0;
            }
            const response = await productHelper.calcularPrecioFinalProducto(productId, matType, materialType, quantity);
            if (response?.statusCode === 200) {
                return response.data?.precioFinal || 0;
            }
            return 0;
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
            }
        }

        // Actualizar precio base y final si cambia el tipo de tapete o material
        if (field === "matType" || field === "materialType" || field === "quantity") {
            const item = newItems[rowIndex]

            handleGetAdjustedPrice(productSelected?.id, item.matType, item.materialType, item.quantity)
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
                });

            return;
        }

        setOrderItems(newItems)
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
            const newItems = [...orderItems]
            newItems[editingRowIndex] = {
                ...newItems[editingRowIndex],
                selectedPieces: selectedPiecesTemp,
                pieces: selectedPiecesTemp.length,
            }
            setOrderItems(newItems)
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
        if (selectedPiecesTemp.length === typeOfPieces.length) {
            setSelectedPiecesTemp([])
        } else {
            setSelectedPiecesTemp(typeOfPieces.map((pieza) => pieza.id))
        }
    }

    // Obtener texto de piezas seleccionadas
    const getSelectedPiecesText = (selectedPieces) => {
        if (!selectedPieces || selectedPieces.length === 0) {
            return "Ninguna pieza seleccionada"
        }

        const selectedNames = selectedPieces
            .map((id) => {
                const pieza = typeOfPieces.find((p) => p._id === id)
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
            const newItems = [...orderItems]
            newItems[editingRowIndex] = {
                ...newItems[editingRowIndex],
                observations: currentObservations,
            }
            setOrderItems(newItems)
            setObservationsModalOpen(false)
            setEditingRowIndex(null)
        }
    }

    // Calcular total del pedido
    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.adjustedPrice || 0), 0)
    }

    //Limpiar los datos de la tabla y dejar una fila en blanco
    const handleCleanTable = () => {
        setOrderItems([]);
        setProductSelected(null);
        setEditingRowIndex(null);
    }

    //crear un nuevo pedido
    const handleSubmit = async () => {
        try {
            let payload = {
                clientId: selectedClient._id,
                itemsQuantity: orderItems.length,
                totalOrder: calculateTotal(),
                tax: 0,
                discount: 0,
                status: "pendiente",
                details: orderItems.map((item) => {
                    return {
                        matType: item.matType,
                        materialType: item.materialType,
                        productId: item.productId,
                        pieces: item.pieces,
                        piecesNames: item.selectedPieces.map((p) => {
                            return typeOfPieces.find((t) => t._id === p)?.name;
                        }),
                        priceItem: item.adjustedPrice / item.quantity,
                        quantityItem: item.quantity,
                        totalItem: item.adjustedPrice,
                        observations: item.observations,
                    }
                }),
                createdBy: "66d4ed2f825f2d54204555c1"
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

            setRowError({ rowIndex: null, message: "" }); // ✅ limpiamos errores anteriores

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
                alert(data?.message);
            }
        } catch (error) {
            console.log(error);
            alert("Ocurrió un error :(, intenta más tarde.");
        }
    }

    return (
        <>
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

            {/* Modal de Selección de Piezas */}
            <Modal isOpen={piecesModalOpen} toggle={() => setPiecesModalOpen(false)}>
                <ModalHeader toggle={() => setPiecesModalOpen(false)}>Seleccionar Piezas</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <Button color="secondary" outline size="sm" onClick={handleSelectAllPieces} className="w-100">
                            {selectedPiecesTemp.length === typeOfPieces.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
                        </Button>
                    </div>
                    <ListGroup>
                        {typeOfPieces.map((pieza) => (
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
                            Piezas seleccionadas: {selectedPiecesTemp.length} de {typeOfPieces.length}
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

            {/* Botones de Acción */}
            <div className="d-flex gap-2 mb-4">
                <Button color="secondary" onClick={toggleClientModal} className="d-flex align-items-center gap-2">
                    <User size={18} />
                    {selectedClient ? "Cambiar Cliente" : "Seleccionar Cliente"}
                </Button>

                <Button
                    color="primary"
                    onClick={addNewRow}
                    className="d-flex align-items-center gap-2"
                    disabled={!selectedClient}
                >
                    <PlusCircle size={18} />
                    Añadir Producto
                </Button>
            </div>

            {/* Tabla de Productos */}
            {orderItems.length > 0 ? (
                <div className="table-responsive mb-4">
                    <Table bordered hover>
                        <thead>
                            <tr className="text-center bg-light">
                                <th style={{ width: "25%" }}>Producto</th>
                                <th style={{ width: "20%" }}>Piezas</th>
                                <th style={{ width: "15%" }}>Tipo Tapete</th>
                                <th style={{ width: "15%" }}>Material</th>
                                <th style={{ width: "8%" }}>Cantidad</th>
                                {/*  <th style={{ width: "10%" }}>Precio Base</th> */}
                                <th style={{ width: "10%" }}>Precio</th>
                                <th style={{ width: "7%" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: "#faf9fb" }}>
                            {orderItems.map((item, index) => (
                                <Fragment key={index}>
                                    <tr key={index} ref={el => rowRefs.current[index] = el}>
                                        {/* Producto */}
                                        <td>
                                            <div
                                                className="p-2 cursor-pointer"
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
                                                                        className="p-2 border-bottom"
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
                                                className="p-2 cursor-pointer d-flex justify-content-between align-items-center"
                                                onClick={() => openPiecesModal(index)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <span>{item.pieces}</span>
                                                <Button color="link" size="sm" className="p-0">
                                                    <Edit2 size={14} />
                                                </Button>
                                            </div>
                                            <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                                                {getSelectedPiecesText(item.selectedPieces)}
                                            </small>
                                        </td>

                                        {/* Tipo Tapete */}
                                        <td>
                                            <div
                                                className="p-2"
                                                onClick={() => setEditingCell({ row: index, field: "matType" })}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {editingCell?.row === index && editingCell?.field === "matType" ? (
                                                    <Input
                                                        type="select"
                                                        value={item.matType}
                                                        onChange={(e) => {
                                                            updateCellValue(index, "matType", e.target.value)
                                                            setEditingCell(null)
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
                                                className="p-2"
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
                                                        {materialTypeOptions.map((matType, index) => (
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
                                                className="p-2"
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
                                        {/*    <td className="text-end">
                                        <div className="p-2">${item.basePrice?.toLocaleString()}</div>
                                    </td>
 */}
                                        {/* Precio ajustado */}
                                        <td className="text-end">
                                            <div className="p-2 fw-bold">${item.adjustedPrice?.toLocaleString()}</div>
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
                                            <td colSpan={10} className="text-danger p-2 bg-light border-bottom">
                                                <div className="inline-error">{rowError.message}</div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                selectedClient && (
                    <Alert color="info" className="text-center">
                        No hay productos en el pedido. Haga clic en "Añadir Producto" para comenzar.
                    </Alert>
                )
            )}

            {/* Total del Pedido */}
            {orderItems.length > 0 && (
                <div className="bg-light p-3 rounded shadow-sm mb-4" style={{ position: "sticky", bottom: '25px', height: '110px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="h5 fw-semibold mb-0">Total del Pedido:</h2>
                        <span className="h4 fw-bold mb-0">${calculateTotal().toLocaleString()}</span>
                    </div>

                    <div className="mt-3 d-flex justify-content-between">
                        <div>
                            <span className="fw-medium">Cliente: </span>
                            <span>{selectedClient.name}</span>
                            {selectedClient.company && <span className="ms-2 text-muted">({selectedClient.company})</span>}
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
            )}
        </>
    )
}

