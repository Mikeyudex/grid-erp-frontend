"use client"

import { useState, useEffect, useTransition } from "react"
import { useNavigate } from "react-router-dom"
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    CardSubtitle,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Table,
    Alert,
    Spinner,
} from "reactstrap"
import Select from 'react-select';
import moment from "moment"
import { ExpensesHelper } from "../../helpers/expenses_helper"
import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView"
import { PurchaseHelper } from "../../../Purchase/helper/purchase-helper"
import { ZonesHelper } from "../../../Zones/helper/zones_helper"
import { AccountHelper } from "../../../Accounts/helpers/account_helper"
import { PaymentHelper } from "../../../Payments/payments-helper"
import { FaPlus } from "react-icons/fa"

const expenseHelper = new ExpensesHelper();
const purchaseHelper = new PurchaseHelper();
const zonesHelper = new ZonesHelper();
const accountsHelper = new AccountHelper();
const paymentHelper = new PaymentHelper();

export default function ExpenseRegistrationForm({ mode = 'create' }) {
    document.title = mode === 'create' ? "Registro de Egresos" : "Editar Egreso";
    const navigate = useNavigate();
    const [isPending, startTransition] = useTransition()

    // Estados principales
    const [providers, setProviders] = useState([])
    const [selectedProviderId, setSelectedProviderId] = useState("")
    const [accounts, setAccounts] = useState([])
    const [zones, setZones] = useState([])
    const [typesOfExpense, setTypesOfExpense] = useState([])
    const [debts, setDebts] = useState([])
    const [selectedDebtIds, setSelectedDebtIds] = useState([])
    const [hasAdvancePayment, setHasAdvancePayment] = useState(false)
    const [selectedZoneId, setSelectedZoneId] = useState(null);

    // Estados del formulario
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
    const [value, setValue] = useState("")
    const [accountId, setAccountId] = useState("")
    const [zoneId, setZoneId] = useState("")
    const [typeOfExpenseId, setTypeOfExpenseId] = useState("")
    const [observations, setObservations] = useState("")
    const [paymentSupportFile, setPaymentSupportFile] = useState(null)
    const [paymentSupportFileName, setPaymentSupportFileName] = useState("")

    // Estados de UI
    const [messageAlert, setMessageAlert] = useState("")
    const [typeModal, setTypeModal] = useState("success")
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData()
    }, [])

    // Cargar deudas cuando cambia el proveedor
    useEffect(() => {
        if (selectedProviderId) {
            const loadDebts = async () => {
                try {
                    const responseDebts = await paymentHelper.getProviderDebts(selectedProviderId, selectedZoneId);
                    setDebts(responseDebts?.data ?? [])
                    setSelectedDebtIds([])
                } catch (error) {
                    console.error("Error al cargar deudas:", error)
                    showAlert("Ocurrió un error al cargar las deudas del proveedor.", "danger")
                }
            }
            loadDebts()
        } else {
            setDebts([])
            setSelectedDebtIds([])
        }
    }, [selectedProviderId])

    const loadInitialData = async () => {
        try {
            setLoading(true)
            const [providersData, accountsData, zonesData, typesData, zoneId] = await Promise.all([
                purchaseHelper.getProviders(),
                accountsHelper.getAccounts(),
                zonesHelper.getZones(),
                expenseHelper.getTypeOfExpenses(),
                purchaseHelper.getZoneId(),
            ])

            setProviders(providersData?.data ?? [])
            setAccounts(accountsData?.data ?? [])
            setZones(zonesData)
            setTypesOfExpense(typesData?.data ?? [])
            setSelectedZoneId(zoneId);
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error)
            showAlert("Error al cargar los datos iniciales.", "danger")
        } finally {
            setLoading(false)
        }
    }

    // Calcular total de deudas seleccionadas
    const calculateSelectedDebtsTotal = () => {
        return selectedDebtIds.reduce((total, debtId) => {
            const debt = debts.find((d) => d._id === debtId)
            return total + (debt?.amountPayable || 0)
        }, 0)
    }

    // Actualizar valor automáticamente cuando cambian las deudas seleccionadas
    useEffect(() => {
        if (selectedDebtIds.length > 0) {
            const total = calculateSelectedDebtsTotal()
            setValue(total.toString())
        }
    }, [selectedDebtIds, debts])

    // Manejar selección de deudas
    const handleDebtSelection = (debtId, isChecked) => {
        if (isChecked) {
            setSelectedDebtIds((prev) => [...prev, debtId])
        } else {
            setSelectedDebtIds((prev) => prev.filter((id) => id !== debtId))
        }

        // Si hay deudas seleccionadas, desmarcar anticipo
        if (isChecked) {
            setHasAdvancePayment(false)
        }
    }

    // Manejar selección de anticipo
    const handleAdvancePaymentSelection = (isChecked) => {
        setHasAdvancePayment(isChecked)
        if (isChecked) {
            // Si se marca anticipo, limpiar deudas seleccionadas
            setSelectedDebtIds([])
            setValue("")
        }
    }

    // Manejar carga de archivos
    const handleFileChange = async (event) => {
        const file = event.target.files[0]
        if (file) {
            try {
                const { url } = await expenseHelper.uploadFile(file)
                setPaymentSupportFile(url)
                setPaymentSupportFileName(file.name)
            } catch (error) {
                showAlert(error.message, "danger")
            }
        } else {
            setPaymentSupportFile(null)
            setPaymentSupportFileName("")
        }
    }

    // Mostrar alertas
    const showAlert = (message, type) => {
        setMessageAlert(message)
        setTypeModal(type)
        setIsOpenModal(true)
    }

    // Manejar envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessageAlert("")
        setTypeModal("")
        setIsOpenModal(false)

        // Preparar payload
        const payload = {
            providerId: selectedProviderId,
            paymentDate: moment(paymentDate).toISOString(),
            accountId: accountId,
            zoneId: zoneId,
            typeOfExpenseId: typeOfExpenseId,
            debtIds: selectedDebtIds.length > 0 ? selectedDebtIds : null,
            value: Number.parseFloat(value),
            observations: observations,
            paymentSupport: paymentSupportFile,
            hasCurrentAdvancePayment: hasAdvancePayment,
        }

        // Validaciones
        if (!expenseHelper.validateForm(payload, setErrors)) {
            console.log(errors);
            return;
        }

        startTransition(async () => {
            try {
                const result = await expenseHelper.registerExpense(payload)
                if (result.success) {
                    showAlert(result.message, "success")
                    resetForm()
                    return navigate('/expenses-list')
                } else {
                    showAlert(result.message, "danger")
                }
            } catch (error) {
                showAlert("Error interno al registrar el egreso.", "danger")
            }
        })
    }

    // Resetear formulario
    const resetForm = () => {
        setSelectedProviderId("")
        setSelectedDebtIds([])
        setHasAdvancePayment(false)
        setPaymentDate(new Date().toISOString().split("T")[0])
        setValue("")
        setAccountId("")
        setZoneId("")
        setTypeOfExpenseId("")
        setObservations("")
        setPaymentSupportFile(null)
        setPaymentSupportFileName("")
    }

    const selectedDebtsTotal = calculateSelectedDebtsTotal()
    const paymentValue = Number.parseFloat(value) || 0
    const advanceAmount = paymentValue > selectedDebtsTotal ? paymentValue - selectedDebtsTotal : 0;

    if (loading) {
        return (
            <div className="page-content">
                <Container className="py-4 text-center">
                    <Spinner color="primary" />
                    <p className="mt-2">Cargando...</p>
                </Container>
            </div>
        )
    }

    return (
        <TopLayoutGeneralView
            titleBreadcrumb={mode === 'create' ? "Registro de Egresos" : "Editar Egreso"}
            pageTitleBreadcrumb={mode === 'create' ? "Egresos" : "Egreso"}
            to={'/accounting/expenses-list'}
            main={
                <Container className="py-4">
                    {isOpenModal && (
                        <Alert color={typeModal} className="mb-4" toggle={() => setIsOpenModal(false)}>
                            {messageAlert}
                        </Alert>
                    )}

                    <Row className="justify-content-center">
                        <Col md="10" lg="8">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Registro de Egresos</CardTitle>
                                    <CardSubtitle className="mb-2 text-muted">
                                        Registre pagos a proveedores, gastos operativos y otros egresos.
                                    </CardSubtitle>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="provider">Tercero *</Label>
                                                    <FaPlus
                                                        className="cursor-pointer mx-2 text-primary"
                                                        onClick={() => navigate("/customers-create-v2")} />
                                                    <Select
                                                        id="provider"
                                                        name="provider"
                                                        options={providers.map((provider) => ({ value: provider._id, label: `${provider.name} (${provider.commercialName})` }))}
                                                        value={selectedProviderId ? { value: selectedProviderId, label: `${providers.find((p) => p._id === selectedProviderId).name} (${providers.find((p) => p._id === selectedProviderId).commercialName})` } : null}
                                                        onChange={(option) => {
                                                            setSelectedProviderId(option.value);
                                                        }}
                                                        classNamePrefix="react-select"
                                                        placeholder="Selecciona un tercero"
                                                       
                                                    />
                                                    {errors.providerId && <span style={{ color: "red" }}>{errors.providerId}</span>}
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="paymentDate">Fecha de Pago *</Label>
                                                    <Input
                                                        id="paymentDate"
                                                        type="date"
                                                        value={paymentDate}
                                                        onChange={(e) => setPaymentDate(e.target.value)}
                                                        required
                                                        disabled={isPending}
                                                    />
                                                    {errors.paymentDate && <span style={{ color: "red" }}>{errors.paymentDate}</span>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="zone">Sede *</Label>
                                                    <Input
                                                        id="zone"
                                                        type="select"
                                                        value={zoneId}
                                                        onChange={(e) => setZoneId(e.target.value)}
                                                        required
                                                        disabled={isPending}
                                                    >
                                                        <option value="">Seleccione una sede</option>
                                                        {zones.map((zone) => (
                                                            <option key={zone._id} value={zone._id}>
                                                                {zone.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {errors.zoneId && <span style={{ color: "red" }}>{errors.zoneId}</span>}
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="typeOfExpense">Tipo de Egreso *</Label>
                                                    <Input
                                                        id="typeOfExpense"
                                                        type="select"
                                                        value={typeOfExpenseId}
                                                        onChange={(e) => setTypeOfExpenseId(e.target.value)}
                                                        required
                                                        disabled={isPending}
                                                    >
                                                        <option value="">Seleccione el tipo de egreso</option>
                                                        {typesOfExpense.map((type) => (
                                                            <option key={type._id} value={type._id}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {errors.typeOfExpenseId && <span style={{ color: "red" }}>{errors.typeOfExpenseId}</span>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {selectedProviderId && debts.length > 0 && (
                                            <FormGroup>
                                                <Label>Deudas Pendientes del Proveedor</Label>
                                                <Table bordered responsive size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "60px" }}>Seleccionar</th>
                                                            <th>Descripción</th>
                                                            <th style={{ width: "120px" }}>Monto</th>
                                                            <th style={{ width: "120px" }}>Vencimiento</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {debts.map((debt) => (
                                                            <tr key={debt._id}>
                                                                <td className="text-center">
                                                                    <Input
                                                                        className="cursor-pointer"
                                                                        type="checkbox"
                                                                        checked={selectedDebtIds.includes(debt._id)}
                                                                        onChange={(e) => handleDebtSelection(debt._id, e.target.checked)}
                                                                        disabled={isPending || hasAdvancePayment}
                                                                    />
                                                                </td>
                                                                <td>{debt.description}</td>
                                                                <td className="text-right">${debt.amountPayable?.toLocaleString()}</td>
                                                                <td className="text-center">{moment(debt.dueDate).format("DD/MM/YYYY")}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="table-info">
                                                            <td className="text-center">
                                                                <Input
                                                                    className="cursor-pointer"
                                                                    type="checkbox"
                                                                    checked={hasAdvancePayment}
                                                                    onChange={(e) => handleAdvancePaymentSelection(e.target.checked)}
                                                                    disabled={isPending || selectedDebtIds.length > 0}
                                                                />
                                                            </td>
                                                            <td colSpan="3">
                                                                <strong>Registrar como Anticipo (sin asociar a deuda específica)</strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>

                                                {selectedDebtIds.length > 0 && (
                                                    <div className="mt-3 p-3 bg-light rounded">
                                                        <h6>Resumen de Selección:</h6>
                                                        <p className="mb-1">
                                                            <strong>Deudas seleccionadas:</strong> {selectedDebtIds.length}
                                                        </p>
                                                        <p className="mb-1">
                                                            <strong>Total de deudas:</strong> ${selectedDebtsTotal.toLocaleString()}
                                                        </p>
                                                        {advanceAmount > 0 && (
                                                            <p className="mb-0 text-info">
                                                                <strong>Excedente como anticipo:</strong> ${advanceAmount.toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </FormGroup>
                                        )}

                                        <Row>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="account">Cuenta de Pago *</Label>
                                                    <Input
                                                        id="account"
                                                        type="select"
                                                        value={accountId}
                                                        onChange={(e) => setAccountId(e.target.value)}
                                                        required
                                                        disabled={isPending}
                                                    >
                                                        <option value="">Seleccione la cuenta</option>
                                                        {accounts.map((account) => (
                                                            <option key={account._id} value={account._id}>
                                                                {account.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {errors.accountId && <span style={{ color: "red" }}>{errors.accountId}</span>}
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label for="value">Valor del Egreso *</Label>
                                                    <Input
                                                        id="value"
                                                        type="number"
                                                        step="0.01"
                                                        value={value}
                                                        onChange={(e) => setValue(e.target.value)}
                                                        placeholder="Ej: 150000"
                                                        required
                                                        disabled={isPending}
                                                    />
                                                    {errors.value && <span style={{ color: "red" }}>{errors.value}</span>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <FormGroup>
                                            <Label for="observations">Observaciones</Label>
                                            <Input
                                                id="observations"
                                                type="textarea"
                                                rows="3"
                                                value={observations}
                                                onChange={(e) => setObservations(e.target.value)}
                                                placeholder="Descripción detallada del gasto, número de factura, etc."
                                                disabled={isPending}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="paymentSupport">Soporte de Pago (Imagen/PDF)</Label>
                                            <Input
                                                id="paymentSupport"
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange}
                                                disabled={isPending}
                                            />
                                            {paymentSupportFileName && (
                                                <small className="form-text text-muted">Archivo seleccionado: {paymentSupportFileName}</small>
                                            )}
                                        </FormGroup>

                                        <CardFooter className="d-flex justify-content-between align-items-center">
                                            <div>
                                                {selectedDebtIds.length > 0 && (
                                                    <small className="text-muted">
                                                        Pagando {selectedDebtIds.length} deuda{selectedDebtIds.length > 1 ? "s" : ""}
                                                        {advanceAmount > 0 && " + anticipo"}
                                                    </small>
                                                )}
                                                {hasAdvancePayment && <small className="text-muted">Registrando como anticipo</small>}
                                            </div>
                                            <div>
                                                <Button type="button" color="secondary" className="me-2" onClick={resetForm} disabled={isPending}>
                                                    Limpiar
                                                </Button>
                                                <Button type="submit" color="primary" disabled={isPending}>
                                                    {isPending ? "Registrando..." : "Registrar Egreso"}
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            }
        >
        </TopLayoutGeneralView>
    )
}
