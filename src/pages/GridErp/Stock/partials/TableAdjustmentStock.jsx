import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ListProductHelper } from '../../Products/helper/list_products_helper';
import { TopToolbarActions } from '../../Products/partials/TopToolbarActions';
import './table.css'
import { IconsTopToolbarAction } from '../../Products/partials/IconsTopToolbarAction';
import { Col, Row } from 'reactstrap';

const listProductsHelper = new ListProductHelper();

export function TableAdjustmentStock({
  columns,
  isLoadingTable,
  showProgressBarTable,
  adjustmentList,
  setAdjustmenttList,
  setValidationErrors
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const handleSaveRow = async ({
      exitEditingMode,
      row,
      values
  }) => {
      const newValidationErrors = listProductsHelper.validateProduct(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
          setValidationErrors(newValidationErrors);
          return;
      }
      setValidationErrors({});
      setIsUpdatingUser(true);
      await updateProduct(row, values);
      setIsUpdatingUser(false);
      exitEditingMode();
  };

  /* const updateProduct = async (row, values) => {
      try {
          let idProduct = row?.id;
          values['id'] = idProduct;
          console.log(values);
          let changes = listProductsHelper.detectChanges(productList[row.index], values);
          console.log('Cambios: ', changes);

          await listProductsHelper.updateProduct(changes, idProduct);
          productList[row.index] = values;
          setProductList([...productList]);
      } catch (error) {
          console.log(error);
      }
  } */

  const deleteProduct = async (id) => {
      try {
          await listProductsHelper.deleteProduct(id);
      } catch (error) {
          console.log(error);
      }
  }

  //DELETE action
  const openDeleteConfirmModal = async (row) => {
      if (window.confirm('Está seguro que desea eliminar el producto?')) {
          setIsDeletingUser(true);
          await deleteProduct(row.original.id);
          setIsDeletingUser(false);
      }
  };

  const table = useMaterialReactTable({
      columns,
      data: adjustmentList,
      /* Editing Row */
      enableEditing: true,
      createDisplayMode: "row",
      editDisplayMode: 'row',
      onEditingRowSave: handleSaveRow,
      onEditingRowCancel: () => setValidationErrors({}),
      variant: 'outlined',
      /* End Editing Row */
      renderRowActions: ({ row, table }) => (
          <Fragment>
              <ul className="list-inline hstack gap-2 mb-0">
                  <li className="list-inline-item edit">
                      <Link
                          to="#"
                          className="text-secondary d-inline-block edit-item-btn"
                          onClick={() => table.setEditingRow(row)}
                      >
                          <button type="button" class="btn btn-outline-primary btn-icon waves-effect waves-light">
                              <i className="ri-pencil-line"></i>
                          </button>
                      </Link>
                  </li>

                  <li className="list-inline-item">
                      <Link
                          to="#"
                          className="d-inline-block remove-item-btn"
                          onClick={() => openDeleteConfirmModal(row)}
                      >
                          <button type="button" class="btn btn-outline-danger btn-icon waves-effect waves-light">
                              <i className="ri-delete-bin-5-line"></i>
                          </button>
                      </Link>
                  </li>
              </ul>
          </Fragment>
      ),
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
          <TopToolbarActions table={table}></TopToolbarActions>
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
