import { UPDATE_SUBCATEGORYDATA} from './types';


export function SubCategoryReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_SUBCATEGORYDATA:
            return {
                ...state,
                subCategoryData: payload
            }
        default:
            break;
    }

} 