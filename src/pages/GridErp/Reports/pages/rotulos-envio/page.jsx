import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView"
import ShippingLabelsGenerator from "../../components/shipping-labels-generator"


export default function ShippingLabelsPage() {
    return (
        <TopLayoutGeneralView
            titleBreadcrumb="Rótulos de Envío"
            pageTitleBreadcrumb="Reportes"
            to="/reports"
            main={<ShippingLabelsGenerator />}
        />
    )
}
