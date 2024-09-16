import React, { useState, useEffect } from 'react';
import { Container, Row} from 'reactstrap';



export function LayoutForm({main}){



    return (
        <React.Fragment>

        <Row>

            <Container fluid>

                {main}

            </Container>

        </Row>


        </React.Fragment>
    )

}