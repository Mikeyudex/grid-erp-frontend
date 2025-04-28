import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row } from 'reactstrap';

import { validateToken } from '../../../../helpers/jwt-token-access/validate-token';
import { returnToSignIn } from '../../../../helpers/jwt-token-access/return_to_signin';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';

const HomeBackoffice = () => {

    document.title = "Home | ERP Quality";
    const navigate = useNavigate();

    useEffect(() => {
        validateToken()
            .then((isValid) => {
                if (!isValid) {
                    return returnToSignIn(navigate);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Home" pageTitle="Home" />
                    <Row>
                        <Col xs={12} md={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Home</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <span>
                                        Home page
                                    </span>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default HomeBackoffice;