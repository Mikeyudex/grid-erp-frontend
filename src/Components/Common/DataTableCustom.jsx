"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Input,
  Badge,
  FormGroup,
  Spinner,
  Alert,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import { FaEdit, FaTrash, FaSave, FaTimes, FaCheck } from "react-icons/fa"
import { RefreshCw, Trash } from "lucide-react"
import { numberFormatPrice } from "../../pages/GridErp/Products/helper/product_helper"

const DataTable = ({
  data = [],
  columns = [],
  onUpdate,
  onDelete,
  onBulkDelete,
  title = "Data Table",
  loading = false,
  error = null,
  itemsPerPage = 10,
  searchable = true,
  refreshData = null,
  onClickEditRow = null,
}) => {
  // Estados
  const [tableData, setTableData] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [editData, setEditData] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteModal, setDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false)

  // Efecto para actualizar los datos de la tabla cuando cambian los datos de entrada
  useEffect(() => {
    setTableData(data)
  }, [data])

  // Manejo de paginación
  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Filtrado de datos
  const filteredData = tableData.filter((item) => {
    if (!searchTerm) return true

    // Buscar en todas las columnas visibles
    return columns.some((column) => {
      if (!column.searchable) return false
      const value = item[column.key]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  // Manejo de edición
  const handleEdit = (row) => {
    if (onClickEditRow) {
      onClickEditRow(row._id)
      return
    }
    setEditingRow(row._id)
    setEditData({ ...row })
  }

  const handleEditChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    try {
      if (onUpdate) {
        await onUpdate(editData)
      }

      // Actualizar datos localmente
      setTableData((prev) => prev.map((item) => (item._id === editData._id ? editData : item)))

      setEditingRow(null)
      setEditData({})
    } catch (error) {
      console.error("Error al guardar:", error)
    }
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditData({})
  }

  // Manejo de eliminación
  const confirmDelete = (item) => {
    setItemToDelete(item)
    setDeleteModal(true)
  }

  const handleDelete = async () => {
    try {
      if (onDelete && itemToDelete) {
        await onDelete(itemToDelete._id)

        // Actualizar datos localmente
        setTableData((prev) => prev.filter((item) => item._id !== itemToDelete._id))
      }

      setDeleteModal(false)
      setItemToDelete(null)
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

  // Manejo de selección
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentItems.map((item) => item._id))
    }
    setSelectAll(!selectAll)
  }

  // Eliminación en bulk
  const handleBulkDelete = async () => {
    try {
      if (onBulkDelete && selectedRows.length > 0) {
        await onBulkDelete(selectedRows)

        // Actualizar datos localmente
        setTableData((prev) => prev.filter((item) => !selectedRows.includes(item._id)))
        setSelectedRows([])
        setSelectAll(false)
      }

      setBulkDeleteModal(false)
    } catch (error) {
      console.error("Error al eliminar en bulk:", error)
    }
  }

  // Renderizado de celdas
  const renderCell = (item, column) => {
    const isEditing = editingRow === item._id
    const value = item[column.key]

    if (isEditing && column.editable) {
      switch (column.type) {
        case "text":
          return (
            <Input
              type="text"
              value={editData[column.key] || ""}
              onChange={(e) => handleEditChange(column.key, e.target.value)}
              bsSize="sm"
            />
          )
        case "number":
          return (
            <Input
              type="number"
              value={editData[column.key]}
              onChange={(e) => handleEditChange(column.key, Number.parseFloat(e.target.value))}
              bsSize="sm"
            />
          )
        case "price":
          return (
            <Input
              type="number"
              value={editData[column.key]}
              onChange={(e) => handleEditChange(column.key, Number.parseFloat(e.target.value))}
              bsSize="sm"
            />
          )
        case "boolean":
          return (
            <FormGroup check className="text-center">
              <Input
                type="checkbox"
                checked={editData[column.key] || false}
                onChange={(e) => handleEditChange(column.key, e.target.checked)}
              />
            </FormGroup>
          )
        case "select":
          return (
            <FormGroup>
              <Input
                type="select"
                value={editData[column.key] || ""}
                onChange={(e) => handleEditChange(column.key, e.target.value)}
                bsSize="sm"
              >
                {column.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          )
        default:
          return value
      }
    }

    // Renderizado normal (no edición)
    switch (column.type) {
      case "boolean":
        return (
          <div className="text-center">
            {value ? (
              <Badge color="success" pill>
                <FaCheck />
              </Badge>
            ) : (
              <Badge color="danger" pill>
                <FaTimes />
              </Badge>
            )}
          </div>
        )
      case "date":
        return value ? new Date(value).toLocaleDateString() : "-"
      case "percentage":
        return `${value}%`
      case "price":
        return numberFormatPrice(value)
      default:
        return value ?? "-"
    }
  }

  // Renderizado de acciones
  const renderActions = (item) => {
    const isEditing = editingRow === item._id

    if (isEditing) {
      return (
        <div className="d-flex">
          <Button color="success" size="sm" className="me-1" onClick={handleSave} id={`save-${item._id}`}>
            <FaSave />
          </Button>


          <Button color="secondary" size="sm" onClick={handleCancel} id={`cancel-${item._id}`}>
            <FaTimes />
          </Button>
        </div>
      )
    }

    return (
      <div className="d-flex">
        <Button color="primary" size="sm" className="me-1" onClick={() => handleEdit(item)} title="Editar">
          <FaEdit />
        </Button>


        <Button color="danger" size="sm" onClick={() => confirmDelete(item)} title="Eliminar">
          <FaTrash />
        </Button>

      </div>
    )
  }

  return (
    <div className="data-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{title}</h3>
        <div className="d-flex">
          {searchable && (
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
              style={{ width: "200px" }}
            />
          )}

          {refreshData && (
            <Button title="Actualizar" color="info" className="d-flex align-items-center gap-2 me-2" onClick={refreshData}>
              <RefreshCw size={18} />
            </Button>
          )}

          {selectedRows.length > 0 && (
            <Button title="Eliminar seleccionados" color="danger" className="d-flex align-items-center gap-2 me-2" onClick={() => setBulkDeleteModal(true)}>
              <Trash size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* {error && <Alert color="danger">{error}</Alert>} */}

      {loading ? (
        <div className="text-center my-5">
          <Spinner color="primary" />
          <p className="mt-2">Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <FormGroup check>
                      <Input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </FormGroup>
                  </th>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th style={{ width: "100px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="text-center">
                      No hay datos disponibles
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item._id} className={selectedRows.includes(item._id) ? "table-active" : ""}>
                      <td>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            checked={selectedRows.includes(item._id)}
                            onChange={() => toggleSelectRow(item._id)}
                          />
                        </FormGroup>
                      </td>
                      {columns.map((column) => (
                        <td key={`${item._id}-${column.key}`}>{renderCell(item, column)}</td>
                      ))}
                      <td>{renderActions(item)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de{" "}
                {filteredData.length} registros
              </div>
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
                </PaginationItem>

                {[...Array(totalPages).keys()].map((number) => {
                  // Mostrar solo 5 páginas alrededor de la página actual
                  if (
                    number + 1 === 1 ||
                    number + 1 === totalPages ||
                    (number + 1 >= currentPage - 2 && number + 1 <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={number} active={currentPage === number + 1}>
                        <PaginationLink onClick={() => setCurrentPage(number + 1)}>{number + 1}</PaginationLink>
                      </PaginationItem>
                    )
                  }
                  // Mostrar puntos suspensivos para páginas omitidas
                  if (
                    (number + 1 === currentPage - 3 && currentPage > 4) ||
                    (number + 1 === currentPage + 3 && currentPage < totalPages - 3)
                  ) {
                    return (
                      <PaginationItem key={number} disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink last onClick={() => setCurrentPage(totalPages)} />
                </PaginationItem>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación para eliminación individual */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Confirmar eliminación</ModalHeader>
        <ModalBody>
          ¿Está seguro que desea eliminar este registro?
          {itemToDelete && (
            <div className="mt-2">
              <strong>Nombre:</strong> {itemToDelete?.name ?? itemToDelete?.tipo_material ?? itemToDelete?.label}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancelar
          </Button>
          <Button color="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de confirmación para eliminación en bulk */}
      <Modal isOpen={bulkDeleteModal} toggle={() => setBulkDeleteModal(!bulkDeleteModal)}>
        <ModalHeader toggle={() => setBulkDeleteModal(!bulkDeleteModal)}>Confirmar eliminación múltiple</ModalHeader>
        <ModalBody>
          ¿Está seguro que desea eliminar {selectedRows.length} registros seleccionados? Esta acción no se puede
          deshacer.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setBulkDeleteModal(false)}>
            Cancelar
          </Button>
          <Button color="danger" onClick={handleBulkDelete}>
            Eliminar seleccionados
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default DataTable
