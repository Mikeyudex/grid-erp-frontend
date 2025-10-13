"use client"

import { useState, useEffect } from "react"
import { Card, CardBody, CardHeader, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap"
import { ReportsHelper } from "../helpers/report-helper"
import { Package, User, MapPin, Phone, FileText, Printer, Download, Copy, RotateCcw } from "lucide-react"

const ShippingLabelsGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [defaultSender, setDefaultSender] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: "", color: "success" })

  // Estados para el formulario
  const [sender, setSender] = useState({
    name: "",
    documentNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
  })

  const [recipient, setRecipient] = useState({
    clientId: "",
    name: "",
    documentNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
    contactPerson: "",
  })

  const [labelInfo, setLabelInfo] = useState({
    packageDescription: "",
    weight: "",
    dimensions: "",
    specialInstructions: "",
    trackingNumber: "",
  })

  const reportsHelper = new ReportsHelper()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [clientsData, senderData] = await Promise.all([
        reportsHelper.getClientsForLabels(),
        reportsHelper.getDefaultSender(),
      ])

      setClients(clientsData)
      setDefaultSender(senderData)
      setSender(senderData)
    } catch (error) {
      console.error("Error loading data:", error)
      showAlert("Error al cargar los datos", "danger")
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (message, color = "success") => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: "", color: "success" }), 5000)
  }

  const handleClientSelect = (clientId) => {
    const selectedClient = clients.find((client) => client._id === clientId)
    if (selectedClient) {
      setRecipient({
        clientId: clientId,
        name: selectedClient.name,
        documentNumber: selectedClient.documentNumber,
        address: `${selectedClient.address}, ${selectedClient.city}, ${selectedClient.state}`,
        city: selectedClient.city,
        state: selectedClient.state,
        postalCode: selectedClient.postalCode,
        phone: selectedClient.phone,
        email: selectedClient.email,
        contactPerson: selectedClient.contactPerson,
      })
      showAlert("Datos del destinatario cargados correctamente", "success")
    }
  }

  const handleSenderChange = (field, value) => {
    setSender((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRecipientChange = (field, value) => {
    setRecipient((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLabelInfoChange = (field, value) => {
    setLabelInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetSender = () => {
    if (defaultSender) {
      setSender(defaultSender)
      showAlert("Datos del remitente restablecidos", "info")
    }
  }

  const clearRecipient = () => {
    setRecipient({
      clientId: "",
      name: "",
      documentNumber: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      email: "",
      contactPerson: "",
    })
    showAlert("Datos del destinatario limpiados", "info")
  }

  const generateTrackingNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const trackingNumber = `TP${timestamp}${random}`
    setLabelInfo((prev) => ({
      ...prev,
      trackingNumber,
    }))
    showAlert(`Número de seguimiento generado: ${trackingNumber}`, "success")
  }

  const validateForm = () => {
    if (!sender.name || !sender.address || !sender.phone) {
      showAlert("Por favor complete los datos del remitente", "danger")
      return false
    }
    if (!recipient.name || !recipient.address || !recipient.phone) {
      showAlert("Por favor complete los datos del destinatario", "danger")
      return false
    }
    return true
  }

  const printLabel = () => {
    if (!validateForm()) return

    // Crear ventana de impresión
    const printWindow = window.open("", "_blank")
    const labelHtml = generateLabelHTML()

    printWindow.document.write(labelHtml)
    printWindow.document.close()
    printWindow.print()

    showAlert("Rótulo enviado a impresión", "success")
  }

  const downloadLabel = () => {
    if (!validateForm()) return

    const labelHtml = generateLabelHTML()
    const blob = new Blob([labelHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rotulo_envio_${labelInfo.trackingNumber || Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showAlert("Rótulo descargado correctamente", "success")
  }

  const copyLabelData = () => {
    if (!validateForm()) return

    const labelText = `
RÓTULO DE ENVÍO
================

REMITENTE:
${sender.name}
${sender.documentNumber}
${sender.address}
${sender.phone}

DESTINATARIO:
${recipient.name}
${recipient.documentNumber}
${recipient.address}
${recipient.phone}
${recipient.contactPerson ? `Contacto: ${recipient.contactPerson}` : ""}

INFORMACIÓN DEL PAQUETE:
${labelInfo.packageDescription ? `Descripción: ${labelInfo.packageDescription}` : ""}
${labelInfo.weight ? `Peso: ${labelInfo.weight}` : ""}
${labelInfo.dimensions ? `Dimensiones: ${labelInfo.dimensions}` : ""}
${labelInfo.trackingNumber ? `Seguimiento: ${labelInfo.trackingNumber}` : ""}
${labelInfo.specialInstructions ? `Instrucciones: ${labelInfo.specialInstructions}` : ""}
    `

    navigator.clipboard.writeText(labelText.trim())
    showAlert("Datos del rótulo copiados al portapapeles", "success")
  }

  const generateLabelHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rótulo de Envío</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .label { border: 2px solid #000; padding: 20px; max-width: 600px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .section-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
        .tracking { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
        .barcode { text-align: center; font-family: 'Courier New', monospace; font-size: 24px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="label">
        <div class="header">RÓTULO DE ENVÍO</div>
        
        <div class="section">
            <div class="section-title">REMITENTE:</div>
            <div>${sender.name}</div>
            <div>${sender.documentNumber}</div>
            <div>${sender.address}</div>
            <div>${sender.phone}</div>
        </div>
        
        <div class="section">
            <div class="section-title">DESTINATARIO:</div>
            <div>${recipient.name}</div>
            <div>${recipient.documentNumber}</div>
            <div>${recipient.address}</div>
            <div>${recipient.phone}</div>
            ${recipient.contactPerson ? `<div>Contacto: ${recipient.contactPerson}</div>` : ""}
        </div>
        
        ${
          labelInfo.trackingNumber
            ? `
        <div class="tracking">
            No. Seguimiento: ${labelInfo.trackingNumber}
        </div>
        <div class="barcode">||||| ${labelInfo.trackingNumber} |||||</div>
        `
            : ""
        }
        
        ${
          labelInfo.packageDescription || labelInfo.weight || labelInfo.dimensions
            ? `
        <div class="section">
            <div class="section-title">INFORMACIÓN DEL PAQUETE:</div>
            ${labelInfo.packageDescription ? `<div>Descripción: ${labelInfo.packageDescription}</div>` : ""}
            ${labelInfo.weight ? `<div>Peso: ${labelInfo.weight}</div>` : ""}
            ${labelInfo.dimensions ? `<div>Dimensiones: ${labelInfo.dimensions}</div>` : ""}
        </div>
        `
            : ""
        }
        
        ${
          labelInfo.specialInstructions
            ? `
        <div class="section">
            <div class="section-title">INSTRUCCIONES ESPECIALES:</div>
            <div>${labelInfo.specialInstructions}</div>
        </div>
        `
            : ""
        }
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
            Generado el ${new Date().toLocaleDateString("es-CO")} - Quality S.A.S
        </div>
    </div>
</body>
</html>
    `
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando generador de rótulos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {alert.show && (
        <Alert color={alert.color} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Row>
        {/* Sección Remitente */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <CardHeader className="bg-light text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <User className="me-2" size={20} />
                  <h5 className="mb-0">Datos del Remitente</h5>
                </div>
                <Button color="light" size="sm" onClick={resetSender} title="Restablecer datos predeterminados">
                  <RotateCcw size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="senderName">Nombre Completo *</Label>
                      <Input
                        type="text"
                        id="senderName"
                        value={sender.name}
                        onChange={(e) => handleSenderChange("name", e.target.value)}
                        placeholder="Nombre completo del remitente"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="senderDocument">Número de Documento</Label>
                      <Input
                        type="text"
                        id="senderDocument"
                        value={sender.documentNumber}
                        onChange={(e) => handleSenderChange("documentNumber", e.target.value)}
                        placeholder="NIT o Cédula"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="senderPhone">Teléfono *</Label>
                      <Input
                        type="text"
                        id="senderPhone"
                        value={sender.phone}
                        onChange={(e) => handleSenderChange("phone", e.target.value)}
                        placeholder="+57 300 000 0000"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="senderAddress">Dirección Completa *</Label>
                      <Input
                        type="textarea"
                        id="senderAddress"
                        rows="2"
                        value={sender.address}
                        onChange={(e) => handleSenderChange("address", e.target.value)}
                        placeholder="Dirección completa con ciudad y departamento"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="senderCity">Ciudad</Label>
                      <Input
                        type="text"
                        id="senderCity"
                        value={sender.city}
                        onChange={(e) => handleSenderChange("city", e.target.value)}
                        placeholder="Ciudad"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="senderState">Departamento</Label>
                      <Input
                        type="text"
                        id="senderState"
                        value={sender.state}
                        onChange={(e) => handleSenderChange("state", e.target.value)}
                        placeholder="Departamento"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="senderPostalCode">Código Postal</Label>
                      <Input
                        type="text"
                        id="senderPostalCode"
                        value={sender.postalCode}
                        onChange={(e) => handleSenderChange("postalCode", e.target.value)}
                        placeholder="110111"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* Sección Destinatario */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <CardHeader className="bg-light text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <MapPin className="me-2" size={20} />
                  <h5 className="mb-0">Datos del Destinatario</h5>
                </div>
                <Button color="light" size="sm" onClick={clearRecipient} title="Limpiar datos">
                  <RotateCcw size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="clientSelect">Seleccionar Cliente</Label>
                      <Input
                        type="select"
                        id="clientSelect"
                        value={recipient.clientId}
                        onChange={(e) => handleClientSelect(e.target.value)}
                      >
                        <option value="">-- Seleccionar Cliente --</option>
                        {clients.map((client) => (
                          <option key={client._id} value={client._id}>
                            {client.name} - {client.commercialName} ({client.city})
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="recipientName">Nombre Completo *</Label>
                      <Input
                        type="text"
                        id="recipientName"
                        value={recipient.name}
                        onChange={(e) => handleRecipientChange("name", e.target.value)}
                        placeholder="Nombre completo del destinatario"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="recipientDocument">Número de Documento</Label>
                      <Input
                        type="text"
                        id="recipientDocument"
                        value={recipient.documentNumber}
                        onChange={(e) => handleRecipientChange("documentNumber", e.target.value)}
                        placeholder="NIT o Cédula"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="recipientPhone">Teléfono *</Label>
                      <Input
                        type="text"
                        id="recipientPhone"
                        value={recipient.phone}
                        onChange={(e) => handleRecipientChange("phone", e.target.value)}
                        placeholder="+57 300 000 0000"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="recipientAddress">Dirección Completa *</Label>
                      <Input
                        type="textarea"
                        id="recipientAddress"
                        rows="2"
                        value={recipient.address}
                        onChange={(e) => handleRecipientChange("address", e.target.value)}
                        placeholder="Dirección completa con ciudad y departamento"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="recipientContact">Persona de Contacto</Label>
                      <Input
                        type="text"
                        id="recipientContact"
                        value={recipient.contactPerson}
                        onChange={(e) => handleRecipientChange("contactPerson", e.target.value)}
                        placeholder="Nombre del contacto"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="recipientEmail">Email</Label>
                      <Input
                        type="email"
                        id="recipientEmail"
                        value={recipient.email}
                        onChange={(e) => handleRecipientChange("email", e.target.value)}
                        placeholder="email@ejemplo.com"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Información del Paquete */}
      {/* <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader className="bg-warning text-dark">
              <div className="d-flex align-items-center">
                <FileText className="me-2" size={20} />
                <h5 className="mb-0">Información del Paquete</h5>
              </div>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="packageDescription">Descripción del Paquete</Label>
                      <Input
                        type="text"
                        id="packageDescription"
                        value={labelInfo.packageDescription}
                        onChange={(e) => handleLabelInfoChange("packageDescription", e.target.value)}
                        placeholder="Ej: Tapetes decorativos"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="packageWeight">Peso</Label>
                      <Input
                        type="text"
                        id="packageWeight"
                        value={labelInfo.weight}
                        onChange={(e) => handleLabelInfoChange("weight", e.target.value)}
                        placeholder="Ej: 5 kg"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="packageDimensions">Dimensiones</Label>
                      <Input
                        type="text"
                        id="packageDimensions"
                        value={labelInfo.dimensions}
                        onChange={(e) => handleLabelInfoChange("dimensions", e.target.value)}
                        placeholder="Ej: 50x30x10 cm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="trackingNumber">Número de Seguimiento</Label>
                      <div className="d-flex">
                        <Input
                          type="text"
                          id="trackingNumber"
                          value={labelInfo.trackingNumber}
                          onChange={(e) => handleLabelInfoChange("trackingNumber", e.target.value)}
                          placeholder="Número de seguimiento"
                          className="me-2"
                        />
                        <Button color="secondary" onClick={generateTrackingNumber} title="Generar número automático">
                          Generar
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="specialInstructions">Instrucciones Especiales</Label>
                      <Input
                        type="text"
                        id="specialInstructions"
                        value={labelInfo.specialInstructions}
                        onChange={(e) => handleLabelInfoChange("specialInstructions", e.target.value)}
                        placeholder="Ej: Frágil, No doblar"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {/* Vista Previa del Rótulo */}
      {(sender.name || recipient.name) && (
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader className="bg-light text-dark">
                <h5 className="mb-0">Vista Previa del Rótulo</h5>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "20px",
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                    RÓTULO DE ENVÍO
                  </div>

                  {sender.name && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>REMITENTE:</div>
                      <div>{sender.name}</div>
                      {sender.documentNumber && <div>{sender.documentNumber}</div>}
                      {sender.address && <div>{sender.address}</div>}
                      {sender.phone && <div>{sender.phone}</div>}
                    </div>
                  )}

                  {recipient.name && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>DESTINATARIO:</div>
                      <div>{recipient.name}</div>
                      {recipient.documentNumber && <div>{recipient.documentNumber}</div>}
                      {recipient.address && <div>{recipient.address}</div>}
                      {recipient.phone && <div>{recipient.phone}</div>}
                      {/* {recipient.contactPerson && <div>Contacto: {recipient.contactPerson}</div>} */}
                    </div>
                  )}

                  {labelInfo.trackingNumber && (
                    <>
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                          margin: "20px 0",
                        }}
                      >
                        No. Seguimiento: {labelInfo.trackingNumber}
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          fontFamily: "'Courier New', monospace",
                          fontSize: "24px",
                          margin: "10px 0",
                        }}
                      >
                        ||||| {labelInfo.trackingNumber} |||||
                      </div>
                    </>
                  )}

                  {(labelInfo.packageDescription || labelInfo.weight || labelInfo.dimensions) && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>
                        INFORMACIÓN DEL PAQUETE:
                      </div>
                      {labelInfo.packageDescription && <div>Descripción: {labelInfo.packageDescription}</div>}
                      {labelInfo.weight && <div>Peso: {labelInfo.weight}</div>}
                      {labelInfo.dimensions && <div>Dimensiones: {labelInfo.dimensions}</div>}
                    </div>
                  )}

                  {labelInfo.specialInstructions && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>
                        INSTRUCCIONES ESPECIALES:
                      </div>
                      <div>{labelInfo.specialInstructions}</div>
                    </div>
                  )}

                  <div style={{ textAlign: "center", marginTop: "30px", fontSize: "12px" }}>
                    Generado el {new Date().toLocaleDateString("es-CO")} - Quality S.A.S
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botones de Acción */}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Button color="primary" onClick={printLabel} className="d-flex align-items-center">
                  <Printer className="me-2" size={16} />
                  Imprimir Rótulo
                </Button>
                <Button color="success" onClick={downloadLabel} className="d-flex align-items-center">
                  <Download className="me-2" size={16} />
                  Descargar HTML
                </Button>
                <Button color="info" onClick={copyLabelData} className="d-flex align-items-center">
                  <Copy className="me-2" size={16} />
                  Copiar Datos
                </Button>
                {/* <Button color="secondary" onClick={generateTrackingNumber} className="d-flex align-items-center">
                  <Phone className="me-2" size={16} />
                  Generar Seguimiento
                </Button> */}
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">
                  * Los campos marcados con asterisco son obligatorios para generar el rótulo
                </small>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ShippingLabelsGenerator
