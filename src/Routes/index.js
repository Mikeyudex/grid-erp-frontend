import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutesv2";
import { AuthProtected } from './AuthProtected';
import { CustomerState } from '../pages/GridErp/Customers/context/customerState';
import {PurchaseOrderState} from '../pages/GridErp/PurchaseOrder/context/purchaseOrderState';


const Index = () => {
    return (
        <React.Fragment>
            <CustomerState>
                <PurchaseOrderState >
                    <Routes>
                        <Route>
                            {publicRoutes.map((route, idx) => (
                                <Route
                                    path={route.path}
                                    element={
                                        <NonAuthLayout>
                                            {route.component}
                                        </NonAuthLayout>
                                    }
                                    key={idx}
                                    exact={true}
                                />
                            ))}
                        </Route>

                        <Route>
                            {authProtectedRoutes.map((route, idx) => (
                                <Route
                                    path={route.path}
                                    element={
                                        <AuthProtected>
                                            <VerticalLayout>{route.component}</VerticalLayout>
                                        </AuthProtected>}
                                    key={idx}
                                    exact={true}
                                />
                            ))}
                        </Route>
                    </Routes>
                </PurchaseOrderState>
            </CustomerState>
        </React.Fragment>
    );
};

export default Index;