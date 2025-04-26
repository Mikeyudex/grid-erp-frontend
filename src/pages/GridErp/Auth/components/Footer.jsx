import { Col, Container, Row } from "reactstrap";


export function FooterQuality() {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col lg={12}>
                        <div className="text-center">
                            <p className="mb-0">{new Date().getFullYear()} Backoffice. Creado con <i className="mdi mdi-heart text-danger"></i> por Yudex Labs</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}