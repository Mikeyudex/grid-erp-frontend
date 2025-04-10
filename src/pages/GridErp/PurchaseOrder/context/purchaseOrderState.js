import { useReducer } from 'react';
import { UPDATE_DATA } from './types';
import { PurchaseOrderContext } from './purchaseOrderContext';
import { PurchaseOrderReducer } from './purchaseOrderReducer';

export const PurchaseOrderState = (props) => {

    const initialState = {
        purchaseOrderData: {
            openDrawer: false,
            purchaseOrderList: [],
            openBackdrop: false,
            reloadTablePurchaseOrderList: false,
        },
    }

    const [state, dispatch] = useReducer(PurchaseOrderReducer, initialState);

    const updatePurchaseOrderData = (data) => {
        dispatch({
            type: UPDATE_DATA,
            payload: data
        })
    }

    return (
        <PurchaseOrderContext.Provider value={
            {
                purchaseOrderData: state.purchaseOrderData,
                updatePurchaseOrderData
            }}>
            {props.children}
        </PurchaseOrderContext.Provider>
    )

}
