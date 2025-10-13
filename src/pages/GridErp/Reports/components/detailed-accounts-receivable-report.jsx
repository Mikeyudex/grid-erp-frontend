"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
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
} from "reactstrap"
import { ReportsHelper } from "../helpers/report-helper"

const reportsHelper = new ReportsHelper()

export default function DetailedAccountsReceivableReport() {
  // Estados para filtros
  const [filters, setFilters] = useState({
    clientId: "all",
    officeId: "all",
    advisorId: "all",
  })

  // Estados para datos
  const [clients, setClients] = useState([])
  const [offices, setOffices] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [reportData, setReportData] = useState([])
  const [totals, setTotals] = useState(null)

  // Estados de carga
  const [loadingFilters, setLoadingFilters] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)
  const [error, setError] = useState("")

  // Cargar datos para filtros
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoadingFilters(true)
        const [clientsData, officesData, advisorsData] = await Promise.all([
          reportsHelper.getClients(),
          reportsHelper.getOffices(),
          reportsHelper.getAdvisors(),
        ])

        setClients(clientsData)
        setOffices(officesData)
        setAdvisors(advisorsData)
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error)
        setError("Error al cargar los datos de filtros")
      } finally {
        setLoadingFilters(false)
      }
    }

    loadFilterData()
  }, [])

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Generar reporte
  const generateReport = async () => {
    try {
      setLoadingReport(true)
      setError("")

      if (!filters.clientId || filters.clientId === "all") filters.clientId = "";
      if (!filters.officeId || filters.officeId === "all") filters.officeId = "";
      if (!filters.advisorId || filters.advisorId === "all") filters.advisorId = "";

      const response = await reportsHelper.getDetailedAccountsReceivableReport(filters)

      if (response.success) {
        setReportData(response.data)
        setTotals(reportsHelper.calculateDetailedAccountsReceivableTotals(response.data))
      } else {
        setError("Error al generar el reporte")
      }
    } catch (error) {
      console.error("Error al generar reporte:", error)
      setError("Error al generar el reporte")
    } finally {
      setLoadingReport(false)
    }
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      clientId: "all",
      officeId: "all",
      advisorId: "all",
    })
    setReportData([])
    setTotals(null)
    setError("")
  }

  if (loadingFilters) {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
            <p className="mt-3 text-muted">Cargando filtros...</p>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      {/* Filtros */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle tag="h5" className="mb-0">
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row>
              {/* Cliente */}
              <Col md={4}>
                <FormGroup>
                  <Label for="client">Cliente</Label>
                  <Input
                    type="select"
                    id="client"
                    value={filters.clientId}
                    onChange={(e) => handleFilterChange("clientId", e.target.value)}
                  >
                    <option value="all">Todos los Clientes</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} - {client.commercialName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              {/* Sede */}
              <Col md={4}>
                <FormGroup>
                  <Label for="office">Sede</Label>
                  <Input
                    type="select"
                    id="office"
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

              {/* Asesor */}
              <Col md={4}>
                <FormGroup>
                  <Label for="advisor">Asesor</Label>
                  <Input
                    type="select"
                    id="advisor"
                    value={filters.advisorId}
                    onChange={(e) => handleFilterChange("advisorId", e.target.value)}
                  >
                    <option value="all">Todos los Asesores</option>
                    {advisors.map((advisor) => (
                      <option key={advisor._id} value={advisor._id}>
                        {advisor.name} {advisor.lastname}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {/* Botones de acción */}
            <Row>
              <Col>
                <Button color="primary" onClick={generateReport} disabled={loadingReport} className="me-2">
                  {loadingReport ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Generar Reporte
                    </>
                  )}
                </Button>
                <Button color="secondary" outline onClick={clearFilters}>
                  <i className="fas fa-eraser me-2"></i>
                  Limpiar Filtros
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* Error */}
      {error && (
        <Alert color="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Tabla de resultados */}
      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle tag="h5" className="mb-0">
              Resultados del Reporte ({reportData.length} facturas)
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Cliente</th>
                    <th>Nombre Comercial</th>
                    <th>Ciudad</th>
                    <th>Asesor</th>
                    <th>Sede</th>
                    <th className="text-center">No. Factura</th>
                    <th className="text-center">Vence</th>
                    <th className="text-center">Días de Mora</th>
                    <th className="text-end">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.client}</td>
                      <td>{row.commercialName}</td>
                      <td>{row.city}</td>
                      <td>{row.advisor}</td>
                      <td>{row.office}</td>
                      <td className="text-center">
                        <code className="bg-light px-2 py-1 rounded">{row.invoiceNumber}</code>
                      </td>
                      <td className="text-center">{reportsHelper.formatDate(row.dueDate)}</td>
                      <td className="text-center">
                        <Badge
                          color={row.overdueDays < 0 ? "success" : row.overdueDays <= 30 ? "warning" : "danger"}
                          pill
                        >
                          {reportsHelper.getOverdueDaysText(row.overdueDays)}
                        </Badge>
                      </td>
                      <td className="text-end fw-bold">{reportsHelper.formatCurrency(row.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Fila de totales */}
                {totals && (
                  <tfoot>
                    <tr className="table-secondary fw-bold">
                      <td colSpan="5">TOTALES CONSOLIDADOS</td>
                      <td className="text-center">{reportsHelper.formatNumber(totals.invoicesCount)} facturas</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-end">{reportsHelper.formatCurrency(totals.totalValue)}</td>
                    </tr>
                  </tfoot>
                )}
              </Table>
            </div>

            {/* Leyenda de semaforización */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="fw-bold mb-2">Leyenda - Días de Mora:</h6>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <Badge color="success" className="me-2">
                    Verde
                  </Badge>
                  <small>Pagos adelantados (menos de 0 días)</small>
                </div>
                <div className="d-flex align-items-center">
                  <Badge color="warning" className="me-2">
                    Amarillo
                  </Badge>
                  <small>Normal (0 a 30 días)</small>
                </div>
                <div className="d-flex align-items-center">
                  <Badge color="danger" className="me-2">
                    Rojo
                  </Badge>
                  <small>Mora alta (más de 30 días)</small>
                </div>
              </div>
            </div>

            {/* Estadísticas adicionales */}
            <div className="mt-4">
              <Row>
                <Col md={3}>
                  <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                    <h5 className="text-success mb-1">{reportData.filter((row) => row.overdueDays < 0).length}</h5>
                    <small className="text-muted">Pagos Adelantados</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                    <h5 className="text-warning mb-1">
                      {reportData.filter((row) => row.overdueDays >= 0 && row.overdueDays <= 30).length}
                    </h5>
                    <small className="text-muted">Mora Normal (0-30 días)</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 bg-danger bg-opacity-10 rounded">
                    <h5 className="text-danger mb-1">{reportData.filter((row) => row.overdueDays > 30).length}</h5>
                    <small className="text-muted">Mora Alta (+30 días)</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
                    <h5 className="text-primary mb-1">{totals?.invoicesCount || 0}</h5>
                    <small className="text-muted">Total Facturas</small>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Mensaje cuando no hay datos */}
      {!loadingReport && reportData.length === 0 && !error && (
        <Card>
          <CardBody className="text-center py-5">
            <i className="mdi mdi-chart-bar display-4 text-muted"></i>
            <h5 className="mt-3 text-muted">Reporte de CXC - Consolidado por Pedidos</h5>
            <p className="text-muted">Seleccione los filtros y haga clic en "Consultar" para generar el reporte.</p>
          </CardBody>
        </Card>
      )}
    </Container>
  )
}
