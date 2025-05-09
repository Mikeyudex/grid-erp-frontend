"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Badge,
  Button,
  Input,
  InputGroup,
  Form,
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from "reactstrap"
import {
  Search,
  Filter,
  Download,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  FileUp,
} from "lucide-react"
import { UploadHelper } from "../helpers/upload-helper"
import moment from "moment"

// Datos de ejemplo para el histórico de cargues
const uploadHistoryData = [
  {
    id: 1,
    uploadDate: "2023-11-15T09:30:00",
    fileName: "productos_noviembre_2023.xlsx",
    operationType: "product_upload",
    status: "completed",
    completionDate: "2023-11-15T09:45:00",
    recordsProcessed: 156,
    recordsFailed: 0,
    uploadedBy: "admin@example.com",
  },
  {
    id: 2,
    uploadDate: "2023-11-10T14:20:00",
    fileName: "categorias_nuevas.csv",
    operationType: "category_upload",
    status: "completed",
    completionDate: "2023-11-10T14:25:00",
    recordsProcessed: 12,
    recordsFailed: 0,
    uploadedBy: "manager@example.com",
  },
  {
    id: 3,
    uploadDate: "2023-11-05T11:15:00",
    fileName: "productos_tapetes_premium.xlsx",
    operationType: "product_upload",
    status: "failed",
    completionDate: "2023-11-05T11:20:00",
    recordsProcessed: 0,
    recordsFailed: 45,
    uploadedBy: "admin@example.com",
    errorMessage: "Error en formato de archivo: columnas requeridas faltantes",
  },
  {
    id: 4,
    uploadDate: "2023-10-28T16:40:00",
    fileName: "actualizacion_precios.csv",
    operationType: "price_update",
    status: "completed",
    completionDate: "2023-10-28T16:50:00",
    recordsProcessed: 78,
    recordsFailed: 3,
    uploadedBy: "inventory@example.com",
  },
  {
    id: 5,
    uploadDate: "2023-10-20T10:25:00",
    fileName: "productos_nuevos_octubre.xlsx",
    operationType: "product_upload",
    status: "completed_with_errors",
    completionDate: "2023-10-20T10:40:00",
    recordsProcessed: 120,
    recordsFailed: 15,
    uploadedBy: "admin@example.com",
    errorMessage: "Algunos productos no pudieron ser procesados debido a datos incompletos",
  },
  {
    id: 6,
    uploadDate: "2023-10-15T13:45:00",
    fileName: "categorias_actualizadas.csv",
    operationType: "category_upload",
    status: "completed",
    completionDate: "2023-10-15T13:50:00",
    recordsProcessed: 8,
    recordsFailed: 0,
    uploadedBy: "manager@example.com",
  },
  {
    id: 7,
    uploadDate: "2023-10-10T09:10:00",
    fileName: "productos_descontinuados.xlsx",
    operationType: "product_update",
    status: "completed",
    completionDate: "2023-10-10T09:20:00",
    recordsProcessed: 25,
    recordsFailed: 0,
    uploadedBy: "inventory@example.com",
  },
  {
    id: 8,
    uploadDate: "2023-10-05T14:30:00",
    fileName: "nuevos_tapetes_octubre.xlsx",
    operationType: "product_upload",
    status: "processing",
    completionDate: null,
    recordsProcessed: null,
    recordsFailed: null,
    uploadedBy: "admin@example.com",
  },
  {
    id: 9,
    uploadDate: "2023-09-28T11:20:00",
    fileName: "actualizacion_stock.csv",
    operationType: "stock_update",
    status: "completed",
    completionDate: "2023-09-28T11:30:00",
    recordsProcessed: 200,
    recordsFailed: 0,
    uploadedBy: "inventory@example.com",
  },
  {
    id: 10,
    uploadDate: "2023-09-20T15:15:00",
    fileName: "productos_septiembre.xlsx",
    operationType: "product_upload",
    status: "completed",
    completionDate: "2023-09-20T15:30:00",
    recordsProcessed: 95,
    recordsFailed: 0,
    uploadedBy: "admin@example.com",
  },
  {
    id: 11,
    uploadDate: "2023-09-15T10:05:00",
    fileName: "categorias_septiembre.csv",
    operationType: "category_upload",
    status: "failed",
    completionDate: "2023-09-15T10:10:00",
    recordsProcessed: 0,
    recordsFailed: 10,
    uploadedBy: "manager@example.com",
    errorMessage: "Error en la estructura del archivo CSV",
  },
  {
    id: 12,
    uploadDate: "2023-09-10T13:40:00",
    fileName: "actualizacion_precios_septiembre.xlsx",
    operationType: "price_update",
    status: "completed_with_errors",
    completionDate: "2023-09-10T13:55:00",
    recordsProcessed: 150,
    recordsFailed: 5,
    uploadedBy: "admin@example.com",
    errorMessage: "Algunos precios no pudieron ser actualizados debido a restricciones de formato",
  },
]

const uploadHistoryHelper = new UploadHelper();


export default function UploadHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadHistoryData, setUploadHistoryData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filterStatus, setFilterStatus] = useState("")
  const [filterOperationType, setFilterOperationType] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("uploadDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [isLoading, setIsLoading] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

  useEffect(() => {
    uploadHistoryHelper.getUploadHistoryByUserId(localStorage.getItem("userId"))
      .then(data => {
        setFilteredData(data);
        setUploadHistoryData(data);
      })
      .catch(e => console.log(e))
      .finally(() => {
        setIsLoading(false);
      });
  }, [reloadTable])

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = [...uploadHistoryData]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.fileName.toLowerCase().includes(term) ||
          item.uploadedBy.toLowerCase().includes(term) ||
          (item.errorMessage && item.errorMessage.toLowerCase().includes(term)),
      )
    }

    // Aplicar filtro de estado
    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus)
    }

    // Aplicar filtro de tipo de operación
    if (filterOperationType) {
      console.log(filterOperationType);

      result = result.filter((item) => item.operationType === filterOperationType)
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let valueA = a[sortField]
      let valueB = b[sortField]

      // Manejar valores nulos para fechas de finalización
      if (sortField === "completionDate") {
        if (valueA === null) return sortDirection === "asc" ? -1 : 1
        if (valueB === null) return sortDirection === "asc" ? 1 : -1
      }

      // Ordenar por fecha
      if (sortField === "uploadDate" || sortField === "completionDate") {
        valueA = new Date(valueA || 0).getTime()
        valueB = new Date(valueB || 0).getTime()
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    setFilteredData(result)
    setCurrentPage(1)
  }, [searchTerm, filterStatus, filterOperationType, sortField, sortDirection])

  const handleSearch = (e) => {
    e.preventDefault()
    // La búsqueda ya se aplica en el useEffect
  }

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc") // Por defecto, ordenar descendente al cambiar de campo
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setReloadTable(!reloadTable);
  }

  const handleExport = () => {
    alert("Exportando datos a Excel...")
    // Aquí iría la lógica para exportar los datos
  }

  const handleNewUpload = () => {
    alert("Redirigiendo a la página de carga de archivos...")
    // Aquí iría la lógica para redirigir a la página de carga
  }

  // Función para obtener el color del badge según el estado
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "processing":
        return "primary"
      case "failed":
        return "danger"
      case "completed_with_errors":
        return "warning"
      default:
        return "secondary"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "processing":
        return "Procesando"
      case "failed":
        return "Fallido"
      case "completed_with_errors":
        return "Completado con errores"
      default:
        return "Desconocido"
    }
  }

  // Función para obtener el icono según el estado
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="me-1" />
      case "processing":
        return <Clock size={16} className="me-1" />
      case "failed":
        return <XCircle size={16} className="me-1" />
      case "completed_with_errors":
        return <AlertCircle size={16} className="me-1" />
      default:
        return null
    }
  }

  // Función para obtener el texto del tipo de operación
  const getOperationTypeText = (type) => {
    switch (type) {
      case "product_import":
        return "Cargue de Productos"
      case "category_import":
        return "Cargue de Categorías"
      default:
        return "Desconocido"
    }
  }

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return moment(dateString).format("LL")
  }

  // Calcular índices para paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="page-content">
      <Container fluid className="py-4 mb-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Histórico de Cargues</h1>
            <p className="text-muted mb-0">Registro de archivos procesados para carga y actualización de datos</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="light" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="me-2" /> Actualizando...
                </>
              ) : (
                <>
                  <RefreshCw size={18} className="me-2" /> Actualizar
                </>
              )}
            </Button>
           {/*  <Button color="primary" onClick={handleNewUpload}>
              <Upload size={18} className="me-2" /> Nuevo Cargue
            </Button> */}
          </div>
        </div>

        <Card className="shadow-sm mb-4">
          <CardHeader className="bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Filtros</h5>
              {/* <Button color="light" size="sm">
                <Filter size={16} className="me-2" /> Más Filtros
              </Button> */}
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6} className="mb-3 mb-md-0">
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Input
                      placeholder="Buscar por nombre de archivo o usuario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button color="primary">
                      <Search size={18} />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={3} className="mb-3 mb-md-0">
                <Input type="select" value={filterOperationType} onChange={(e) => setFilterOperationType(e.target.value)}>
                  <option value="">Todos los tipos de operación</option>
                  <option value="product_import">Cargue de Productos</option>
                  <option value="category_import">Cargue de Categorías</option>
                </Input>
              </Col>
              <Col md={3}>
                <Input type="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Todos los estados</option>
                  <option value="completed">Completado</option>
                  <option value="processing">Procesando</option>
                  <option value="failed">Fallido</option>
                  {/*  <option value="completed_with_errors">Completado con errores</option> */}
                </Input>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card className="shadow-sm mb-4">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th
                    style={{ cursor: "pointer", width: "18%" }}
                    onClick={() => handleSort("uploadDate")}
                    className="position-relative"
                  >
                    <div className="d-flex align-items-center">
                      <Calendar size={16} className="me-2" />
                      Fecha de Subida
                      {sortField === "uploadDate" && <span className="ms-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th style={{ width: "20%" }}>
                    <div className="d-flex align-items-center">
                      <FileText size={16} className="me-2" />
                      Nombre del Archivo
                    </div>
                  </th>
                  <th style={{ width: "18%" }}>
                    <div className="d-flex align-items-center">
                      <FileUp size={16} className="me-2" />
                      Tipo de Operación
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", width: "14%" }}
                    onClick={() => handleSort("status")}
                    className="position-relative"
                  >
                    <div className="d-flex align-items-center">
                      Estado
                      {sortField === "status" && <span className="ms-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", width: "18%" }}
                    onClick={() => handleSort("completionDate")}
                    className="position-relative"
                  >
                    <div className="d-flex align-items-center">
                      <Clock size={16} className="me-2" />
                      Fecha de Finalización
                      {sortField === "completionDate" && (
                        <span className="ms-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                  <th style={{ width: "12%" }} className="text-center">
                    Registros
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.uploadDate)}</td>
                      <td>
                        <div className="fw-medium">{item.fileName}</div>
                        {/*  <small className="text-muted">{item.uploadedBy}</small> */}
                      </td>
                      <td>{getOperationTypeText(item.operationType)}</td>
                      <td>
                        <Badge color={getStatusBadgeColor(item.status)} className="d-flex align-items-center w-75">
                          {getStatusIcon(item.status)}
                          {getStatusText(item.status)}
                        </Badge>
                        {item.errorMessage && (
                          <small className="text-danger d-block mt-1">
                            <AlertCircle size={12} className="me-1" />
                            Error: {item.errorMessage.substring(0, 30)}
                            {item.errorMessage.length > 30 ? "..." : ""}
                          </small>
                        )}
                      </td>
                      <td>{formatDate(item.completionDate)}</td>
                      <td className="text-center">
                        {item.recordsProcessed !== null ? (
                          <div>
                            <span className="fw-medium text-success">{item.recordsProcessed}</span>
                            {item.recordsFailed > 0 && (
                              <span className="text-danger ms-2">/ {item.recordsFailed} errores</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">No se encontraron registros con los filtros aplicados</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length}{" "}
            registros
          </div>

          <div className="d-flex align-items-center">
            <div className="me-3 d-flex align-items-center">
              <span className="text-muted me-2">Mostrar</span>
              <Input
                type="select"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                style={{ width: "70px" }}
                bsSize="sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </Input>
            </div>

         {/*    <Button color="light" className="me-3" onClick={handleExport}>
              <Download size={18} className="me-2" /> Exportar
            </Button>
 */}
            <Pagination size="sm" className="mt-2">
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink previous onClick={() => paginate(currentPage - 1)}>
                  <ChevronLeft size={16} />
                </PaginationLink>
              </PaginationItem>

              {/* Mostrar solo un subconjunto de páginas si hay muchas */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((number) => {
                  if (totalPages <= 5) return true
                  if (number === 1 || number === totalPages) return true
                  if (Math.abs(number - currentPage) <= 1) return true
                  return false
                })
                .map((number, index, array) => {
                  // Agregar elipsis si hay saltos en la numeración
                  if (index > 0 && array[index - 1] !== number - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${number}`}>
                        <PaginationItem disabled>
                          <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                        <PaginationItem active={number === currentPage}>
                          <PaginationLink onClick={() => paginate(number)}>{number}</PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    )
                  }
                  return (
                    <PaginationItem key={number} active={number === currentPage}>
                      <PaginationLink onClick={() => paginate(number)}>{number}</PaginationLink>
                    </PaginationItem>
                  )
                })}

              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink next onClick={() => paginate(currentPage + 1)}>
                  <ChevronRight size={16} />
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </Container>
    </div>
  )
}
