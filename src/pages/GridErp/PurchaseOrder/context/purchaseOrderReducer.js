import { UPDATE_DATA } from './types';


export function PurchaseOrderReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_DATA:
            return {
                ...state,
                purchaseOrderData: payload
            }
        default:
            break;
    }

} 