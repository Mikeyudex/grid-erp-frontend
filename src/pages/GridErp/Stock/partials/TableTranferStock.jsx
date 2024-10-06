import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
  import { MRT_Localization_ES } from 'material-react-table/locales/es';
  import { Fragment, useEffect, useState } from 'react';
  
  import { ListProductHelper } from '../../Products/helper/list_products_helper';
  import { TopToolbarActions } from '../partials/TopToolbarActions';
  import './table.css'
  import { IconsTopToolbarAction } from '../../Products/partials/IconsTopToolbarAction';
import DropdownOptionsTransferStock from './BtnOptionsTransferStock';
  
  const listProductsHelper = new ListProductHelper();
  
  export function TableTransferStock({
    columns,
    isLoadingTable,
    showProgressBarTable,
    movementList,
    setValidationErrors,
    toggleDrawer
  }) {
    const [rowSelection, setRowSelection] = useState({});
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
  


    const table = useMaterialReactTable({
        columns,
        data: movementList,
        enableRowSelection: true,
        positionActionsColumn: 'last',
        getRowId: (row) => row.id,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            isLoading: isLoadingTable,
            showProgressBars: showProgressBarTable,
            isSaving: isUpdatingUser || isDeletingUser,
            columnPinning: { right: ['mrt-row-actions'] },
        },
        enableColumnPinning: true,
        enableColumnOrdering: true,
        enableGlobalFilter: true,
        muiTableContainerProps: { sx: { maxHeight: '400px' } },
        muiTableBodyCellProps: {
            sx: (theme) => ({
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.grey[900]
                        : theme.palette.white,
            }),
        },
        muiTableHeadCellProps: {
            sx: {
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Outfit'
            },
        },
        muiTableBodyRowProps: {
            sx: {
                '&:hover': { backgroundColor: '#f8faff !important' }
            }
        },
        localization: MRT_Localization_ES,
        positionToolbarAlertBanner: 'bottom',
        enableStickyHeader: true,
        renderTopToolbarCustomActions: ({ table }) => (
            <TopToolbarActions 
            table={table}
            toggleDrawer={toggleDrawer}
            dropdownOptions={DropdownOptionsTransferStock}
            viewType={'transferStock'}
            ></TopToolbarActions>
        ),
        icons: IconsTopToolbarAction
    });
  
    useEffect(() => {
        console.info(rowSelection); //read your managed row selection state
        //console.info(table.getState().rowSelection); //alternate way to get the row selection state
    }, [rowSelection]);
  
  
  
    return (
        <Fragment>
            <MaterialReactTable table={table} localization={MRT_Localization_ES} />
        </Fragment>
    )
  }
  