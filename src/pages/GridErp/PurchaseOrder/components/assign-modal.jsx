"use client"

import { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap"

export default function AssignModal({
    isOpen,
    toggle,
    zones = [],
    onSelectZone,
    selectedZoneId }) {

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Desea asignar el pedido?</ModalHeader>
            <ModalBody>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <p className="text-muted">Seleccione una zona para asignar el pedido</p>
                    <Input
                        type="select"
                        value={selectedZoneId}
                        onChange={(e) => onSelectZone(e.target.value)}
                        style={{ width: "100%" }}
                        className="form-select-sm"
                        placeholder="Seleccione un zona"
                    >
                        <option value="">Dejar libre</option>
                        {zones.map((zone) => (
                            <option key={zone._id} value={zone._id}>{zone.name}</option>
                        ))}
                    </Input>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>
                    Asignar
                </Button>
                <Button color="secondary" onClick={toggle}>
                    Cancelar
                </Button>
            </ModalFooter>
        </Modal>
    )
}

