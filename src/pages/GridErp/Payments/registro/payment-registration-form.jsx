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
import { registerPayment } from './actions'
import { PaymentHelper } from '../payments-helper'
import { TopLayoutGeneralView } from '../../../../Components/Common/TopLayoutGeneralView'

const paymentHelper = new PaymentHelper()

export default function PaymentRegistrationForm() {
  const [isPending, startTransition] = useTransition()

  const [clients, setClients] = useState([
    { _id: 'client1', name: 'Cliente A' },
    { _id: 'client2', name: 'Cliente B' },
    { _id: 'client3', name: 'Cliente C (Sin deudas)' },
  ])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [accounts, setAccounts] = useState([])
  const [debts, setDebts] = useState([])
  const [selectedDebtId, setSelectedDebtId] = useState('none') // 'none' para anticipo
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [value, setValue] = useState('')
  const [accountId, setAccountId] = useState('')
  const [observations, setObservations] = useState('')
  const [paymentSupportFile, setPaymentSupportFile] = useState(null)
  const [paymentSupportFileName, setPaymentSupportFileName] = useState('')

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
    if (selectedClientId) {
      const loadDebts = async () => {
        try {
          const fetchedDebts = await paymentHelper.getOutstandingDebts(selectedClientId)
          setDebts(fetchedDebts)
          setSelectedDebtId('none')
        } catch (error) {
          console.error('Error al cargar deudas:', error)

        }
      }
      loadDebts()
    } else {
      setDebts([])
      setSelectedDebtId('none')
    }
  }, [selectedClientId])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPaymentSupportFile(file)
      setPaymentSupportFileName(file.name)
    } else {
      setPaymentSupportFile(null)
      setPaymentSupportFileName('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedClientId || !paymentDate || !accountId || !value || parseFloat(value) <= 0) {
      alert("Por favor, complete todos los campos obligatorios (Cliente, Fecha, Cuenta, Valor).")
      return
    }

    const formData = new FormData()
    formData.append('clientId', selectedClientId)
    formData.append('selectedDebtId', selectedDebtId)
    formData.append('paymentDate', paymentDate)
    formData.append('accountId', accountId)
    formData.append('value', value)
    formData.append('observations', observations)
    if (paymentSupportFile) {
      formData.append('paymentSupport', paymentSupportFile)
    }

    startTransition(async () => {
      const result = await registerPayment(formData)
      if (result.success) {
        alert(result.message)
        // Resetear formulario
        setSelectedClientId('')
        setSelectedDebtId('none')
        setPaymentDate(new Date().toISOString().split('T')[0])
        setValue('')
        setAccountId('')
        setObservations('')
        setPaymentSupportFile(null)
        setPaymentSupportFileName('')
      } else {
        console.log(result.message)
      }
    })
  }

  const isAnticipo = debts.length === 0 || selectedDebtId === 'none';

  return (
    <TopLayoutGeneralView
      titleBreadcrumb={"Registro de Pagos"}
      pageTitleBreadcrumb="Pagos"
      to={`/payments`}
      main={
        <Container className="py-4">
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
                            {client.name}
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
                                    type="radio"
                                    name="debtSelection"
                                    value={debt._id}
                                    checked={selectedDebtId === debt._id}
                                    onChange={() => setSelectedDebtId(debt._id)}
                                    disabled={isPending}
                                  />
                                </td>
                                <td>{debt.description}</td>
                                <td className="text-right">${debt.amountDue.toFixed(2)}</td>
                              </tr>
                            ))}
                            <tr>
                              <td>
                                <Input
                                  type="radio"
                                  name="debtSelection"
                                  value="none"
                                  checked={selectedDebtId === 'none'}
                                  onChange={() => setSelectedDebtId('none')}
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
                            placeholder="Ej: 150.00"
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
                        <option value="cash">Efectivo</option>
                        {accounts.map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.name}
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
