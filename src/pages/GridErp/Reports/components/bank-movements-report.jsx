"use client"
import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
  Badge,
} from "reactstrap"
import { ReportsHelper } from "../helpers/report-helper"

export default function BankMovementsReport() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totals, setTotals] = useState(null)
  const [error, setError] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  // Filtros
  const [filters, setFilters] = useState({
    accountId: "",
    startDate: "",
    endDate: "",
  })

  const reportsHelper = new ReportsHelper()

  // Cargar cuentas bancarias al montar el componente
  useEffect(() => {
    loadBankAccounts()
  }, [])

  const loadBankAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const response = await reportsHelper.getBankAccounts()
      setAccounts(response)

      // Seleccionar la primera cuenta por defecto
      if (response.length > 0) {
        setFilters((prev) => ({
          ...prev,
          accountId: response[0]._id,
        }))
      }
    } catch (error) {
      console.error("Error cargando cuentas:", error)
      setError("Error al cargar las cuentas bancarias")
    } finally {
      setLoadingAccounts(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateReport = async () => {
    if (!filters.accountId) {
      setError("Debe seleccionar una cuenta")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await reportsHelper.getBankMovementsReport(filters)

      if (response.success) {
        setData(response.data)
        const calculatedTotals = reportsHelper.calculateBankMovementsTotals(response.data)
        setTotals(calculatedTotals)
      } else {
        setError("Error al generar el reporte")
      }
    } catch (error) {
      console.error("Error generando reporte:", error)
      setError("Error al generar el reporte")
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (data.length === 0) return

    const headers = ["Cuenta", "Nombre Tercero", "No. Comprobante", "Fecha", "Ingreso", "Egreso", "Saldo"]

    const csvData = data.map((row) => [
      row.accountNumber,
      row.thirdPartyName,
      row.voucherNumber,
      reportsHelper.formatDate(row.date),
      row.income || 0,
      row.expense || 0,
      row.balance,
    ])

    // Agregar fila de totales
    csvData.push([
      "TOTALES",
      "",
      "",
      "",
      totals?.totalIncome || 0,
      totals?.totalExpense || 0,
      totals?.finalBalance || 0,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `movimientos_bancarios_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getSelectedAccountInfo = () => {
    const selectedAccount = accounts.find((acc) => acc._id === filters.accountId)
    return selectedAccount || null
  }

  if (loadingAccounts) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Cargando cuentas bancarias...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>
                Filtros de Consulta
              </h5>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="accountSelect">
                        <i className="fas fa-university me-1"></i>
                        Cuenta Bancaria *
                      </Label>
                      <Input
                        type="select"
                        id="accountSelect"
                        value={filters.accountId}
                        onChange={(e) => handleFilterChange("accountId", e.target.value)}
                      >
                        <option value="">Seleccionar cuenta...</option>
                        {accounts.map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.accountNumber} - {account.bankName} ({account.accountType})
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="startDate">
                        <i className="fas fa-calendar me-1"></i>
                        Fecha Inicial
                      </Label>
                      <Input
                        type="date"
                        id="startDate"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange("startDate", e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="endDate">
                        <i className="fas fa-calendar me-1"></i>
                        Fecha Final
                      </Label>
                      <Input
                        type="date"
                        id="endDate"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange("endDate", e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <FormGroup className="w-100">
                      <Button color="primary" onClick={generateReport} disabled={loading || !filters.accountId} block>
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-search me-2"></i>
                            Consultar
                          </>
                        )}
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Información de la cuenta seleccionada */}
      {getSelectedAccountInfo() && (
        <Row className="mb-4">
          <Col>
            <Card className="border-info">
              <CardBody>
                <Row>
                  <Col md={6}>
                    <h6 className="text-info mb-2">
                      <i className="fas fa-info-circle me-2"></i>
                      Información de la Cuenta
                    </h6>
                    <p className="mb-1">
                      <strong>Número:</strong> {getSelectedAccountInfo().accountNumber}
                    </p>
                    <p className="mb-1">
                      <strong>Banco:</strong> {getSelectedAccountInfo().bankName}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>Tipo:</strong> <Badge color="info">{getSelectedAccountInfo().accountType}</Badge>
                    </p>
                    <p className="mb-0">
                      <strong>Nombre:</strong> {getSelectedAccountInfo().accountName}
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Error */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert color="danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Estadísticas */}
      {totals && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-primary">
              <CardBody className="text-center">
                <i className="fas fa-list-ol fa-2x text-primary mb-2"></i>
                <h4 className="text-primary mb-1">{totals.movementsCount}</h4>
                <p className="mb-0 text-muted">Total Movimientos</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-success">
              <CardBody className="text-center">
                <i className="fas fa-arrow-up fa-2x text-success mb-2"></i>
                <h4 className="text-success mb-1">{reportsHelper.formatCurrency(totals.totalIncome)}</h4>
                <p className="mb-0 text-muted">Total Ingresos</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-danger">
              <CardBody className="text-center">
                <i className="fas fa-arrow-down fa-2x text-danger mb-2"></i>
                <h4 className="text-danger mb-1">{reportsHelper.formatCurrency(totals.totalExpense)}</h4>
                <p className="mb-0 text-muted">Total Egresos</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-info">
              <CardBody className="text-center">
                <i className="fas fa-balance-scale fa-2x text-info mb-2"></i>
                <h4 className="text-info mb-1">{reportsHelper.formatCurrency(totals.finalBalance)}</h4>
                <p className="mb-0 text-muted">Saldo Final</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabla de resultados */}
      {data.length > 0 && (
        <Row>
          <Col>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-table me-2"></i>
                  Detalle de Movimientos ({data.length} registros)
                </h5>
                <Button color="success" size="sm" onClick={exportToCSV}>
                  <i className="fas fa-file-excel me-2"></i>
                  Exportar CSV
                </Button>
              </CardHeader>
              <CardBody className="p-0">
                <div className="table-responsive">
                  <Table className="table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Cuenta</th>
                        <th>Nombre Tercero</th>
                        <th>No. Comprobante</th>
                        <th>Fecha</th>
                        <th className="text-end">Ingreso</th>
                        <th className="text-end">Egreso</th>
                        <th className="text-end">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">{row.accountNumber}</code>
                          </td>
                          <td>{row.thirdPartyName}</td>
                          <td>
                            <Badge
                              color={row.voucherNumber.startsWith("REC") ? "success" : "danger"}
                              className="font-monospace"
                            >
                              {row.voucherNumber}
                            </Badge>
                          </td>
                          <td>{reportsHelper.formatDate(row.date)}</td>
                          <td className="text-end">
                            <span className={reportsHelper.getAmountClass(row.income, "income")}>
                              {row.income > 0 ? reportsHelper.formatCurrency(row.income) : "-"}
                            </span>
                          </td>
                          <td className="text-end">
                            <span className={reportsHelper.getAmountClass(row.expense, "expense")}>
                              {row.expense > 0 ? reportsHelper.formatCurrency(row.expense) : "-"}
                            </span>
                          </td>
                          <td className="text-end">
                            <strong className="text-info">{reportsHelper.formatCurrency(row.balance)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-success">
                      <tr>
                        <th colSpan={4} className="text-center">
                          <strong>TOTALES</strong>
                        </th>
                        <th className="text-end">
                          <strong className="text-success">
                            {reportsHelper.formatCurrency(totals?.totalIncome || 0)}
                          </strong>
                        </th>
                        <th className="text-end">
                          <strong className="text-danger">
                            {reportsHelper.formatCurrency(totals?.totalExpense || 0)}
                          </strong>
                        </th>
                        <th className="text-end">
                          <strong className="text-info">
                            {reportsHelper.formatCurrency(totals?.finalBalance || 0)}
                          </strong>
                        </th>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Mensaje cuando no hay datos */}
      {!loading && data.length === 0 && !error && (
        <Row>
          <Col>
            <Card>
              <CardBody className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No se encontraron movimientos</h5>
                <p className="text-muted">
                  Selecciona una cuenta y haz clic en "Consultar" para ver los movimientos bancarios
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}
