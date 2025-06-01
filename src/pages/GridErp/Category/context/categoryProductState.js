import { useReducer } from 'react';
import { UPDATE_CATEGORYDATA } from './types';
import { CategoryProductContext } from './categoryProductContext';
import { CategoryProductReducer } from './categoryProductReducer';

export const CategoryProductState = (props) => {

    const initialState = {
        categoryData: {
            openDrawer: false,
            categoryList: [],
            openBackdrop: false,
            reloadData: false,
        },
    }

    const [state, dispatch] = useReducer(CategoryProductReducer, initialState);

    const updateCategoryData = (data) => {
        dispatch({
            type: UPDATE_CATEGORYDATA,
            payload: data
        })
    }

    return (
        <CategoryProductContext.Provider value={
            {
                categoryData: state.categoryData,
                updateCategoryData
            }}>
            {props.children}
        </CategoryProductContext.Provider>
    )

}
