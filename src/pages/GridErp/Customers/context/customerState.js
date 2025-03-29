import { useReducer } from 'react';
import { UPDATE_CUSTOMER_DATA } from './types';
import { CustomerContext } from './customerContext';
import { CustomerReducer } from './customerReducer';

export const CustomerState = (props) => {

    const initialState = {
        customerData: {
            openDrawer: false,
            customerList: [],
            typeCustomerList: [],
            openBackdrop: false,
            openModalCreateTypeCustomer: false,
            reloadTableTypeCustomer: false,
        },
    }

    const [state, dispatch] = useReducer(CustomerReducer, initialState);

    const updateCustomerData = (data) => {
        dispatch({
            type: UPDATE_CUSTOMER_DATA,
            payload: data
        })
    }

    return (
        <CustomerContext.Provider value={
            {
                customerData: state.customerData,
                updateCustomerData
            }}>
            {props.children}
        </CustomerContext.Provider>
    )

}
