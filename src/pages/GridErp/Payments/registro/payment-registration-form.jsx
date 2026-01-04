'use client'

import React, { useState, useEffect, useTransition } from 'react'
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
  Spinner,
} from 'reactstrap'
import moment from 'moment';
import Select from 'react-select';
import { registerPayment, updatePayment } from './actions'
import { PaymentHelper } from '../payments-helper'
import { TopLayoutGeneralView } from '../../../../Components/Common/TopLayoutGeneralView'
import { handleFileUpload } from '../../../../helpers/upload_file_helper'
import ToastComponent from '../../../../Components/Common/Toast'
import { numberFormatPrice } from '../../Products/helper/product_helper'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PurchaseHelper } from '../../Purchase/helper/purchase-helper'

const paymentHelper = new PaymentHelper();
const purchaseHelper = new PurchaseHelper();

const TYPE_OF_OPERATION = [
  { value: 'recibos', label: 'Recibo' },
  { value: 'anticipo', label: 'Anticipo' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'compras', label: 'Compras' },
  /* { value: 'abono', label: 'Abono' }, */
  /* { value: 'credito', label: 'Crédito' }, */
]
export default function PaymentRegistrationForm({
  mode = 'create',
  id = '',
}) {
  document.title = "Registro de Pagos | Quality"
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition()
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [accounts, setAccounts] = useState([])
  const [debts, setDebts] = useState([])
  const [selectedDebtIds, setSelectedDebtIds] = useState([]) // Cambiado a array
  const [isAnticipo, setIsAnticipo] = useState(false) // Separado del array de deudas
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [value, setValue] = useState('')
  const [accountId, setAccountId] = useState('')
  const [typeOperation, setTypeOperation] = useState('')
  const [observations, setObservations] = useState('')
  const [paymentSupportFile, setPaymentSupportFile] = useState(null)
  const [paymentSupportFileName, setPaymentSupportFileName] = useState('')
  const [messsageAlert, setMesssageAlert] = useState('');
  const [typeModal, setTypeModal] = useState('success');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isInternalPayment, setIsInternalPayment] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [loading, setLoading] = useState(false)


  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [accountsData, clientsData, zoneId] = await Promise.all([
        paymentHelper.getAccounts(),
        paymentHelper.getClients(),
        purchaseHelper.getZoneId(),
      ]);

      setAccounts(accountsData);
      setClients(clientsData);
      setSelectedZoneId(zoneId);
    } catch (err) {
      setMesssageAlert('Ocurrió un error al cargar los datos iniciales.');
      setTypeModal('danger');
      setIsOpenModal(true);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { // Cargar registro
    if (id) {
      paymentHelper.getIncome(id)
        .then((income) => {
          setSelectedClientId(income?.customerId?._id)
          setPaymentDate(new Date(income?.paymentDate).toISOString().split('T')[0])
          setAccountId(income?.accountId)
          setTypeOperation(income?.typeOperation)
          setValue(income?.value)
          setObservations(income?.observations)
        })
        .catch(console.error)
    }
  }, [id])

  useEffect(() => {
    setMesssageAlert('');
    setTypeModal('');
    setIsOpenModal(false);
    if (selectedClientId) {
      const loadDebtsByCustomer = async () => {
        try {
          const responseDebts = await paymentHelper.getOutstandingDebts(selectedClientId)
          setDebts(responseDebts?.data ?? [])
          setSelectedDebtIds([])
          setIsAnticipo(false);
        } catch (error) {
          console.error('Error al cargar deudas:', error)
          setMesssageAlert('Ocurrió un error al cargar las deudas.');
          setTypeModal('danger');
          setIsOpenModal(true);
        }
      }
      const loadDebtsByProvider = async () => {
        try {
          const responseDebts = await paymentHelper.getProviderDebts(selectedClientId, selectedZoneId)
          setDebts(responseDebts?.data ?? [])
          setSelectedDebtIds([])
          setIsAnticipo(false);
        } catch (error) {
          console.error('Error al cargar deudas con el proveedor:', error)
          setMesssageAlert('Ocurrió un error al cargar las deudas con el proveedor.');
          setTypeModal('danger');
          setIsOpenModal(true);
        }
      }
      if (isInternalPayment) {
        loadDebtsByProvider();
      } else {
        loadDebtsByCustomer()
      }
    } else {
      setDebts([])
      setSelectedDebtIds([])
      setIsAnticipo(false)
    }
  }, [selectedClientId])

  useEffect(() => {
    if (isInternalPayment) {
      paymentHelper.getProviders()
        .then(setClients)
        .catch(console.error)
    } else {
      paymentHelper.getClients()
        .then(setClients)
        .catch(console.error)
    }
  }, [isInternalPayment])

  // Calcular total de deudas seleccionadas
  const calculateSelectedDebtsTotal = () => {
    return selectedDebtIds.reduce((total, debtId) => {
      const debt = debts.find((d) => d._id === debtId)
      return total + (debt?.amountPayable || 0)
    }, 0)
  }

  // Manejar selección de deudas
  const handleDebtSelection = (debtId, isChecked) => {
    if (isChecked) {
      setSelectedDebtIds((prev) => [...prev, debtId])
    } else {
      setSelectedDebtIds((prev) => prev.filter((id) => id !== debtId))
    }

    // Si hay deudas seleccionadas, desmarcar anticipo
    if (isChecked) {
      setIsAnticipo(false)
    }
  }

  // Manejar selección de anticipo
  const handleAnticipoSelection = (isChecked) => {
    setIsAnticipo(isChecked)
    if (isChecked) {
      // Si se marca anticipo, limpiar deudas seleccionadas
      setSelectedDebtIds([])
      setTypeOperation("anticipo")
      setValue("")
    }
  }

  // Actualizar valor automáticamente cuando cambian las deudas seleccionadas
  useEffect(() => {
    if (selectedDebtIds.length > 0) {
      const total = calculateSelectedDebtsTotal()
      setValue(total.toString())
      setTypeOperation("recibos")
    }
  }, [selectedDebtIds, debts])

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      let { url } = await handleFileUpload(file)
      setPaymentSupportFile(url)
      setPaymentSupportFileName(file.name)
    } else {
      setPaymentSupportFile(null)
      setPaymentSupportFileName('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMesssageAlert('');
    setTypeModal('');
    setIsOpenModal(false);

    if (!selectedClientId || !paymentDate || !accountId || !typeOperation || !value || parseFloat(value) <= 0) {
      alert("Por favor, complete todos los campos obligatorios (Cliente, Fecha, Cuenta, tipo de operación, Valor).")
      return
    }
    let payload = {
      debtIds: isAnticipo ? [] : selectedDebtIds,
      paymentDate: moment(paymentDate).toISOString(),
      accountId: accountId,
      typeOperation: typeOperation,
      value: value,
      observations: observations,
      paymentSupport: paymentSupportFile,
      isInternalPayment: isInternalPayment,
    }

    if (isInternalPayment) {
      payload.providerId = selectedClientId;
    } else {
      payload.customerId = selectedClientId;
    }

    startTransition(async () => {
      if (mode === 'create') {
        const result = await registerPayment(payload)
        console.log(result);

        if (result.success) {
          setMesssageAlert(result.message);
          setTypeModal('success');
          setIsOpenModal(true);

          // Resetear formulario
          setSelectedClientId("")
          setSelectedDebtIds([])
          setIsAnticipo(false)
          setPaymentDate(new Date().toISOString().split('T')[0])
          setValue('')
          setAccountId('')
          setTypeOperation('')
          setObservations('')
          setPaymentSupportFile(null)
          setPaymentSupportFileName('')
        } else {
          setMesssageAlert(result.message);
          setTypeModal('danger');
          setIsOpenModal(true);
        }
      } else {
        const result = await updatePayment(payload)
        if (result.success) {
          setMesssageAlert(result.message);
          setTypeModal('success');
          setIsOpenModal(true);

          // Resetear formulario
          setSelectedClientId("")
          setSelectedDebtIds([])
          setIsAnticipo(false)
          setPaymentDate(new Date().toISOString().split('T')[0])
          setValue('')
          setAccountId('')
          setTypeOperation('')
          setObservations('')
          setPaymentSupportFile(null)
          setPaymentSupportFileName('')
        } else {
          setMesssageAlert(result.message);
          setTypeModal('danger');
          setIsOpenModal(true);
        }
      }
    })
  }

  const handleChangeTypeOperation = (e) => {
    setTypeOperation(e.target.value);
    if (e.target.value === 'anticipo') {
      setIsAnticipo(true);
    } else {
      setIsAnticipo(false);
    }
  }

  const selectedDebtsTotal = calculateSelectedDebtsTotal()
  const paymentValue = Number.parseFloat(value) || 0
  const anticipoAmount = paymentValue > selectedDebtsTotal ? paymentValue - selectedDebtsTotal : 0;
  const title = mode === 'create' ? "Registro de Pagos" : "Editar Pago";
  const subtitle = mode === 'create' ? "Registre pagos por anticipo o abono a deudas existentes." : "Edite el pago seleccionado.";

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
      titleBreadcrumb={mode === 'create' ? "Registro de Pagos" : "Editar Pago"}
      pageTitleBreadcrumb={mode === 'create' ? "Pagos" : "Pago"}
      to={'/accounting/payments-list'}
      main={
        <Container className="py-4">
          {
            isOpenModal && (
              < ToastComponent
                text={messsageAlert}
                duration={4000}
                gravity="top"
                position="right"
                stopOnFocus={true}
                close={true}
                className={typeModal === 'success' ? "toastify-success" : "toastify-danger"}
                style={typeModal === 'success' ? { background: "linear-gradient(to right, #00b09b, #96c93d)" } : { background: "linear-gradient(to right, #e55353, #f06595)" }}
              />
            )
          }
          <Row className="justify-content-center">
            <Col md="8" lg="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">{title}</CardTitle>
                  <CardSubtitle className="mb-2 text-muted">
                    {subtitle}
                  </CardSubtitle>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}>

                    <FormGroup>
                      <Label for="isInternalPayment">Es un pago interno</Label>
                      <Input
                        className='cursor-pointer mx-2'
                        id="isInternalPayment"
                        type="checkbox"
                        checked={isInternalPayment}
                        onChange={(e) => setIsInternalPayment(e.target.checked)}
                        disabled={isPending}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="client">{isInternalPayment ? "Proveedor" : "Cliente"}</Label>
                      <Select
                        id="client"
                        name="client"
                        options={clients.map((client) => ({ value: client._id, label: `${client.name} (${client.commercialName})` }))}
                        value={selectedClientId}
                        onChange={(option) => {
                          setSelectedClientId(option);
                        }}
                        classNamePrefix="react-select"
                        placeholder={`Seleccione un ${isInternalPayment ? "proveedor" : "cliente"}`}

                      />
                    </FormGroup>

                    {selectedClientId && debts.length > 0 && (
                      <FormGroup>
                        <Label>Deudas Pendientes</Label>
                        <Table bordered responsive>
                          <thead>
                            <tr>
                              <th className="w-25">Seleccionar</th>
                              <th>Descripción</th>
                              <th className="text-right">Monto Pendiente</th>
                            </tr>
                          </thead>
                          <tbody>
                            {debts.map((debt) => (
                              <tr key={debt._id}>
                                <td>
                                  <Input
                                    className='cursor-pointer'
                                    type="checkbox"
                                    name="debtSelection"
                                    value={debt._id}
                                    checked={selectedDebtIds.includes(debt._id)}
                                    onChange={(e) => handleDebtSelection(debt._id, e.target.checked)}
                                    disabled={isPending || isAnticipo}
                                  />
                                </td>
                                <td>{debt.description}</td>
                                <td className="text-right">{numberFormatPrice(debt?.amountPayable || 0)}</td>
                              </tr>
                            ))}
                            <tr>
                              <td>
                                <Input
                                  className="cursor-pointer"
                                  type="checkbox"
                                  name="anticipoSelection"
                                  checked={isAnticipo}
                                  onChange={(e) => handleAnticipoSelection(e.target.checked)}
                                  disabled={isPending || selectedDebtIds.length > 0}
                                />
                              </td>
                              <td colSpan="2">
                                <span className="font-weight-semibold">Registrar como Anticipo (sin asociar a deuda)</span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>

                        {/* Mostrar resumen cuando hay deudas seleccionadas */}
                        {selectedDebtIds.length > 0 && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <h6>Resumen de Selección:</h6>
                            <p className="mb-1">
                              <strong>Deudas seleccionadas:</strong> {selectedDebtIds.length}
                            </p>
                            <p className="mb-1">
                              <strong>Total de deudas:</strong> {numberFormatPrice(selectedDebtsTotal)}
                            </p>
                            {anticipoAmount > 0 && (
                              <p className="mb-0 text-info">
                                <strong>Excedente como anticipo:</strong> {numberFormatPrice(anticipoAmount)}
                              </p>
                            )}
                          </div>
                        )}
                      </FormGroup>
                    )}

                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="paymentDate">Fecha de Pago</Label>
                          <Input
                            id="paymentDate"
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            required
                            disabled={isPending}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="value">Valor del Pago</Label>
                          <Input
                            id="value"
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Ej: 150.000"
                            required
                            disabled={isPending}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label for="accountId">Cuenta Bancaria / Efectivo</Label>
                      <Input
                        id="accountId"
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
                    </FormGroup>

                    <FormGroup>
                      <Label for="typeOperation">Tipo de Operación</Label>
                      <Input
                        id="typeOperation"
                        type="select"
                        value={typeOperation}
                        onChange={(e) => handleChangeTypeOperation(e)}
                        required
                        disabled={isPending}
                      >
                        <option value="">Seleccione el tipo de Operación</option>
                        {TYPE_OF_OPERATION.map((type_of_operation) => (
                          <option key={type_of_operation.value} value={type_of_operation.value}>
                            {type_of_operation.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label for="observations">Observaciones</Label>
                      <Input
                        id="observations"
                        type="textarea"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Notas adicionales sobre el pago"
                        disabled={isPending}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="paymentSupport">Soporte de Pago (Imagen)</Label>
                      <Input
                        id="paymentSupport"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isPending}
                      />
                      {paymentSupportFileName && (
                        <small className="form-text text-muted">Archivo seleccionado: {paymentSupportFileName}</small>
                      )}
                    </FormGroup>

                    <CardFooter className="d-flex justify-content-end gap-2">
                      <Button color="light" onClick={() => navigate(`/accounting/payments-list`)}>
                        <ArrowLeft size={16} />
                        Volver
                      </Button>
                      <Button type="submit" color="primary" disabled={isPending}>
                        {isPending
                          ? "Registrando..."
                          : `${mode === 'create' ? "Registrar Pago" : "Editar Pago"} (${isAnticipo
                            ? "Anticipo"
                            : selectedDebtIds.length > 0
                              ? `${selectedDebtIds.length} Deuda${selectedDebtIds.length > 1 ? "s" : ""}${anticipoAmount > 0 ? " + Anticipo" : ""}`
                              : "Seleccione opción"
                          })`}
                      </Button>

                    </CardFooter>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      }
    >
    </ TopLayoutGeneralView>
  )
}
