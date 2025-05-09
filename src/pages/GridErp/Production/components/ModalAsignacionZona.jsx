import { AlertCircle } from "lucide-react";
import { Fragment } from "react";
import { Alert, Badge, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";



export default function ModalAsignacionXZona({
    asignacionZonaModalOpen,
    setAsignacionZonaModalOpen,
    productosSeleccionadosInfo,
    zonas,
    handleAsignarProductosXZona,
    setSelectedZoneId,
    selectedZoneId,
    isLoading,
    errorMessage,
    successMessage,
    selectedPedidos,
}) {

    return (
        <Fragment>
            {/* Modal de asignación de zona*/}
            < Modal isOpen={asignacionZonaModalOpen} toggle={() => setAsignacionZonaModalOpen(false)
            }>
                <ModalHeader toggle={() => setAsignacionZonaModalOpen(false)}>
                    Asignar {selectedPedidos.length} {selectedPedidos.length > 1 ? 'Pedidos' : 'Pedido'}
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <h6 className="fw-bold mb-2">Pedidos seleccionados:</h6>
                        <ul className="list-group">
                            {productosSeleccionadosInfo.pedidosInfo.map((info) => (
                                <li key={info.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-medium">Pedido #{info.id}</span>
                                        <span className="text-muted ms-2">({info.cliente})</span>
                                    </div>
                                    <Badge color="primary" pill>
                                        {selectedPedidos.length}  {selectedPedidos.length > 1 ? 'Pedidos' : 'Pedido'}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="zoneSelect" className="form-label fw-bold">
                            Seleccionar Zona de producción:
                        </label>
                        <Input
                            type="select"
                            id="zoneSelect"
                            value={selectedZoneId}
                            onChange={(e) => setSelectedZoneId(e.target.value)}
                        >
                            <option value="">-- Seleccionar Zona --</option>
                            {zonas
                                .map((zona) => (
                                    <option key={zona?._id} value={zona?._id}>
                                        {zona?.name}
                                    </option>
                                ))}
                        </Input>
                    </div>

                    <Alert color="info" className="d-flex align-items-center">
                        <AlertCircle size={18} className="me-2" />
                        El pedido seleccionado pasará a estado Asignado.
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
                    <Button color="secondary" onClick={() => setAsignacionZonaModalOpen(false)} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleAsignarProductosXZona} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Asignando...
                            </>
                        ) : (
                            selectedPedidos.length > 1 ? 'Asignar pedidos' : 'Asignar pedido'
                        )}
                    </Button>
                </ModalFooter>
            </Modal >

        </Fragment >
    )
}