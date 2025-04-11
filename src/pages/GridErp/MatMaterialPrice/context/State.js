import { useReducer } from 'react';
import { UPDATE_DATA } from './types';
import { MatMaterialPriceContext } from './Context';
import { MatMaterialPriceReducer } from './Reducer';

export const MatMaterialPriceState = (props) => {

    const initialState = {
        matMaterialPriceData: {
            openDrawer: false,
            matMaterialPriceList: [],
            openBackdrop: false,
            reloadTableMatMaterialPriceList: false,
            openModalAddMaterialPrice: false,
        },
    }

    const [state, dispatch] = useReducer(MatMaterialPriceReducer, initialState);

    const updateMatMaterialPriceData = (data) => {
        dispatch({
            type: UPDATE_DATA,
            payload: data
        })
    }

    return (
        <MatMaterialPriceContext.Provider value={
            {
                matMaterialPriceData: state.matMaterialPriceData,
                updateMatMaterialPriceData
            }}>
            {props.children}
        </MatMaterialPriceContext.Provider>
    )

}
