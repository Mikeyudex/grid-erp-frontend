import { AlertCircle } from "lucide-react";
import { Fragment } from "react";
import { Alert, Badge, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";



export default function ModalAsignacion({
    asignacionModalOpen,
    setAsignacionModalOpen,
    productosSeleccionadosInfo,
    agentesProduccion,
    handleAsignarProductos,
    setSelectedAgent,
    selectedAgent,
}) {

    return (
        <Fragment>
            {/* Modal de Asignación */}
            < Modal isOpen={asignacionModalOpen} toggle={() => setAsignacionModalOpen(false)
            }>
                <ModalHeader toggle={() => setAsignacionModalOpen(false)}>
                    Asignar {productosSeleccionadosInfo.count} Productos
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <h6 className="fw-bold mb-2">Productos seleccionados:</h6>
                        <ul className="list-group">
                            {productosSeleccionadosInfo.pedidosInfo.map((info) => (
                                <li key={info.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-medium">Pedido #{info.id}</span>
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
                        <label htmlFor="agenteSelect" className="form-label fw-bold">
                            Seleccionar Agente de Producción:
                        </label>
                        <Input
                            type="select"
                            id="agenteSelect"
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                        >
                            <option value="">-- Seleccionar Agente --</option>
                            {agentesProduccion
                                .filter((agente) => agente.disponible)
                                .map((agente) => (
                                    <option key={agente.id} value={agente.id}>
                                        {agente.nombre} - {agente.departamento}
                                    </option>
                                ))}
                        </Input>
                    </div>

                    <Alert color="info" className="d-flex align-items-center">
                        <AlertCircle size={18} className="me-2" />
                        Los productos seleccionados pasarán a estado "En Producción" y serán asignados al agente seleccionado.
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setAsignacionModalOpen(false)}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleAsignarProductos}>
                        Asignar Productos
                    </Button>
                </ModalFooter>
            </Modal >

        </Fragment >
    )
}