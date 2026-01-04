"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, CardBody, Button, Badge, ListGroup, ListGroupItem } from "reactstrap"
import {
  Package,
  Grid3X3,
  ArrowLeft,
  ChevronRight,
  Check,
  Layers,
  Palette,
  Ruler,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react"
import BreadCrumb from "../components/BreadCrumb"

export default function SeleccionTipoProducto() {
  const navigate = useNavigate()
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)

  const handleSeleccionTipo = (tipo) => {
    setTipoSeleccionado(tipo)
  }

  const handleContinuar = () => {
    if (tipoSeleccionado === "general") {
      navigate("/products/create")
    } else if (tipoSeleccionado === "tapete") {
      navigate("/products/create-tapete")
    }
  }

  const handleVolver = () => {
    navigate("/products/list-v2")
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Seleccionar tipo de producto" pageTitle="Productos" to={`/products/list`} />
        {/* Encabezado */}
        <div className="text-center mb-2">
          <h2 className="display-6 fw-bold mb-3">Crear Nuevo Producto</h2>
          {/* <p className="lead text-muted">Seleccione el tipo de producto que desea crear para continuar con el proceso</p> */}
        </div>

        <Row className="justify-content-center mb-2">
          <Col lg={10}>
            <Row className="g-4">

              {/* Opción de Producto Tapete */}
              <Col md={6}>
                <Card
                  className={`h-80 shadow-sm border-2 ${tipoSeleccionado === "tapete" ? "border-primary" : "border-light"
                    }`}
                  onClick={() => handleSeleccionTipo("tapete")}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  <CardBody className="p-4">
                    <div className="text-center mb-4">
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${tipoSeleccionado === "tapete" ? "bg-primary text-white" : "bg-light"
                          }`}
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Grid3X3 size={40} />
                      </div>
                      <h3 className="fw-bold">Producto Tapete</h3>
                      <Badge color="primary" className="mb-3">
                        Configuración Especializada
                      </Badge>
                    </div>

                  {/*   <p className="text-muted mb-4">
                      Cree un producto de tipo tapete con configuraciones específicas de material, tipo, piezas y otras
                      características propias de los tapetes personalizados.
                    </p>
 */}
                    <ListGroup flush className="mb-4">
                      <ListGroupItem className="border-0 px-0 py-2 d-flex align-items-center">
                        <Check size={18} className="text-success me-2" />
                        <span>Configuración de materiales y tipos</span>
                      </ListGroupItem>
                      <ListGroupItem className="border-0 px-0 py-2 d-flex align-items-center">
                        <Check size={18} className="text-success me-2" />
                        <span>Gestión de piezas y medidas</span>
                      </ListGroupItem>
                      <ListGroupItem className="border-0 px-0 py-2 d-flex align-items-center">
                        <Check size={18} className="text-success me-2" />
                        <span>Precios según matriz de configuración</span>
                      </ListGroupItem>
                    </ListGroup>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <div className="me-3 d-flex align-items-center">
                          <Layers size={16} className="text-muted me-1" />
                          <small className="text-muted">Materiales</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <Palette size={16} className="text-muted me-1" />
                          <small className="text-muted">Personalizable</small>
                        </div>
                      </div>
                      {tipoSeleccionado === "tapete" && <Check size={24} className="text-primary" />}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Opción de Producto General */}
              <Col md={6}>
                <Card
                  className={`h-80 shadow-sm border-2 ${tipoSeleccionado === "general" ? "border-primary" : "border-light"
                    }`}
                  onClick={() => handleSeleccionTipo("general")}
                  style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  <CardBody className="p-4">
                    <div className="text-center mb-4">
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ${tipoSeleccionado === "general" ? "bg-primary text-white" : "bg-light"
                          }`}
                        style={{ width: "80px", height: "80px" }}
                      >
                        <Package size={40} />
                      </div>
                      <h3 className="fw-bold">Producto General</h3>
                      <Badge color="secondary" className="mb-3">
                        Inventario Estándar
                      </Badge>
                    </div>

                 {/*    <p className="text-muted mb-4">
                      Cree un producto estándar para su inventario general. Ideal para accesorios, herramientas y otros
                      productos que no requieren configuraciones específicas de tapetes.
                    </p> */}

                    <ListGroup flush className="mb-4">
                      <ListGroupItem className="border-0 px-0 py-2 d-flex align-items-center">
                        <Check size={18} className="text-success me-2" />
                        <span>Gestión de inventario simple</span>
                      </ListGroupItem>
                      <ListGroupItem className="border-0 px-0 py-2 d-flex align-items-center">
                        <Check size={18} className="text-success me-2" />
                        <span>Precios y descuentos estándar</span>
                      </ListGroupItem>
                      <ListGroupItem className="border-0 px-0 py-2 d-flex align-items-center">
                        <Check size={18} className="text-success me-2" />
                        <span>Categorización flexible</span>
                      </ListGroupItem>
                    </ListGroup>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <div className="me-3 d-flex align-items-center">
                          <Tag size={16} className="text-muted me-1" />
                          <small className="text-muted">SKU simple</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <ShoppingBag size={16} className="text-muted me-1" />
                          <small className="text-muted">Inventario</small>
                        </div>
                      </div>
                      {tipoSeleccionado === "general" && <Check size={24} className="text-primary" />}
                    </div>
                  </CardBody>
                </Card>
              </Col>

            </Row>
          </Col>
        </Row>


        {/* Botones de acción */}
        <div className="d-flex justify-content-center">
          <Button color="light" onClick={handleVolver} className="me-2">
            <ArrowLeft size={18} className="me-2" /> Volver
          </Button>
          <Button
            color="primary"
            onClick={handleContinuar}
            disabled={!tipoSeleccionado}
            className="d-flex align-items-center"
          >
            Continuar <ChevronRight size={18} className="ms-2" />
          </Button>
        </div>
      </Container>
    </div>
  )
}
