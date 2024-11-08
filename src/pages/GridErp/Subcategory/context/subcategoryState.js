import { useReducer } from 'react';
import { UPDATE_SUBCATEGORYDATA } from './types';
import { SubCategoryContext } from './subcategoryContext';
import { SubCategoryReducer } from './subcategoryReducer';

export const SubCategoryProductState = (props) => {

    const initialState = {
        subCategoryData: {
            openDrawer: false,
            subCategoryList: [],
            openBackdrop: false,
        },
    }

    const [state, dispatch] = useReducer(SubCategoryReducer, initialState);

    const updateSubCategoryData = (data) => {
        dispatch({
            type: UPDATE_SUBCATEGORYDATA,
            payload: data
        })
    }

    return (
        <SubCategoryContext.Provider value={
            {
                subCategoryData: state.subCategoryData,
                updateSubCategoryData
            }}>
            {props.children}
        </SubCategoryContext.Provider>
    )

}
