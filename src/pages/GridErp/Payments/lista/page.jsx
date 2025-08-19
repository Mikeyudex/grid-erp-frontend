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
import { PaymentHelper } from "../payments-helper"
import DataTable from "../../../../Components/Common/DataTableCustom"
import { TopLayoutGeneralView } from '../../../../Components/Common/TopLayoutGeneralView'
import { FaCheck, FaFilter, FaPlus, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { numberFormatPrice } from '../../Products/helper/product_helper'

const paymentHelper = new PaymentHelper()

export default function PaymentListPage() {
    const navigate = useNavigate();

    const [incomes, setIncomes] = React.useState();
    const [filteredIncomes, setFilteredIncomes] = React.useState();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

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


    const typeOperationOptions = [
        { value: "", label: "Todos los tipos" },
        { value: "ventas", label: "Ventas" },
        { value: "recibos", label: "Recibos" },
        { value: "anticipo", label: "Anticipo" },
        { value: "credito", label: "Crédito" },
    ]

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        paymentHelper
            .getAllIncome()
            .then(async (response) => {
                let incomes = response?.data;
                if (incomes && Array.isArray(incomes) && incomes.length > 0) {
                    let incomesMapped = incomes.map((income) => {
                        return {
                            ...income,
                            accountName: income?.accountId?.name,
                            orderNumber: income?.purchaseOrderId?.orderNumber || 'N/A',
                            paymentDate: income.paymentDate,
                            value: numberFormatPrice(income.value),
                            createdAt: income.createdAt,
                            typeOperation: income.typeOperation || 'N/A',
                            observations: income.observations || 'N/A',
                            _id: income._id,
                            customerName: ` ${income?.customerId?.commercialName || 'N/A'}`,

                        }
                    })
                    setIncomes(incomesMapped);
                    setFilteredIncomes(incomesMapped);
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
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        if (!incomes) return

        const filtered = incomes.filter((income) => {
            // Filtro por nombre de cliente
            if (filters.customerName && !income.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
                return false
            }

            // Filtro por tipo de operación
            if (filters.typeOperation && income.typeOperation !== filters.typeOperation) {
                return false
            }

            // Filtro por fecha de pago
            if (filters.paymentDate) {
                const paymentDate = new Date(income.paymentDate).toISOString().split("T")[0]
                if (paymentDate !== filters.paymentDate) {
                    return false
                }
            }

            // Filtro por número de pedido
            if (filters.orderNumber && !income.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())) {
                return false
            }

            // Filtro por fecha de creación
            if (filters.createdAt) {
                const createdAt = new Date(income.createdAt).toISOString().split("T")[0]
                if (createdAt !== filters.createdAt) {
                    return false
                }
            }

            return true
        })

        setFilteredIncomes(filtered)
    }, [filters, incomes])

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

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const clearTempFilters = () => {
        setTempFilters({
            customerName: "",
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
        { key: "customerName", label: "Cliente", type: "text", searchable: true, sortable: true },
        { key: "typeOperation", label: "Tipo de Operación", type: "text", searchable: true, sortable: true },
        { key: "paymentDate", label: "Fecha de Pago", type: "date", searchable: true, sortable: true },
        { key: "value", label: "Valor", type: "number", searchable: true, sortable: true },
        { key: "accountName", label: "Cuenta", type: "text", searchable: true, sortable: true },
        { key: "orderNumber", label: "No. Pedido", type: "text", searchable: true, sortable: true },
        { key: "observations", label: "Observaciones", type: "text", searchable: true, sortable: false },
        { key: "createdAt", label: "Fecha Creación", type: "date", searchable: true, sortable: true },
    ]

    const handleUpdate = async (updatedIncome) => {
        try {
            setError(null);
            if (!updatedIncome) {
                setError("No se ha seleccionado ninguna cuenta");
                return false
            }
            await paymentHelper.updateIncome(updatedIncome)
            // Actualizar estado local
            setIncomes((prev) =>
                prev.map((item) => (item._id === updatedIncome._id ? updatedIncome : item))
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
            await paymentHelper.deleteIncome(id)

            // Actualizar estado local
            setIncomes((prev) => prev.filter((item) => item._id !== id))

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
            await paymentHelper.bulkDeleteIncomes(ids)

            // Actualizar estado local
            setIncomes((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb={"Listado de Pagos"}
            pageTitleBreadcrumb="Pagos"
            to={`/payments-list`}
            main={
                <Fragment>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <Button color="light" onClick={() => navigate("/payments-register")}>
                                            <FaPlus className="me-1" /> Nuevo Pago
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
                                                                <Label for="customerName" className="small fw-bold">
                                                                    Cliente
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="customerName"
                                                                    placeholder="Buscar por cliente..."
                                                                    value={tempFilters.customerName}
                                                                    onChange={(e) => handleTempFilterChange("customerName", e.target.value)}
                                                                    size="sm"
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6} className="mb-3">
                                                            <FormGroup>
                                                                <Label for="typeOperation" className="small fw-bold">
                                                                    Tipo de Operación
                                                                </Label>
                                                                <Input
                                                                    type="select"
                                                                    id="typeOperation"
                                                                    value={tempFilters.typeOperation}
                                                                    onChange={(e) => handleTempFilterChange("typeOperation", e.target.value)}
                                                                    size="sm"
                                                                >
                                                                    {typeOperationOptions.map((option) => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
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
                                                                <Label for="orderNumber" className="small fw-bold">
                                                                    No. Pedido
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="orderNumber"
                                                                    placeholder="Buscar por número de pedido..."
                                                                    value={tempFilters.orderNumber}
                                                                    onChange={(e) => handleTempFilterChange("orderNumber", e.target.value)}
                                                                    size="sm"
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={12} className="mb-3">
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
                                            Mostrando {filteredIncomes?.length || 0} de {incomes?.length || 0} registros
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
                                        data={filteredIncomes}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de pagos"
                                        loading={loading}
                                        error={error}
                                        refreshData={fetchData}
                                        searchable={true}
                                        itemsPerPage={10}
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
