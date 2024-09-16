import { Fragment } from "react"
import { Col, Row } from "reactstrap"

export default function LayoutProductImages({
    item1
}) {

    return (
        <Fragment>
            {/* Sección imagenes del producto */}
            <Col md={12} style={{ padding: '1em'}}>

                <h5>Imágenes del producto</h5>

                <div className="card-create-product shadow" style={{height:'28em', display:'flex', justifyContent:'center', alignContent:'center', flexDirection:'column'}}>

                    <Row className="p-3">

                        <Col>
                            {item1}
                        </Col>

                    </Row>

                </div>

            </Col>

        </Fragment>
    )

}