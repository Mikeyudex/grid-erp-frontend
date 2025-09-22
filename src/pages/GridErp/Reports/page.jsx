import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, Button } from "reactstrap"
import { useNavigate } from "react-router-dom";
import { TrendingUp, FileText, Package, CreditCard, DollarSign, BarChart3, Truck } from "lucide-react"
import { TopLayoutGeneralView } from "../../../Components/Common/TopLayoutGeneralView"

export default function ReportsPage() {
  document.title = "Reportes | Quality";
  const navigate = useNavigate();
  const reports = [
    {
      id: "ventas-acumuladas",
      title: "Ventas Acumuladas",
      description: "Reporte consolidado de ventas por sede y asesor",
      icon: TrendingUp,
      color: "primary",
      href: "/reports-cumulative-sales",
    },
    {
      id: "ventas-detalladas",
      title: "Ventas Detalladas",
      description: "Reporte detallado de ventas por factura",
      icon: FileText,
      color: "info",
      href: "/reports-detailed-sales",
    },
    {
      id: "ventas-por-producto",
      title: "Ventas por Producto",
      description: "Análisis detallado de ventas segmentado por productos, tipos y materiales",
      icon: Package,
      color: "success",
      href: "/reports-product-sales",
    },
    {
      id: "cuentas-por-cobrar",
      title: "CXC - Consolidado por Cliente",
      description: "Reporte consolidado de cuentas por cobrar por cliente",
      icon: CreditCard,
      color: "warning",
      href: "/reports-receivables",
    },
    {
      id: "cuentas-por-cobrar-detallado",
      title: "CXC - Detallado por Pedidos",
      description: "Reporte consolidado de cuentas por cobrar por cliente",
      icon: FileText,
      color: "danger",
      href: "/reports-receivables-detailed",
    },
    {
      title: "Saldos Bancarios",
      description: "Reporte de saldos de todas las cuentas bancarias",
      icon: DollarSign,
      color: "secondary",
      href: "/reports-bank-accounts-balance",
    },
    {
      title: "Movimientos Bancarios",
      description: "Reporte detallado de movimientos por cuenta bancaria",
      icon: BarChart3,
      color: "dark",
      href: "/reports-bank-movements",
    },
    {
      title: "Rótulos de Envío",
      description: "Generador de rótulos de envío para clientes",
      icon: Truck,
      color: "primary",
      href: "/reports-shipping-labels",
    },

  ]

  return (
    <TopLayoutGeneralView
      titleBreadcrumb="Módulo de Reportes"
      pageTitleBreadcrumb="Reportes"
      to="/"
      main={
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <Card>
                <CardBody>
                  <h2 className="mb-0">Centro de Reportes</h2>
                  <p className="text-muted mb-0">Seleccione el reporte que desea generar</p>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            {reports.map((report, index) => {
              const IconComponent = report.icon
              return (
                <Col key={index} lg={3} md={4} sm={6} className="mb-4">
                  <Link href={report.href} className="text-decoration-none">
                    <Card className="h-100 shadow-sm hover-card">
                      <CardBody className="text-center">
                        <div className={`text-${report.color} mb-3`}>
                          <IconComponent size={48} />
                        </div>
                        <h5 className={`text-${report.color} mb-2`}>{report.title}</h5>
                        <p className="text-muted small mb-0">{report.description}</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              )
            })}
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
