import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";


export function NavItemsListProducts(
    { toggleTab, activeTab, setDeleteModalMulti, dele }
) {

    return (
        <>
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

                    <div className="col-auto">
                        <div id="selection-element">
                            <div className="my-n1 d-flex align-items-center text-muted">
                                Select{" "}
                                <div
                                    id="select-content"
                                    className="text-body fw-semibold px-1"
                                >{dele}</div>{" "}
                                Result{" "}
                                <button
                                    type="button"
                                    className="btn btn-link link-danger p-0 ms-3"
                                    onClick={() => setDeleteModalMulti(true)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}