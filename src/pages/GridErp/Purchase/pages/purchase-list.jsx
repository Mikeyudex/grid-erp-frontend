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
import DataTable from "../../../../Components/Common/DataTableCustom"
import { TopLayoutGeneralView } from '../../../../Components/Common/TopLayoutGeneralView'
import { FaCheck, FaFilter, FaPlus, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { PurchaseHelper } from '../helper/purchase-helper'

const purchaseHelper = new PurchaseHelper()

export default function PurchaseListPage() {
    document.title = "Lista de compras | Quality";
    const navigate = useNavigate();

    const [purchases, setPurchases] = React.useState();
    const [filteredPurchases, setFilteredPurchases] = React.useState();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    // Estados para los filtros
    const [filters, setFilters] = useState({
        orderNumber: "",
        supplierInvoiceNumber: "",
        createdAt: "",
    })

    const [tempFilters, setTempFilters] = useState({
        orderNumber: "",
        supplierInvoiceNumber: "",
        createdAt: ""
    })

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        purchaseHelper
            .getPurchases({page: 1, limit: 100})
            .then(async (response) => {
                let purchases = response?.data;
                console.log(purchases);
                if (purchases && Array.isArray(purchases) && purchases.length > 0) {
                    setPurchases(purchases);
                    setFilteredPurchases(purchases);
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
        if (!purchases) return

        const filtered = purchases.filter((purchase) => {
            // Filtro por numero de orden
            if (filters.orderNumber && !String(purchase.orderNumber).includes(filters.orderNumber)) {
                return false
            }


            // Filtro por número de factura del proveedor
            if (filters.supplierInvoiceNumber && !String(purchase.supplierInvoiceNumber).includes(filters.supplierInvoiceNumber)) {
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

        setFilteredPurchases(filtered)
    }, [filters, purchases])

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
            orderNumber: "",
            supplierInvoiceNumber: "",
            createdAt: ""
        })
    }

    const clearAllFilters = () => {
        const emptyFilters = {
            orderNumber: "",
            supplierInvoiceNumber: "",
            createdAt: ""
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
        { key: "orderNumber", label: "No. Pedido", type: "text", searchable: true, sortable: true },
        { key: "supplierInvoiceNumber", label: "Número de Factura", type: "text", searchable: true, sortable: true },
        { key: "totalOrder", label: "Total", type: "price", searchable: true, sortable: true },
        { key: "observations", label: "Observaciones", type: "text", searchable: true, sortable: true },
        { key: "createdAt", label: "Fecha Creación", type: "date", searchable: true, sortable: true }
    ]

    const handleUpdate = async (updateRecord) => {
        try {
            setError(null);
            if (!updateRecord) {
                setError("No se ha seleccionado ninguna compra");
                return false
            }
            await purchaseHelper.updatePurchase(updateRecord)
            // Actualizar estado local
            setPurchases((prev) =>
                prev.map((item) => (item._id === updateRecord._id ? updateRecord : item))
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
                setError("No se ha seleccionado ninguna compra");
                return false
            }
            await purchaseHelper.deletePurchase(id)

            // Actualizar estado local
            setPurchases((prev) => prev.filter((item) => item._id !== id))

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
            await purchaseHelper.bulkDeletePurchases(ids)

            // Actualizar estado local
            setPurchases((prev) => prev.filter((item) => !ids.includes(item._id)))
            return true
        } catch (err) {
            console.error("Error:", err)
            setError(err.message)
            return false
        }
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb={"Listado de compras"}
            pageTitleBreadcrumb="Compras"
            to={`/purchases`}
            main={
                <Fragment>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className="bg-light text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <Button color="light" onClick={() => navigate("/purchases-create")}>
                                            <FaPlus className="me-1" /> Nueva Compra
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

                                                         <Col md={6} className="mb-3">
                                                            <FormGroup>
                                                                <Label for="supplierInvoiceNumber" className="small fw-bold">
                                                                    No. Factura de Proveedor
                                                                </Label>
                                                                <Input
                                                                    type="text"
                                                                    id="supplierInvoiceNumber"
                                                                    placeholder="Buscar por número de factura..."
                                                                    value={tempFilters.supplierInvoiceNumber}
                                                                    onChange={(e) => handleTempFilterChange("supplierInvoiceNumber", e.target.value)}
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
                                        data={filteredPurchases}
                                        columns={columns}
                                        onUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        onBulkDelete={handleBulkDelete}
                                        title="Lista de compras"
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
