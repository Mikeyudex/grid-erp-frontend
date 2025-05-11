import { AlertCircle } from "lucide-react";
import { Fragment } from "react";
import { Alert, Badge, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function ModalCambioEstado({
    cambioEstadoModalOpen,
    setCambioEstadoModalOpen,
    productosSeleccionadosInfo,
    nuevoEstado,
    handleCambiarEstado,
    selectedProducts,
    setNuevoEstado,
    isLoading,
    errorMessage,
    successMessage,
    statusOptions,
}) {

    return (
        <Fragment>
            <Modal isOpen={cambioEstadoModalOpen} toggle={() => setCambioEstadoModalOpen(false)}>
                <ModalHeader toggle={() => setCambioEstadoModalOpen(false)}>
                    Cambiar Estado de {selectedProducts.length} Productos
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <h6 className="fw-bold mb-2">Productos seleccionados:</h6>
                        <ul className="list-group">
                            {productosSeleccionadosInfo.pedidosInfo.map((info, idx) => (
                                <li key={`li-list-${info.id}-${idx}` } className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-medium">Pedido #{info?.id}</span>
                                        <span className="text-muted ms-2">({info.cliente})</span>
                                    </div>
                                    <Badge color="primary" pill>
                                        {info.count} productos
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="estadoSelect" className="form-label fw-bold">
                            Seleccionar Nuevo Estado:
                        </label>
                        <Input type="select" id="estadoSelect" value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
                            <option value="">-- Seleccionar Estado --</option>
                            {statusOptions.map((status, idx) => (
                                <option key={idx} value={status?.value}>
                                    {status?.label}
                                </option>
                            ))}
                        </Input>
                    </div>

                    <Alert color="warning" className="d-flex align-items-center">
                        <AlertCircle size={18} className="me-2" />
                        {nuevoEstado === "pendiente" &&
                            "Los productos pasarán a estado 'Pendiente' pero mantendrán su asignación actual."}
                        {nuevoEstado === "fabricacion" &&
                            "Los productos pasarán a estado 'Fabricación' pero mantendrán su asignación actual."}
                        {nuevoEstado === "inventario" &&
                            "Los productos se marcarán como 'Inventario' y mantendrán su asignación actual."}
                        {nuevoEstado === "finalizado" &&
                            "Los productos se marcarán como 'Finalizados' y mantendrán su asignación actual."}
                            {
                                nuevoEstado === "libre" && "La orden pasará a estado 'Libre'"
                            }
                            {
                                nuevoEstado === "asignado" && "La orden pasará a estado 'Asignado'"
                            }
                            {
                                nuevoEstado === "fabricacion" && "La orden pasará a estado 'Fabricación'"
                            }

                            {
                                nuevoEstado === "despachado" && "La orden pasará a estado 'Despachado'"
                            }
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    {errorMessage && (
                        <Alert color="danger" className="w-100 mb-3">
                            {errorMessage}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert color="success" className="w-100 mb-3">
                            {successMessage}
                        </Alert>
                    )}
                    <Button color="secondary" onClick={() => setCambioEstadoModalOpen(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleCambiarEstado} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Procesando...
                            </>
                        ) : (
                            "Cambiar Estado"
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    )
}