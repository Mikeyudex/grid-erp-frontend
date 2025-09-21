import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView";
import BankAccountsBalanceReport from "../../components/bank-accounts-balance-report";

export default function BankAccountsBalancePage() {
  return (
    <TopLayoutGeneralView
          titleBreadcrumb="Saldos Bancarios"
          pageTitleBreadcrumb="Reportes"
          to="/reports"
          main={<BankAccountsBalanceReport />}
        />
  )
}