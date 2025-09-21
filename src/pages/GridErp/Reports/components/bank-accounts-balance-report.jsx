"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, CardBody, CardHeader, Table, Badge, Alert, Spinner } from "reactstrap"
import { ReportsHelper } from "../helpers/report-helper"

const BankAccountsBalanceReport = () => {
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totals, setTotals] = useState({
    accountsCount: 0,
    totalBalance: 0,
  })

  const reportsHelper = new ReportsHelper()

  useEffect(() => {
    loadReport()
  }, [])

  const loadReport = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await reportsHelper.getBankAccountsBalanceReport()

      if (response.success) {
        setReportData(response.data)
        const calculatedTotals = reportsHelper.calculateBankAccountsTotals(response.data)
        setTotals(calculatedTotals)
      } else {
        setError("Error al cargar el reporte de saldos bancarios")
      }
    } catch (err) {
      console.error("Error loading bank accounts balance report:", err)
      setError("Error al cargar el reporte de saldos bancarios")
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Cuenta", "Banco", "Tipo", "Nombre de la Cuenta", "Saldo"]
    const csvData = [
      headers,
      ...reportData.map((row) => [row.accountNumber, row.bankName, row.accountType, row.accountName, row.balance]),
      ["", "", "", "TOTAL", totals.totalBalance],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `saldos_bancarios_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-3">Cargando reporte de saldos bancarios...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-university me-2"></i>
                Reporte de Saldos de Cuentas Bancarias
              </h4>
              <button className="btn btn-light btn-sm" onClick={exportToCSV} disabled={reportData.length === 0}>
                <i className="fas fa-download me-1"></i>
                Exportar CSV
              </button>
            </CardHeader>
            <CardBody>
              {error && (
                <Alert color="danger" className="mb-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Estadísticas Generales */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border-primary">
                    <CardBody className="text-center">
                      <h3 className="text-primary mb-1">{totals.accountsCount}</h3>
                      <p className="text-muted mb-0">
                        <i className="fas fa-credit-card me-1"></i>
                        Total de Cuentas
                      </p>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-success">
                    <CardBody className="text-center">
                      <h3 className="text-success mb-1">{reportsHelper.formatCurrency(totals.totalBalance)}</h3>
                      <p className="text-muted mb-0">
                        <i className="fas fa-coins me-1"></i>
                        Saldo Total
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Distribución por Tipo de Cuenta */}
              <Row className="mb-4">
                <Col>
                  <Card className="border-info">
                    <CardHeader className="bg-light text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-chart-pie me-2"></i>
                        Distribución por Tipo de Cuenta
                      </h6>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={6}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>
                              <Badge color="primary" className="me-2">
                                Cuenta Corriente
                              </Badge>
                            </span>
                            <span className="fw-bold">
                              {reportData.filter((account) => account.accountType === "Cuenta Corriente").length}{" "}
                              cuentas
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>
                              <Badge color="info" className="me-2">
                                Cuenta de Ahorros
                              </Badge>
                            </span>
                            <span className="fw-bold">
                              {reportData.filter((account) => account.accountType === "Cuenta de Ahorros").length}{" "}
                              cuentas
                            </span>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">Saldo Cuentas Corrientes:</span>
                            <span className="fw-bold text-primary">
                              {reportsHelper.formatCurrency(
                                reportData
                                  .filter((account) => account.accountType === "Cuenta Corriente")
                                  .reduce((sum, account) => sum + account.balance, 0),
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Saldo Cuentas de Ahorros:</span>
                            <span className="fw-bold text-info">
                              {reportsHelper.formatCurrency(
                                reportData
                                  .filter((account) => account.accountType === "Cuenta de Ahorros")
                                  .reduce((sum, account) => sum + account.balance, 0),
                              )}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Tabla de Cuentas Bancarias */}
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Cuenta</th>
                      <th>Banco</th>
                      <th>Tipo</th>
                      <th>Nombre de la Cuenta</th>
                      <th className="text-end">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((account, index) => (
                      <tr key={index}>
                        <td>
                          <code className="bg-light px-2 py-1 rounded">{account.accountNumber}</code>
                        </td>
                        <td>
                          <strong>{account.bankName}</strong>
                        </td>
                        <td>
                          <Badge color={account.accountType === "Cuenta Corriente" ? "primary" : "info"}>
                            {account.accountType}
                          </Badge>
                        </td>
                        <td className="text-muted">{account.accountName}</td>
                        <td className={`text-end ${reportsHelper.getBalanceClass(account.balance)}`}>
                          {reportsHelper.formatCurrency(account.balance)}
                        </td>
                      </tr>
                    ))}
                    {reportData.length > 0 && (
                      <tr className="table-success fw-bold">
                        <td colSpan={4} className="text-end">
                          <strong>TOTAL GENERAL:</strong>
                        </td>
                        <td className="text-end">
                          <strong>{reportsHelper.formatCurrency(totals.totalBalance)}</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {reportData.length === 0 && !loading && (
                <div className="text-center py-5">
                  <i className="fas fa-university fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No se encontraron cuentas bancarias registradas</p>
                </div>
              )}

              {/* Leyenda de Colores para Saldos */}
              {reportData.length > 0 && (
                <Row className="mt-4">
                  <Col>
                    <Card className="border-light">
                      <CardBody>
                        <h6 className="mb-3">
                          <i className="fas fa-info-circle me-2"></i>
                          Leyenda de Saldos
                        </h6>
                        <Row>
                          <Col md={3}>
                            <div className="d-flex align-items-center mb-2">
                              <div className="bg-success rounded me-2" style={{ width: "12px", height: "12px" }}></div>
                              <small>Saldo Alto (≥ $30M)</small>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="d-flex align-items-center mb-2">
                              <div className="bg-warning rounded me-2" style={{ width: "12px", height: "12px" }}></div>
                              <small>Saldo Medio ($15M - $30M)</small>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="d-flex align-items-center mb-2">
                              <div className="bg-info rounded me-2" style={{ width: "12px", height: "12px" }}></div>
                              <small>Saldo Normal ($5M - $15M)</small>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="d-flex align-items-center mb-2">
                              <div className="bg-danger rounded me-2" style={{ width: "12px", height: "12px" }}></div>
                              <small>Saldo Bajo ({"<"} $5M)</small>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BankAccountsBalanceReport
