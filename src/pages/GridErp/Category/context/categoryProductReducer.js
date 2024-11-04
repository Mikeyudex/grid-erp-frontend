import { UPDATE_CATEGORYDATA } from './types';


export function CategoryProductReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_CATEGORYDATA:
            return {
                ...state,
                categoryData: payload
            }
        default:
            break;
    }

} 