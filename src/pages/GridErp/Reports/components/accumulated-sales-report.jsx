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
  Spinner,
  Alert,
} from "reactstrap"
import { ReportsHelper } from "../helpers/report-helper"
import { TopLayoutGeneralView } from "../../../../Components/Common/TopLayoutGeneralView"

const reportsHelper = new ReportsHelper()

export default function AccumulatedSalesReport() {
  // Estados para filtros
  const [offices, setOffices] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [selectedOffice, setSelectedOffice] = useState("all")
  const [selectedAdvisor, setSelectedAdvisor] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Estados para datos y UI
  const [reportData, setReportData] = useState([])
  const [totals, setTotals] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [officesData, advisorsData] = await Promise.all([reportsHelper.getOffices(), reportsHelper.getAdvisors()])

      setOffices(officesData)
      setAdvisors(advisorsData)
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error)
      setError("Error al cargar los datos iniciales")
    }
  }

  // Manejar búsqueda del reporte
  const handleSearch = async (e) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      setError("Por favor seleccione las fechas de inicio y fin")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("La fecha de inicio no puede ser mayor a la fecha de fin")
      return
    }

    setLoading(true)
    setError("")

    try {
      const filters = {
        officeId: selectedOffice === "all" ? null : selectedOffice,
        advisorId: selectedAdvisor === "all" ? null : selectedAdvisor,
        startDate,
        endDate,
      }

      const response = await reportsHelper.getAccumulatedSalesReport(filters)

      if (response.success) {
        setReportData(response.data)
        setTotals(reportsHelper.calculateTotals(response.data))
        setHasSearched(true)
      } else {
        setError("Error al obtener los datos del reporte")
      }
    } catch (error) {
      console.error("Error al buscar reporte:", error)
      setError("Error al consultar el reporte")
    } finally {
      setLoading(false)
    }
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSelectedOffice("all")
    setSelectedAdvisor("all")
    setStartDate("")
    setEndDate("")
    setReportData([])
    setTotals(null)
    setError("")
    setHasSearched(false)
  }

  return (
    <TopLayoutGeneralView
      titleBreadcrumb="Reporte de Ventas Acumuladas"
      pageTitleBreadcrumb="Reportes"
      to="/reports"
      main={
        <Container fluid className="py-4">
          {/* Filtros */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle tag="h5" className="mb-0">
                <i className="mdi mdi-filter-variant me-2"></i>
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label for="office">Sede</Label>
                      <Input
                        id="office"
                        type="select"
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                        disabled={loading}
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

                  <Col md="3">
                    <FormGroup>
                      <Label for="advisor">Asesor</Label>
                      <Input
                        id="advisor"
                        type="select"
                        value={selectedAdvisor}
                        onChange={(e) => setSelectedAdvisor(e.target.value)}
                        disabled={loading}
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

                  <Col md="2">
                    <FormGroup>
                      <Label for="startDate">Fecha Inicio *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="2">
                    <FormGroup>
                      <Label for="endDate">Fecha Fin *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="2" className="d-flex align-items-end">
                    <FormGroup className="w-100">
                      <div className="d-flex gap-2">
                        <Button type="submit" color="primary" disabled={loading} className="flex-fill">
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
                        <Button type="button" color="secondary" outline onClick={handleClearFilters} disabled={loading}>
                          <i className="mdi mdi-refresh"></i>
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>

          {/* Mensajes de error */}
          {error && (
            <Alert color="danger" className="mb-4">
              <i className="mdi mdi-alert-circle me-2"></i>
              {error}
            </Alert>
          )}

          {/* Tabla de resultados */}
          {hasSearched && !loading && (
            <Card>
              <CardHeader>
                <CardTitle tag="h5" className="mb-0">
                  <i className="mdi mdi-chart-line me-2"></i>
                  Resultados del Reporte
                  <small className="text-muted ms-2">
                    ({reportData.length} registro{reportData.length !== 1 ? "s" : ""})
                  </small>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {reportData.length > 0 ? (
                  <div className="table-responsive">
                    <Table striped bordered hover className="mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>Sede</th>
                          <th>Asesor</th>
                          <th className="text-center">Pedidos</th>
                          <th className="text-center">Tapetes</th>
                          <th className="text-end">Valor Base</th>
                          <th className="text-end">Descuento</th>
                          <th className="text-end">Subtotal</th>
                          <th className="text-end">IVA</th>
                          <th className="text-end">Retención</th>
                          <th className="text-end">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.office}</td>
                            <td>{item.advisor}</td>
                            <td className="text-center">{reportsHelper.formatNumber(item.ordersCount)}</td>
                            <td className="text-center">{reportsHelper.formatNumber(item.carpetsCount)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(item.baseValue)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(item.discount)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(item.subtotal)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(item.iva)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(item.retention)}</td>
                            <td className="text-end fw-bold">{reportsHelper.formatCurrency(item.totalValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Fila de totales */}
                      {totals && (
                        <tfoot className="table-warning">
                          <tr className="fw-bold">
                            <td colSpan="2" className="text-center">
                              <strong>TOTALES CONSOLIDADOS</strong>
                            </td>
                            <td className="text-center">{reportsHelper.formatNumber(totals.ordersCount)}</td>
                            <td className="text-center">{reportsHelper.formatNumber(totals.carpetsCount)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(totals.baseValue)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(totals.discount)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(totals.subtotal)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(totals.iva)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(totals.retention)}</td>
                            <td className="text-end">{reportsHelper.formatCurrency(totals.totalValue)}</td>
                          </tr>
                        </tfoot>
                      )}
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="mdi mdi-information-outline display-4 text-muted"></i>
                    <h5 className="mt-3 text-muted">No se encontraron datos</h5>
                    <p className="text-muted">No hay registros que coincidan con los filtros seleccionados.</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Estado inicial */}
          {!hasSearched && !loading && (
            <Card>
              <CardBody className="text-center py-5">
                <i className="mdi mdi-chart-bar display-4 text-muted"></i>
                <h5 className="mt-3 text-muted">Reporte de Ventas Acumuladas</h5>
                <p className="text-muted">Seleccione los filtros y haga clic en "Consultar" para generar el reporte.</p>
              </CardBody>
            </Card>
          )}
        </Container>
      }
    />
  )
}
