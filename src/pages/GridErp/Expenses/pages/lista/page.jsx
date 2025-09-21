'use client'

import React, { useState, useEffect, Fragment } from 'react'
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    Badge,
} from "reactstrap"
import { FaCheck, FaFilter, FaPlus, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import DataTable from "../../.././../../Components/Common/DataTableCustom"
import { TopLayoutGeneralView } from '../../.././../../Components/Common/TopLayoutGeneralView'
import { numberFormatPrice } from '../../../Products/helper/product_helper'
import { ExpensesHelper } from '../../helpers/expenses_helper'
import { CustomerHelper } from '../../../Customers/helper/customer-helper'


const expenseHelper = new ExpensesHelper();
const customerHelper = new CustomerHelper();

export default function ExpenseListPage() {
    document.title = "Lista de Egresos | Quality";
    const navigate = useNavigate();

    const [expenses, setExpenses] = React.useState();
    const [filteredExpenses, setFilteredExpenses] = React.useState();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [providers, setProviders] = useState([]);

    // Estados para los filtros
    const [filters, setFilters] = useState({
        customerName: "",
        typeOperation: "",
        paymentDate: "",
        orderNumber: "",
        createdAt: "",
    })

    const [tempFilters, setTempFilters] = useState({
        customerName: "",
        typeOperation: "",
        paymentDate: "",
        orderNumber: "",
        createdAt: "",
    })


    const fetchData = async () => {
        setLoading(true);
        setError(null);

        expenseHelper
            .getTAllExpenses()
            .then(async (response) => {
                let expenses = response?.data;
                if (expenses && Array.isArray(expenses) && expenses.length > 0) {
                    let expensesMapped = expenses.map((expense) => {
                        return {
                            ...expense,
                            providerName:` ${expense?.providerId?.commercialName || expense?.customerId?.commercialName || 'N/A'}`,
                            sequence: expense?.sequence,
                            paymentDate: expense.paymentDate,
                            value: numberFormatPrice(expense.value),
                            typeOperation: expense.typeOperation || 'N/A',
                            observations: expense.observations || 'N/A',
                            accountName: expense?.accountId?.name,
                            zoneName: expense?.zoneId?.name,
                            createdAt: expense.createdAt,
                        }
                    })
                    setExpenses(expensesMapped);
                    setFilteredExpenses(expensesMapped);
                }
                return;
            })
            .catch(e => {
                console.error("Error:", e)
                setError(e.message)
            })
            .finally(() => {
                setLoading(false);
            });

            const providers = await customerHelper.getProviders();
            setProviders(providers);
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        if (!expenses) return

        const filtered = expenses.filter((expense) => {
            // Filtro por id de proveedor
            if (filters.providerId && !expense.providerId._id.includes(filters.providerId)) {
                return false
            }

            // Filtro por fecha de pago
            if (filters.paymentDate) {
                const paymentDate = new Date(expense.paymentDate).toISOString().split("T")[0]
                if (paymentDate !== filters.paymentDate) {
                    return false
                }
            }

            // Filtro por número de egreso
            if (filters.sequence && !expense.sequence.includes(filters.sequence)) {
                return false
            }

            // Filtro por fecha de creación
            if (filters.createdAt) {
                const createdAt = new Date(expense.createdAt).toISOString().split("T")[0]
                if (createdAt !== filters.createdAt) {
                    return false
                }
            }

            return true
        })

        setFilteredExpenses(filtered)
    }, [filters, expenses])

    const handleTempFilterChange = (field, value) => {
        setTempFilters((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const applyFilters = () => {
        setFilters(tempFilters)
        setDropdownOpen(false)
    }

    const clearTempFilters = () => {
        setTempFilters({
            providerId: "all",
            typeOperation: "",
            paymentDate: "",
            orderNumber: "",
            createdAt: "",
        })
    }

    const clearAllFilters = () => {
        const emptyFilters = {
            customerName: "",
            typeOperation: "",
            paymentDate: "",
            orderNumber: "",
            createdAt: "",
        }
        setFilters(emptyFilters)
        setTempFilters(emptyFilters)
        setDropdownOpen(false)
    }

    const toggleDropdown = () => {
        if (!dropdownOpen) {
            // Sincronizar filtros temporales con los actuales al abrir
            setTempFilters(filters)
        }
        setDropdownOpen(!dropdownOpen)
    }

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter((value) => value !== "").length
    }

    const getTempFiltersCount = () => {
        return Object.values(tempFilters).filter((value) => value !== "").length
    }

    const columns = [
        { key: "providerName", label: "Proveedor", type: "text", searchable: true, sortable: true },
        { key: "sequence", label: "No. Egreso", type: "text", searchable: true, sortable: true },
        { key: "paymentDate", label: "Fecha de Pago", type: "date", searchable: false, sortable: true },
        { key: "value", label: "Valor", type: "text", searchable: false, sortable: true },
        { key: "accountName", label: "Cuenta", type: "text", searchable: true, sortable: true },
        { key: "zoneName", label: "Sede", type: "text", searchable: true, sortable: true },
        { key: "observations", label: "Observaciones", type: "text", searchable: true, sortable: false },
        { key: "createdAt", label: "Fecha de Creación", type: "date", searchable: false, sortable: true },
    ]

    const handleUpdate = async (updated) => {
        try {
            setError(null);
            if (!updated) {
                setError("No se ha seleccionado ningún egreso");
                return false
            }
            await expenseHelper.updateExpense(updated)
            // Actualizar estado local
            setExpenses((prev) =>
                prev.map((item) => (item._id === updated._id ? updated : item))
            )
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleDelete = async (id) => {
        try {
            setError(null);
            if (!id) {
                setError("No se ha seleccionado ninguna cuenta");
                return false
            }
            await expenseHelper.deleteExpense(id)

            // Actualizar estado local
            setExpenses((prev) => prev.filter((item) => item._id !== id))

            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleBulkDelete = async (ids) => {
        setError(null);
        try {
            await expenseHelper.bulkDeleteExpenses(ids)

            // Actualizar estado local
            setExpenses((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    const handleClickEditRow = (id) => {
        return navigate(`/expenses-edit/${id}`)
    };

    return (
        <TopLayoutGeneralView
            titleBreadcrumb={"Listado de Egresos"}
            pageTitleBreadcrumb="Egresos"
            to={`/expenses-list`}
            main={
                <Fragment>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <Button color="light" onClick={() => navigate("/accounting/expenses-register")}>
                                            <FaPlus className="me-1" /> Nuevo Egreso
                                        </Button>
                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                            <DropdownToggle color="outline-secondary" className="d-flex align-items-center">
                                                <FaFilter className="me-1" />
                                                Filtros
                                                {getActiveFiltersCount() > 0 && (
                                                    <Badge color="primary" pill className="ms-2">
                                                        {getActiveFiltersCount()}
                                                    </Badge>
                                                )}
                                            </DropdownToggle>

                                            <DropdownMenu
                                                end
                                                style={{
                                                    width: "500px",
                                                    maxWidth: "90vw",
                                                    padding: "20px",
                                                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                                    border: "1px solid #dee2e6",
                                                    borderRadius: "8px",
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="p-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6 className="mb-0 d-flex align-items-center">
                                                            <FaFilter className="me-2" />
                                                            Filtros de Búsqueda
                                                            {getTempFiltersCount() > 0 && (
                                                                <Badge color="primary" pill className="ms-2">
                                                                    {getTempFiltersCount()}
                                                                </Badge>
                                                            )}
                                                        </h6>
                                                    </div>

                                                    <Row>
                                                        <Col md={6} className="mb-3">
                                                            <FormGroup>
                                                                <Label for="providerId" className="small fw-bold">
                                                                    Proveedor
                                                                </Label>
                                                                <Input
                                                                    type="select"
                                                                    id="providerId"
                                                                    value={tempFilters.providerId}
                                                                    onChange={(e) => handleTempFilterChange("providerId", e.target.value)}
                                                                    size="sm"
                                                                >
                                                                    <option value="all">Todos los Proveedores</option>
                                                                    {providers.map((provider) => (
                                                                        <option key={provider._id} value={provider._id}>
                                                                            {provider.name} {provider.lastname} ({provider.commercialName})
                                                                        </option>
                                                                    ))}
                                                                </Input>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6} className="mb-3">
                                                            <FormGroup>
                                                                <Label for="paymentDate" className="small fw-bold">
                                                                    Fecha de Pago
                                                                </Label>
                                                                <Input
                                                                    type="date"
                                                                    id="paymentDate"
                                                                    value={tempFilters.paymentDate}
                                                                    onChange={(e) => handleTempFilterChange("paymentDate", e.target.value)}
                                                                    size="sm"
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6} className="mb-3">
                                                            <FormGroup>
                                                                <Label for="sequence" className="small fw-bold">
                                                                    No. Egreso
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="sequence"
                                                                    placeholder="Buscar por número de egreso..."
                                                                    value={tempFilters.sequence}
                                                                    onChange={(e) => handleTempFilterChange("sequence", e.target.value)}
                                                                    size="sm"
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6} className="mb-3">
                                                            <FormGroup>
                                                                <Label for="createdAt" className="small fw-bold">
                                                                    Fecha de Creación
                                                                </Label>
                                                                <Input
                                                                    type="date"
                                                                    id="createdAt"
                                                                    value={tempFilters.createdAt}
                                                                    onChange={(e) => handleTempFilterChange("createdAt", e.target.value)}
                                                                    size="sm"
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    {getTempFiltersCount() > 0 && (
                                                        <div className="mt-2 mb-3 p-2 bg-light rounded">
                                                            <small className="text-muted">
                                                                <strong>Vista previa:</strong> Se mostrarán los registros que coincidan con{" "}
                                                                {getTempFiltersCount()} filtro{getTempFiltersCount() > 1 ? "s" : ""} seleccionado
                                                                {getTempFiltersCount() > 1 ? "s" : ""}.
                                                            </small>
                                                        </div>
                                                    )}

                                                    <div className="d-flex justify-content-between pt-2 border-top">
                                                        <Button
                                                            color="secondary"
                                                            size="sm"
                                                            onClick={clearTempFilters}
                                                            disabled={getTempFiltersCount() === 0}
                                                        >
                                                            <FaTimes className="me-1" />
                                                            Limpiar
                                                        </Button>

                                                        <div className="d-flex gap-2">
                                                            <Button color="secondary" size="sm" onClick={() => setDropdownOpen(false)}>
                                                                Cancelar
                                                            </Button>
                                                            <Button color="primary" size="sm" onClick={applyFilters}>
                                                                <FaCheck className="me-1" />
                                                                Aplicar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DropdownMenu>
                                        </Dropdown>
                                        {getActiveFiltersCount() > 0 && (
                                            <Button
                                                color="outline-danger"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                title="Limpiar todos los filtros"
                                            >
                                                <FaTimes />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Resumen de filtros activos */}
                                    {getActiveFiltersCount() > 0 && (
                                        <div className="text-muted small">
                                            Mostrando {filteredExpenses?.length || 0} de {filteredExpenses?.length || 0} registros
                                        </div>
                                    )}
                                </CardHeader>

                                <CardBody>
                                    {error && (
                                        <Alert color="danger" toggle={() => setError(null)}>
                                            {error}
                                        </Alert>
                                    )}

                                    <DataTable
                                        data={filteredExpenses}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de egresos"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchData}
                                        searchable={true}
                                        itemsPerPage={10}
                                        onClickEditRow={handleClickEditRow}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ Fragment>
            }
        >
        </ TopLayoutGeneralView>
    )
}
