import { TopLayoutGeneralView } from "../../../Components/Common/TopLayoutGeneralView";
import AdminUsersContent from "./components/AdminUsersContent";

export default function AdminUsersPage() {
  document.title = "Usuarios | Quality";
  return (
    <TopLayoutGeneralView
      titleBreadcrumb="Usuarios"
      pageTitleBreadcrumb="Home"
      to="/home"
      main={<AdminUsersContent />}
    />
  )
}