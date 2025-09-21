import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap"
import { TopLayoutGeneralView } from "../../../Components/Common/TopLayoutGeneralView"
import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
  document.title = "Reportes | Quality";
  const navigate = useNavigate();
  const reports = [
    {
      id: "ventas-acumuladas",
      title: "Ventas Acumuladas",
      description: "Reporte consolidado de ventas por sede y asesor en un período específico",
      icon: "mdi-chart-line",
      color: "primary",
      path: "/reports-cumulative-sales",
    },
    {
      id: "ventas-detalladas",
      title: "Ventas Detalladas",
      description: "Reporte detallado de todas las ventas con información completa por transacción",
      icon: "mdi-chart-line-variant",
      color: "success",
      path: "/reports-detailed-sales",
    },
    {
      id: "ventas-por-producto",
      title: "Ventas por Producto",
      description: "Análisis detallado de ventas segmentado por productos, tipos y materiales",
      icon: "mdi-package-variant",
      color: "info",
      path: "/reports-product-sales",
    },
    {
      id: "cuentas-por-cobrar",
      title: "CXC - Consolidado por Cliente",
      description: "Reporte de facturas pendientes por cobrar consolidado por cliente",
      icon: "mdi-currency-usd",
      color: "warning",
      path: "/reports-receivables",
    },
    {
      id: "cuentas-por-cobrar-detallado",
      title: "Cuentas por Cobrar - Detallado",
      description: "Reporte detallado de facturas pendientes por cobrar con información individual",
      icon: "mdi-currency-usd",
      color: "danger",
      path: "/reports-receivables-detailed",
    },
    {
      title: "Saldos Bancarios",
      description: "Reporte de saldos actuales de todas las cuentas bancarias registradas",
      icon: "mdi-bank",
      color: "secondary",
      path: "/reports-bank-accounts-balance",
    },

  ]

  return (
    <TopLayoutGeneralView
      titleBreadcrumb="Módulo de Reportes"
      pageTitleBreadcrumb="Reportes"
      to="/"
      main={
        <Container fluid className="py-4">
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" className="mb-0">
                    <i className="mdi mdi-chart-box me-2"></i>
                    Reportes Disponibles
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    {reports.map((report) => (
                      <Col md="6" lg="4" key={report.id} className="mb-4">
                        <Card className={`h-100 ${report.disabled ? "opacity-50" : ""}`}>
                          <CardBody className="text-center">
                            <div className={`avatar-lg mx-auto mb-3`}>
                              <div className={`avatar-title rounded-circle bg-${report.color} text-white`}>
                                <i className={`mdi ${report.icon} display-6`}></i>
                              </div>
                            </div>
                            <h5 className="card-title">{report.title}</h5>
                            <p className="card-text text-muted">{report.description}</p>
                            <Button
                              color={report.color}
                              disabled={report.disabled}
                              className="mt-auto"
                              onClick={() => navigate(report.path)}
                            >
                              {report.disabled ? "Próximamente" : "Ver Reporte"}
                              {!report.disabled && <i className="mdi mdi-arrow-right ms-2"></i>}
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
        </Container>
      }
    />
  )
}
