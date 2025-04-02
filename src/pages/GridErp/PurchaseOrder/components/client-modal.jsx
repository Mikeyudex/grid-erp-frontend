"use client"

import { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupText } from "reactstrap"
import { Search } from "lucide-react"

// Sample client list - in a real app, this would come from an API
const clients = [
  { id: 1, name: "Juan Pérez", company: "Empresa A", email: "juan@empresaa.com" },
  { id: 2, name: "María López", company: "Empresa B", email: "maria@empresab.com" },
  { id: 3, name: "Carlos Rodríguez", company: "Empresa C", email: "carlos@empresac.com" },
  { id: 4, name: "Ana Martínez", company: "Empresa D", email: "ana@empresad.com" },
  { id: 5, name: "Pedro Sánchez", company: null, email: "pedro@gmail.com" },
  { id: 6, name: "Laura García", company: "Empresa E", email: "laura@empresae.com" },
]

export default function ClientModal({ isOpen, toggle, onSelectClient }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredClients, setFilteredClients] = useState(clients)

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("")
      setFilteredClients(clients)
    }
  }, [isOpen])

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(term.toLowerCase()) ||
          (client.company && client.company.toLowerCase().includes(term.toLowerCase())),
      )
      setFilteredClients(filtered)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Seleccionar Cliente</ModalHeader>
      <ModalBody>
        <InputGroup className="mb-3">
          <InputGroupText>
            <Search size={16} />
          </InputGroupText>
          <Input placeholder="Buscar cliente por nombre o empresa..." value={searchTerm} onChange={handleSearch} />
        </InputGroup>

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-2 border-bottom hover-bg-light"
                onClick={() => onSelectClient(client)}
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
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  )
}

