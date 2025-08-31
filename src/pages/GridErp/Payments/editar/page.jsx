import { useParams } from 'react-router-dom'
import PaymentRegistrationForm from '../registro/payment-registration-form'

export default function EditPaymentPage() {
    const { id } = useParams()
    return (
        <main className="flex  flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <PaymentRegistrationForm mode='edit' id={id} />
        </main>
    )
}
