import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardBody, Collapse } from "reactstrap";

export function CollapsibleSection({ id, title, icon: Icon, isOpen, onToggle, children, badge = null }) {
    return (
        <Card className="mb-3 section-card">
            <div className="section-header" onClick={() => onToggle(id)} style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center">
                        <Icon size={20} className="me-2 text-primary" />
                        <h5 className="mb-0 section-title">{title}</h5>
                        {badge && <span className="badge bg-primary ms-2">{badge}</span>}
                    </div>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            <Collapse isOpen={isOpen}>
                <CardBody className="pt-0">{children}</CardBody>
            </Collapse>
        </Card>
    )
}