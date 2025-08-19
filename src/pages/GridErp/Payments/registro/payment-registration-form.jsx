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
} from 'reactstrap'
import moment from 'moment'
import { registerPayment } from './actions'
import { PaymentHelper } from '../payments-helper'
import { TopLayoutGeneralView } from '../../../../Components/Common/TopLayoutGeneralView'
import { handleFileUpload } from '../../../../helpers/upload_file_helper'
import ToastComponent from '../../../../Components/Common/Toast'
import { numberFormatPrice } from '../../Products/helper/product_helper'

const paymentHelper = new PaymentHelper()

const TYPE_OF_OPERATION = [
  { value: 'recibos', label: 'Recibo' },
  { value: 'anticipo', label: 'Anticipo' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'credito', label: 'Crédito' },
]
export default function PaymentRegistrationForm() {
  const [isPending, startTransition] = useTransition()

  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [accounts, setAccounts] = useState([])
  const [debts, setDebts] = useState([])
  const [selectedDebtId, setSelectedDebtId] = useState('none') // 'none' para anticipo
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

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const fetchedAccounts = await paymentHelper.getAccounts()
        setAccounts(fetchedAccounts)
      } catch (error) {
        console.error('Error al cargar cuentas:', error)
      }
    }
    loadAccounts()
  }, [])

  useEffect(() => {
    paymentHelper.getClients()
      .then(setClients)
      .catch(console.error)
  }, []);

  useEffect(() => {
    paymentHelper.getAccounts()
      .then(setAccounts)
      .catch(console.error)
  }, []);

  useEffect(() => {
    setMesssageAlert('');
    setTypeModal('');
    setIsOpenModal(false);
    if (selectedClientId) {
      const loadDebts = async () => {
        try {
          const responseDebts = await paymentHelper.getOutstandingDebts(selectedClientId)
          setDebts(responseDebts?.data ?? [])
          setSelectedDebtId('none')
        } catch (error) {
          console.error('Error al cargar deudas:', error)
          setMesssageAlert('Ocurrió un error al cargar las deudas.');
          setTypeModal('danger');
          setIsOpenModal(true);
        }
      }
      loadDebts()
    } else {
      setDebts([])
      setSelectedDebtId('none')
    }
  }, [selectedClientId])

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
      customerId: selectedClientId,
      debtId: selectedDebtId === 'none' ? null : selectedDebtId,
      paymentDate: moment(paymentDate).toISOString(),
      accountId: accountId,
      typeOperation: typeOperation,
      value: value,
      observations: observations,
      paymentSupport: paymentSupportFile,
    }

    startTransition(async () => {
      const result = await registerPayment(payload)
      if (result.success) {
        setMesssageAlert(result.message);
        setTypeModal('success');
        setIsOpenModal(true);

        // Resetear formulario
        setSelectedClientId('')
        setSelectedDebtId('none')
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
    })
  }

  const isAnticipo = debts.length === 0 || selectedDebtId === 'none';

  return (
    <TopLayoutGeneralView
      titleBreadcrumb={"Registro de Pagos"}
      pageTitleBreadcrumb="Pagos"
      to={`/payments-list`}
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
                  <CardTitle tag="h4">Registro de Pagos</CardTitle>
                  <CardSubtitle className="mb-2 text-muted">
                    Registre pagos por anticipo o abono a deudas existentes.
                  </CardSubtitle>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="client">Cliente</Label>
                      <Input
                        id="client"
                        type="select"
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        disabled={isPending}
                      >
                        <option value="">Seleccione un cliente</option>
                        {clients.map((client) => (
                          <option key={client._id} value={client._id}>
                            {client.name || 'Cliente sin nombre'} {client?.lastname ? `${client.lastname}` : ''} {`(${client.commercialName || 'Sin nombre comercial'})`}
                          </option>
                        ))}
                      </Input>
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
                                    type="radio"
                                    name="debtSelection"
                                    value={debt._id}
                                    checked={selectedDebtId === debt._id}
                                    onChange={() => {
                                      setSelectedDebtId(debt._id)
                                      setTypeOperation('recibos')
                                      setValue(debt?.amountPayable || 0)
                                    }}
                                    disabled={isPending}
                                  />
                                </td>
                                <td>{debt.description}</td>
                                <td className="text-right">{numberFormatPrice(debt?.amountPayable || 0)}</td>
                              </tr>
                            ))}
                            <tr>
                              <td>
                                <Input
                                  className='cursor-pointer'
                                  type="radio"
                                  name="debtSelection"
                                  value="none"
                                  checked={selectedDebtId === 'none'}
                                  onChange={() => {
                                    setSelectedDebtId('none')
                                    setTypeOperation('anticipo')
                                    setValue(0)
                                  }}
                                  disabled={isPending}
                                />
                              </td>
                              <td colSpan="2">
                                <span className="font-weight-semibold">Registrar como Anticipo (sin asociar a deuda)</span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
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
                        onChange={(e) => setTypeOperation(e.target.value)}
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

                    <CardFooter className="d-flex justify-content-end">
                      <Button type="submit" color="primary" disabled={isPending}>
                        {isPending ? 'Registrando...' : `Registrar Pago (${isAnticipo ? 'Anticipo' : 'Abono'})`}
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
