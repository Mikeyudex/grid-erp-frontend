import { useReducer } from 'react';
import { UPDATE_IMPORTDATA } from './types';
import { ImportProductReducer } from './importProductReducer';
import { ImportProductContext } from './importProductContext';

export const ImportProductState = (props) => {

    const initialState = {
        importData: {
            openDrawer: false,
            importType: 'xlsx',
            file: null,
            fileName: null,
            fileType: null,
            fileSize: null,
            importProducts: []
        },
    }

    const [state, dispatch] = useReducer(ImportProductReducer, initialState);

    const updateImportData = (data) => {
        dispatch({
            type: UPDATE_IMPORTDATA,
            payload: data
        })
    }

    return (
        <ImportProductContext.Provider value={
            {
                importData: state.importData,
                updateImportData
            }}>
            {props.children}
        </ImportProductContext.Provider>
    )

}
