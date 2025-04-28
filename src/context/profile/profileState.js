import { useReducer } from 'react';
import { ProfileReducer } from './profileReducer';
import { ProfileContext } from './profileContext';
import { UPDATE_PROFILE } from './types';

export const ProfileState = (props) => {


    const initialState = {
        changeAvatar: false,
    }

    const [state, dispatch] = useReducer(ProfileReducer, initialState);

    const updateProfile = (data) => {
        dispatch({
            type: UPDATE_PROFILE,
            payload: data
        })
    }

    return (
        <ProfileContext.Provider value={
            {
                updateProfile,
                profile: state
            }}>
            {props.children}
        </ProfileContext.Provider>
    )

}


