import { UPDATE_IMPORTDATA } from './types';


export function ImportProductReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_IMPORTDATA:
            return {
                ...state,
                importData: payload
            }
        default:
            break;
    }

} 