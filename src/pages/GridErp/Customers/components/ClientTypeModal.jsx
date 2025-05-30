"use client"

import { useState, useEffect } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText,
  Row,
  Col,
} from "reactstrap"

const ClientTypeModal = ({ isOpen, toggle, clientType, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortCode: "",
    percentDiscount: 0,
    active: true,
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Cargar datos del cliente si se está editando
  useEffect(() => {
    if (clientType) {
      setFormData({
        _id: clientType._id,
        name: clientType.name || "",
        description: clientType.description || "",
        shortCode: clientType.shortCode || "",
        percentDiscount: clientType.percentDiscount || 0,
        active: clientType.active !== undefined ? clientType.active : true,
      })
    } else {
      // Resetear el formulario para un nuevo cliente
      setFormData({
        name: "",
        description: "",
        shortCode: "",
        percentDiscount: 0,
        active: true,
      })
    }

    setErrors({})
  }, [clientType, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Limpiar error al cambiar el campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.shortCode.trim()) {
      newErrors.shortCode = "El código corto es obligatorio"
    } else if (formData.shortCode.length > 10) {
      newErrors.shortCode = "El código corto debe tener máximo 10 caracteres"
    }

    if (formData.percentDiscount < 0 || formData.percentDiscount > 100) {
      newErrors.percentDiscount = "El descuento debe estar entre 0 y 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const success = await onSave(formData)

      if (success) {
        toggle()
      }
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>{clientType ? "Editar" : "Nuevo"}</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="name">Nombre *</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  invalid={!!errors.name}
                  placeholder="Ej: MAYORISTA"
                />
                <FormFeedback>{errors.name}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="shortCode">Código Corto *</Label>
                <Input
                  type="text"
                  name="shortCode"
                  id="shortCode"
                  value={formData.shortCode}
                  onChange={handleChange}
                  invalid={!!errors.shortCode}
                  placeholder="Ej: MAY"
                  maxLength={10}
                />
                <FormFeedback>{errors.shortCode}</FormFeedback>
                <FormText>Código abreviado para identificar el tipo de cliente (máx. 10 caracteres)</FormText>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="description">Descripción</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción detallada del tipo de cliente"
              rows={3}
            />
          </FormGroup>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="percentDiscount">Porcentaje de Descuento (%)</Label>
                <Input
                  type="number"
                  name="percentDiscount"
                  id="percentDiscount"
                  value={formData.percentDiscount}
                  onChange={handleChange}
                  invalid={!!errors.percentDiscount}
                  min={0}
                  max={100}
                  step={1}
                />
                <FormFeedback>{errors.percentDiscount}</FormFeedback>
                <FormText>Porcentaje de descuento aplicable a este tipo de cliente (0-100)</FormText>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup check className="mt-4">
                <Label check>
                  <Input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Activo
                </Label>
                <FormText>Indica si este tipo de cliente está activo en el sistema</FormText>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={submitting}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ClientTypeModal
