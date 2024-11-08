import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    DownloadIcon
} from '@radix-ui/react-icons';
import './dropdownExports.css';

const DropdownMenuExport = ({table}) => {

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                   /*  disabled={table.getPrePaginationRowModel().rows.length === 0}
                    onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)} */
                    type="button"
                    className="btn btn-ghost-secondary waves-effect waves-light Innventabtn">
                    <DownloadIcon></DownloadIcon>
                    <span style={{marginLeft:'0.3em'}}>Exportar</span> 
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Item className="DropdownMenuItem">
                        Exportar todo<div className="RightSlot">⌘+T</div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem">
                        Exportar filas<div className="RightSlot">⌘+N</div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem">
                        Exportar página <div className="RightSlot">⇧+⌘+N</div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem" disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}>
                        Exportar selección <div className="RightSlot">⇧+⌘+N</div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default DropdownMenuExport;
