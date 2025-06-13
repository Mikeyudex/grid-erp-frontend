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
import { FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaSort, FaSortUp, FaSortDown, FaColumns, FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
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
  onClickInfoRow = null,
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
  const [visibleColumns, setVisibleColumns] = useState([])
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

  // Efecto para actualizar los datos de la tabla cuando cambian los datos de entrada
  useEffect(() => {
    setTableData(data)
  }, [data])

  // Efecto para inicializar columnas visibles
  useEffect(() => {
    if (columns.length > 0 && visibleColumns.length === 0) {
      // Por defecto, todas las columnas están visibles
      setVisibleColumns(columns.map((col) => col.key))
    }
  }, [columns])

  // Manejo de paginación
  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Manejo de ordenamiento
  const handleSort = (columnKey) => {
    const column = columns.find((col) => col.key === columnKey)
    if (!column || !column.sortable) return

    let direction = "asc"
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc"
    } else if (sortConfig.key === columnKey && sortConfig.direction === "desc") {
      direction = null
    }

    setSortConfig({ key: columnKey, direction })
  }

  const getSortedData = (data) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data
    }

    const column = columns.find((col) => col.key === sortConfig.key)
    if (!column) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      // Manejar valores nulos/undefined
      if (aValue === null || aValue === undefined) return sortConfig.direction === "asc" ? 1 : -1
      if (bValue === null || bValue === undefined) return sortConfig.direction === "asc" ? -1 : 1

      let comparison = 0

      switch (column.type) {
        case "number":
        case "percentage":
          comparison = Number(aValue) - Number(bValue)
          break
        case "date":
          comparison = new Date(aValue) - new Date(bValue)
          break
        case "boolean":
          comparison = aValue === bValue ? 0 : aValue ? -1 : 1
          break
        default:
          // Texto
          comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase())
      }

      return sortConfig.direction === "asc" ? comparison : -comparison
    })
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="ms-1 text-muted" style={{ fontSize: "0.8em" }} />
    }

    if (sortConfig.direction === "asc") {
      return <FaSortUp className="ms-1 text-primary" style={{ fontSize: "0.8em" }} />
    } else if (sortConfig.direction === "desc") {
      return <FaSortDown className="ms-1 text-primary" style={{ fontSize: "0.8em" }} />
    }

    return <FaSort className="ms-1 text-muted" style={{ fontSize: "0.8em" }} />
  }

  // Aplicar ordenamiento antes del filtrado
  const sortedData = getSortedData(tableData)

  // Filtrado de datos (usar sortedData en lugar de tableData)
  const filteredData = sortedData.filter((item) => {
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


  // Manejo de visibilidad de columnas
  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnKey)) {
        // No permitir ocultar todas las columnas
        if (prev.length === 1) return prev
        return prev.filter((key) => key !== columnKey)
      } else {
        return [...prev, columnKey]
      }
    })
  }

  const showAllColumns = () => {
    setVisibleColumns(columns.map((col) => col.key))
  }

  const hideAllColumns = () => {
    // Mantener al menos una columna visible
    if (columns.length > 0) {
      setVisibleColumns([columns[0].key])
    }
  }

  // Filtrar columnas visibles
  const getVisibleColumns = () => {
    return columns.filter((column) => visibleColumns.includes(column.key))
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

        {
          onClickInfoRow &&
          <Button color="info" size="sm" className="me-1" onClick={() => onClickInfoRow(item)} title="Ver detalles">
            <FaInfoCircle />
          </Button>
        }

        <Button color="primary" size="sm" className="me-1" onClick={() => handleEdit(item)} title="Editar">
          <FaEdit />
        </Button>


        <Button color="danger" size="sm" onClick={() => confirmDelete(item)} title="Eliminar">
          <FaTrash />
        </Button>

      </div>
    )
  }

  // Agregar estilos inline para los headers ordenables
  const sortableHeaderStyle = `
    .sortable-header:hover {
      background-color: #f8f9fa;
    }
    .sortable-header {
      transition: background-color 0.2s ease;
    }
  `

  return (
    <div className="data-table-container">
      <style>{sortableHeaderStyle}</style>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h3>{title}</h3>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {searchable && (
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px" }}
            />
          )}

          {/* Selector de columnas */}
          <Dropdown isOpen={columnDropdownOpen} toggle={() => setColumnDropdownOpen(!columnDropdownOpen)}>
            <DropdownToggle caret color="outline-secondary" size="sm">
              <FaColumns className="me-1" />
              Columnas ({visibleColumns.length}/{columns.length})
            </DropdownToggle>
            <DropdownMenu end style={{ minWidth: "250px", maxHeight: "300px", overflowY: "auto" }}>
              <DropdownItem header>Seleccionar columnas</DropdownItem>
              <DropdownItem divider />

              <div className="px-3 py-2">
                <div className="d-flex justify-content-between mb-2">
                  <Button color="link" size="sm" className="p-0 text-decoration-none" onClick={showAllColumns}>
                    <FaEye className="me-1" />
                    Mostrar todas
                  </Button>
                  <Button color="link" size="sm" className="p-0 text-decoration-none" onClick={hideAllColumns}>
                    <FaEyeSlash className="me-1" />
                    Ocultar todas
                  </Button>
                </div>
              </div>

              <DropdownItem divider />

              {columns.map((column) => (
                <DropdownItem key={column.key} toggle={false} className="py-1">
                  <FormGroup check className="mb-0">
                    <Input
                      type="checkbox"
                      checked={visibleColumns.includes(column.key)}
                      onChange={() => toggleColumnVisibility(column.key)}
                      disabled={visibleColumns.length === 1 && visibleColumns.includes(column.key)}
                    />
                    <span className="ms-2">{column.label}</span>
                  </FormGroup>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {refreshData && (
            <Button color="info" onClick={refreshData} size="sm">
              <RefreshCw size={18} />
            </Button>
          )}

          {selectedRows.length > 0 && (
            <Button color="danger" onClick={() => setBulkDeleteModal(true)} size="sm">
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
                  {getVisibleColumns().map((column) => (
                    <th
                      key={column.key}
                      style={{
                        cursor: column.sortable ? "pointer" : "default",
                        userSelect: "none",
                      }}
                      onClick={() => column.sortable && handleSort(column.key)}
                      className={column.sortable ? "sortable-header" : ""}
                    >
                      <div className="d-flex align-items-center">
                        {column.label}
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                  <th style={{ width: "100px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={getVisibleColumns().length + 2} className="text-center">
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
                      {getVisibleColumns().map((column) => (
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
            <>
              {
                itemToDelete?.name || itemToDelete?.tipo_material || itemToDelete?.label && (
                  <div className="mt-2">
                    <strong>Nombre:</strong> {itemToDelete?.name ?? itemToDelete?.tipo_material ?? itemToDelete?.label}
                  </div>
                )
              }
            </>
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
