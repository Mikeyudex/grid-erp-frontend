import { Container } from "reactstrap";
import BreadCrumb from "../../pages/GridErp/Products/components/BreadCrumb";


export function TopLayoutGeneralView({ main, titleBreadcrumb, pageTitleBreadcrumb }) {
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title={titleBreadcrumb} pageTitle={pageTitleBreadcrumb} />
                {main}
            </ Container>
        </div>
    );
}