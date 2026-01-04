import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutesv2";
import { AuthAndResourceProtected } from './AuthProtected';
import { CustomerState } from '../pages/GridErp/Customers/context/customerState';
import { PurchaseOrderState } from '../pages/GridErp/PurchaseOrder/context/purchaseOrderState';
import { MatMaterialPriceState } from '../pages/GridErp/MatMaterialPrice/context/State';
import { ProfileState } from '../context/profile/profileState';
import {UnauthorizedPage} from '../pages/GridErp/commons/UnauthorizedPage';

const Index = () => {
    return (
        <React.Fragment>
            <ProfileState>
                <CustomerState>
                    <PurchaseOrderState >
                        <MatMaterialPriceState>
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

                                {/* Ruta de acceso no autorizado */}
                                <Route
                                    path="/unauthorized"
                                    element={
                                        <NonAuthLayout>
                                            <UnauthorizedPage />
                                        </NonAuthLayout>
                                    }
                                />

                                <Route>
                                    {authProtectedRoutes.map((route, idx) => (
                                        <Route
                                            path={route.path}
                                            element={
                                                <AuthAndResourceProtected>
                                                    <VerticalLayout>
                                                        {route.component}
                                                    </VerticalLayout>
                                                </AuthAndResourceProtected>}
                                            key={idx}
                                            exact={true}
                                        />
                                    ))}
                                </Route>
                            </Routes>
                        </MatMaterialPriceState>
                    </PurchaseOrderState>
                </CustomerState>
            </ProfileState>
        </React.Fragment>
    );
};

export default Index;