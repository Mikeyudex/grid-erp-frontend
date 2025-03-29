import { UPDATE_CUSTOMER_DATA } from './types';


export function CustomerReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_CUSTOMER_DATA:
            return {
                ...state,
                customerData: payload
            }
        default:
            break;
    }

} 