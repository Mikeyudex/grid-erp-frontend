import { TopLayoutGeneralView } from "../../../Components/Common/TopLayoutGeneralView";
import AdminRolesContent from "./components/AdminRoleContent";

export default function AdminRolesPage() {
  document.title = "Roles | Quality";
  return (
    <TopLayoutGeneralView
      titleBreadcrumb="Roles"
      pageTitleBreadcrumb="Home"
      to="/home"
      main={<AdminRolesContent />}
    />
  )
}