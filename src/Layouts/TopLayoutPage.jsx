import { ToastContainer } from "react-toastify";
import BreadCrumb from "../pages/GridErp/Products/components/BreadCrumb";
import { Container } from "reactstrap";


export default function TopLayoutPage({ children, title, pageTitle }) {
    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
            <BreadCrumb title={title} pageTitle={pageTitle} />
                {children}
            </Container>
        </div>

    )
}