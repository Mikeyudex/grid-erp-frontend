import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView";
import DetailedSalesReport from "../../components/detailed-sales-report";


export default function DetailedSalesReportPage() {
  return (
    <TopLayoutGeneralView
      titleBreadcrumb="Ventas Detalladas"
      pageTitleBreadcrumb="Reportes"
      to="/reports"
      main={<DetailedSalesReport />}
    />
  )
}
