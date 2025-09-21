import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView";
import DetailedAccountsReceivableReport from "../../components/detailed-accounts-receivable-report";

export default function DetailedAccountsReceivablePage() {
  document.title = "Cuentas por Cobrar - Detallado | Quality";
  return (
    <TopLayoutGeneralView
          titleBreadcrumb="CXC - Detallado por Pedidos"
          pageTitleBreadcrumb="Reportes"
          to="/reports"
          main={<DetailedAccountsReceivableReport />}
        />
  )
}
