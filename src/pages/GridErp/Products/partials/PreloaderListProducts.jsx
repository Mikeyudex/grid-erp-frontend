import { Container, Nav, NavItem, NavLink, Row } from "reactstrap";
import BreadCrumb from "../components/BreadCrumb";
import classnames from "classnames";


export function PreloaderListProducts({ toggleTab, activeTab }) {

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Ver productos" pageTitle="Productos" />
                    <Row>
                        <div className="col-xl-12 col-lg-12">
                            <div>
                                <div className="card">
                                    <div className="card-header border-0">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <Nav
                                                    className="nav-tabs-custom card-header-tabs border-bottom-0"
                                                    role="tablist"
                                                >
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames(
                                                                { active: activeTab === "1" },
                                                                "fw-semibold text-body"
                                                            )}
                                                            onClick={() => {
                                                                toggleTab("1", "all");
                                                            }}
                                                            href="#"
                                                        >
                                                            All{" "}

                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames(
                                                                { active: activeTab === "2" },
                                                                "fw-semibold text-body"
                                                            )}
                                                            onClick={() => {
                                                                toggleTab("2", "published");
                                                            }}
                                                            href="#"
                                                        >
                                                            Published{" "}
                                                            <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                                                                5
                                                            </span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames(
                                                                { active: activeTab === "3" },
                                                                "fw-semibold text-body"
                                                            )}
                                                            onClick={() => {
                                                                toggleTab("3", "draft");
                                                            }}
                                                            href="#"
                                                        >
                                                            Draft
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </div>

                                            <div className="py-4 text-center">
                                                <div className="mt-4">
                                                    <h5>Cargando productos...</h5>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        </>
    )

}