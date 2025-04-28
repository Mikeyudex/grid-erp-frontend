import { UPDATE_PROFILE } from './types';


export function ProfileReducer(state, action) {

    const { payload, type } = action


    switch (type) {

        case UPDATE_PROFILE:
            return {
                ...state,
                payload
            }

    
        default:
            break;
    }

} 