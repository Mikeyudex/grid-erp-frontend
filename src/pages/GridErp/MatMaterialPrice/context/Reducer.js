import { UPDATE_DATA } from './types';


export function MatMaterialPriceReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_DATA:
            return {
                ...state,
                matMaterialPriceData: payload
            }
        default:
            break;
    }

} 