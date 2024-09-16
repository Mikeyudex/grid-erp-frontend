import React, { Fragment } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    UploadIcon
} from '@radix-ui/react-icons';
import './dropdownExports.css';

const DropdownMenuImport = ({ table }) => {

    return (
        <Fragment>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild className='px-2'>
                    <button
                         disabled={table.getPrePaginationRowModel().rows.length === 0}
                         onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                        type="button"
                        className="btn btn-ghost-secondary waves-effect waves-light Innventabtn">
                        <UploadIcon />
                        <span style={{ marginLeft: '0.3em' }}>Importar</span>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                        <DropdownMenu.Item className="DropdownMenuItem">
                            Importar csv<div className="RightSlot">⌘+T</div>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="DropdownMenuItem">
                            Descargar plantilla<div className="RightSlot">⌘+N</div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Arrow className="DropdownMenuArrow" />
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

        </Fragment>
    );
};

export default DropdownMenuImport;
