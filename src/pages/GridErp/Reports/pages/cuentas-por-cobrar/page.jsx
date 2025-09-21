import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView";
import AccountsReceivableReport from "../../components/accounts-receivable-report";

export default function AccountsReceivablePage() {
  document.title = "Cuentas por Cobrar | Quality";
  return (
    <TopLayoutGeneralView
      titleBreadcrumb="CXC - Consolidado por Cliente"
      pageTitleBreadcrumb="Reportes"
      to="/reports"
      main={<AccountsReceivableReport />}
    />
  )
}