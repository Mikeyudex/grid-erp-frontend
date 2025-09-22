import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView";
import BankMovementsReport from "../../components/bank-movements-report";

export default function BankMovementsReportPage() {
  return (
     <TopLayoutGeneralView
              titleBreadcrumb="Movimientos Bancarios"
              pageTitleBreadcrumb="Reportes"
              to="/reports"
              main={<BankMovementsReport />}
            />
  )
}
