import { Fragment } from "react"
import { Col, Row } from "reactstrap"


export default function LayoutTextInputs({
    item1,
    item2,
    item3,
    item3_5,
    item4,
    item5,
    title,
    md1,
    md2,
    md3,
    md3_5,
    md4,
    md5,
    group
}) {

    return (

        <Fragment>
            {/* Sección info básica del producto */}
            <Col md={12} style={{ padding: '1em' }}>

                <h5>{title}</h5>

                <div className="card-create-product shadow">
                    {/* Agrupar items en una sola row */}
                    {
                        group ? (
                            <>

                                <Row className="p-3">

                                    <Col md={md1}>
                                        {item1}
                                    </Col>

                                    <Col md={md2}>
                                        {item2}
                                    </Col>

                                </Row>
                                {
                                    item3 && (
                                        <Row className="p-3">
                                            <Col md={md3}>
                                                {item3}
                                            </Col>

                                            <Col md={md3_5}>
                                                {item3_5}
                                            </Col>
                                        </Row>
                                    )
                                }

                                {
                                    item4 && (
                                        <Row className="p-3">
                                            <Col md={md4}>
                                                {item4}
                                            </Col>
                                        </Row>
                                    )
                                }

                                {
                                    item5 && (
                                        <Row className="p-3">
                                            <Col md={md5}>
                                                {item5}
                                            </Col>
                                        </Row>
                                    )
                                }
                            </>
                        ) :
                            (
                                <>
                                    {
                                        item1 && (
                                            < Row className="p-3">
                                                <Col md={md1}>
                                                    {item1}
                                                </Col>
                                            </Row>
                                        )
                                    }

                                    {
                                        item2 && (
                                            <Row className="p-3">
                                                <Col md={md2}>
                                                    {item2}
                                                </Col>
                                            </Row>
                                        )
                                    }

                                    {
                                        item3 && (
                                            <Row className="p-3">
                                                <Col md={md3}>
                                                    {item3}
                                                </Col>
                                            </Row>
                                        )
                                    }

                                    {
                                        item4 && (
                                            <Row className="p-3">
                                                <Col md={md4}>
                                                    {item4}
                                                </Col>
                                            </Row>
                                        )
                                    }

                                    {
                                        item5 && (
                                            <Row className="p-3">
                                                <Col md={md5}>
                                                    {item5}
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </>
                            )
                    }

                </div>

            </Col>


        </Fragment >
    )

}