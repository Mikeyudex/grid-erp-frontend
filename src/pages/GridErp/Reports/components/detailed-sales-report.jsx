"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Alert,
  Spinner,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
import { ReportsHelper } from "../helpers/report-helper"

const reportsHelper = new ReportsHelper()

export default function DetailedSalesReport() {
  // Estados para filtros
  const [offices, setOffices] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [clients, setClients] = useState([])
  const [filters, setFilters] = useState({
    officeId: "all",
    advisorId: "all",
    clientId: "all",
    startDate: "",
    endDate: "",
  })

  // Estados para datos y UI
  const [reportData, setReportData] = useState([])
  const [totals, setTotals] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState("")

  // Estados para columnas visibles
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    office: true,
    advisor: true,
    client: true,
    commercialName: true,
    invoiceNumber: true,
    carpetsCount: true,
    baseValue: true,
    discount: true,
    subtotal: true,
    iva: true,
    retention: true,
    totalValue: true,
  })

  // Definición de columnas
  const columns = [
    { key: "date", label: "Fecha", type: "date" },
    { key: "office", label: "Sede", type: "text" },
    { key: "advisor", label: "Asesor", type: "text" },
    { key: "client", label: "Cliente", type: "text" },
    { key: "commercialName", label: "Nombre Comercial", type: "text" },
    { key: "invoiceNumber", label: "No. Factura", type: "text" },
    { key: "carpetsCount", label: "Tapetes", type: "number" },
    { key: "baseValue", label: "Valor Base", type: "currency" },
    { key: "discount", label: "Descuento", type: "currency" },
    { key: "subtotal", label: "Subtotal", type: "currency" },
    { key: "iva", label: "IVA", type: "currency" },
    { key: "retention", label: "Retención", type: "currency" },
    { key: "totalValue", label: "Valor Total", type: "currency" },
  ]

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [officesData, advisorsData, clientsData] = await Promise.all([
          reportsHelper.getOffices(),
          reportsHelper.getAdvisors(),
          reportsHelper.getClients(),
        ])

        setOffices(officesData)
        setAdvisors(advisorsData)
        setClients(clientsData)
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error)
        setError("Error al cargar los datos iniciales")
      }
    }

    loadInitialData()
  }, [])

  // Manejar cambios en filtros
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validar filtros
  const validateFilters = () => {
    if (!filters.startDate || !filters.endDate) {
      setError("Las fechas de inicio y fin son obligatorias")
      return false
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      setError("La fecha de inicio no puede ser mayor a la fecha de fin")
      return false
    }

    return true
  }

  // Buscar datos del reporte
  const handleSearch = async () => {
    if (!validateFilters()) return

    setLoading(true)
    setError("")
    setHasSearched(true)

    try {
      const response = await reportsHelper.getDetailedSalesReport(filters)

      if (response.success) {
        setReportData(response.data)
        setTotals(reportsHelper.calculateDetailedTotals(response.data))
      } else {
        setError("Error al obtener los datos del reporte")
        setReportData([])
        setTotals(null)
      }
    } catch (error) {
      console.error("Error al buscar reporte:", error)
      setError("Error al consultar el reporte")
      setReportData([])
      setTotals(null)
    } finally {
      setLoading(false)
    }
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      officeId: "all",
      advisorId: "all",
      clientId: "all",
      startDate: "",
      endDate: "",
    })
    setReportData([])
    setTotals(null)
    setHasSearched(false)
    setError("")
  }

  // Toggle visibilidad de columna
  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }))
  }

  // Mostrar/ocultar todas las columnas
  const toggleAllColumns = (show) => {
    const newVisibility = {}
    columns.forEach((col) => {
      newVisibility[col.key] = show
    })
    setVisibleColumns(newVisibility)
  }

  // Renderizar valor de celda según tipo
  const renderCellValue = (value, type) => {
    switch (type) {
      case "currency":
        return reportsHelper.formatCurrency(value)
      case "number":
        return reportsHelper.formatNumber(value)
      case "date":
        return reportsHelper.formatDate(value)
      default:
        return value
    }
  }

  // Contar columnas visibles
  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg="12">
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="mb-0">
                  <i className="mdi mdi-chart-line-variant me-2"></i>
                  Reporte de Ventas Detalladas
                </CardTitle>
                <Badge color="info" pill>
                  {reportData.length} registros
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {/* Filtros */}
              <Card className="mb-4">
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="6" lg="3">
                        <FormGroup>
                          <Label for="office">
                            <i className="mdi mdi-office-building me-1"></i>
                            Sede
                          </Label>
                          <Input
                            id="office"
                            type="select"
                            value={filters.officeId}
                            onChange={(e) => handleFilterChange("officeId", e.target.value)}
                          >
                            <option value="all">Todas las Sedes</option>
                            {offices.map((office) => (
                              <option key={office._id} value={office._id}>
                                {office.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md="6" lg="3">
                        <FormGroup>
                          <Label for="advisor">
                            <i className="mdi mdi-account-tie me-1"></i>
                            Asesor
                          </Label>
                          <Input
                            id="advisor"
                            type="select"
                            value={filters.advisorId}
                            onChange={(e) => handleFilterChange("advisorId", e.target.value)}
                          >
                            <option value="all">Todos los Asesores</option>
                            {advisors.map((advisor) => (
                              <option key={advisor._id} value={advisor._id}>
                                {advisor.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md="6" lg="3">
                        <FormGroup>
                          <Label for="client">
                            <i className="mdi mdi-account-group me-1"></i>
                            Cliente
                          </Label>
                          <Input
                            id="client"
                            type="select"
                            value={filters.clientId}
                            onChange={(e) => handleFilterChange("clientId", e.target.value)}
                          >
                            <option value="all">Todos los Clientes</option>
                            {clients.map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.name} ({client.commercialName})
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md="6" lg="3">
                        <FormGroup>
                          <Label>
                            <i className="mdi mdi-calendar me-1"></i>
                            Período
                          </Label>
                          <div className="d-flex gap-2">
                            <Input
                              type="date"
                              value={filters.startDate}
                              onChange={(e) => handleFilterChange("startDate", e.target.value)}
                              placeholder="Fecha inicio"
                              className="form-control-sm"
                            />
                            <Input
                              type="date"
                              value={filters.endDate}
                              onChange={(e) => handleFilterChange("endDate", e.target.value)}
                              placeholder="Fecha fin"
                              className="form-control-sm"
                            />
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col className="d-flex gap-2 flex-wrap">
                        <Button color="primary" onClick={handleSearch} disabled={loading}>
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Consultando...
                            </>
                          ) : (
                            <>
                              <i className="mdi mdi-magnify me-2"></i>
                              Consultar
                            </>
                          )}
                        </Button>

                        <Button color="secondary" outline onClick={handleClearFilters}>
                          <i className="mdi mdi-refresh me-2"></i>
                          Limpiar
                        </Button>

                        {/* Control de columnas */}
                        <UncontrolledDropdown>
                          <DropdownToggle color="info" outline caret>
                            <i className="mdi mdi-view-column me-2"></i>
                            Columnas ({visibleColumnsCount})
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Controles</DropdownItem>
                            <DropdownItem onClick={() => toggleAllColumns(true)}>
                              <i className="mdi mdi-check-all me-2"></i>
                              Mostrar Todas
                            </DropdownItem>
                            <DropdownItem onClick={() => toggleAllColumns(false)}>
                              <i className="mdi mdi-close-box-multiple me-2"></i>
                              Ocultar Todas
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem header>Columnas</DropdownItem>
                            {columns.map((column) => (
                              <DropdownItem
                                key={column.key}
                                onClick={() => toggleColumn(column.key)}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <span>{column.label}</span>
                                {visibleColumns[column.key] && <i className="mdi mdi-check text-success"></i>}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>

              {/* Alertas */}
              {error && (
                <Alert color="danger" className="mb-4">
                  <i className="mdi mdi-alert-circle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Resultados */}
              {!hasSearched && !loading && (
                <Alert color="info" className="text-center">
                  <i className="mdi mdi-information me-2"></i>
                  Seleccione los filtros y haga clic en "Consultar" para ver el reporte
                </Alert>
              )}

              {hasSearched && !loading && reportData.length === 0 && !error && (
                <Alert color="warning" className="text-center">
                  <i className="mdi mdi-alert me-2"></i>
                  No se encontraron datos para los filtros seleccionados
                </Alert>
              )}

              {reportData.length > 0 && (
                <Card>
                  <CardBody className="p-0">
                    <div className="table-responsive">
                      <Table className="table-nowrap table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            {columns.map(
                              (column) =>
                                visibleColumns[column.key] && (
                                  <th key={column.key} className="text-center">
                                    {column.label}
                                  </th>
                                ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((row, index) => (
                            <tr key={index}>
                              {columns.map(
                                (column) =>
                                  visibleColumns[column.key] && (
                                    <td
                                      key={column.key}
                                      className={
                                        column.type === "currency" || column.type === "number"
                                          ? "text-end"
                                          : "text-center"
                                      }
                                    >
                                      {renderCellValue(row[column.key], column.type)}
                                    </td>
                                  ),
                              )}
                            </tr>
                          ))}

                          {/* Fila de totales */}
                          {totals && (
                            <tr className="table-warning fw-bold">
                              {visibleColumns.date && <td className="text-center">-</td>}
                              {visibleColumns.office && <td className="text-center">-</td>}
                              {visibleColumns.advisor && <td className="text-center">-</td>}
                              {visibleColumns.client && <td className="text-center">-</td>}
                              {visibleColumns.commercialName && <td className="text-center">-</td>}
                              {visibleColumns.invoiceNumber && <td className="text-center">TOTALES</td>}
                              {visibleColumns.carpetsCount && (
                                <td className="text-end">{reportsHelper.formatNumber(totals.carpetsCount)}</td>
                              )}
                              {visibleColumns.baseValue && (
                                <td className="text-end">{reportsHelper.formatCurrency(totals.baseValue)}</td>
                              )}
                              {visibleColumns.discount && (
                                <td className="text-end">{reportsHelper.formatCurrency(totals.discount)}</td>
                              )}
                              {visibleColumns.subtotal && (
                                <td className="text-end">{reportsHelper.formatCurrency(totals.subtotal)}</td>
                              )}
                              {visibleColumns.iva && (
                                <td className="text-end">{reportsHelper.formatCurrency(totals.iva)}</td>
                              )}
                              {visibleColumns.retention && (
                                <td className="text-end">{reportsHelper.formatCurrency(totals.retention)}</td>
                              )}
                              {visibleColumns.totalValue && (
                                <td className="text-end">{reportsHelper.formatCurrency(totals.totalValue)}</td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
