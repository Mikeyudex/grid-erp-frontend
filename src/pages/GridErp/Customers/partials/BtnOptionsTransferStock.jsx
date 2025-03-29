import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CgOptions } from "react-icons/cg";
import { CiSquarePlus } from "react-icons/ci";
import { GrDocumentDownload } from "react-icons/gr";
import { RiFileDownloadFill } from "react-icons/ri";
import { TbFileExport } from "react-icons/tb";
import './BtnOptions.css';

const DropdownOptionsTransferStock = ({ table, toggleDrawer }) => {

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="btn btn-ghost-secondary waves-effect waves-light Innventabtn">
                    <CgOptions></CgOptions>
                    <span style={{ marginLeft: '0.3em' }}>Opciones</span>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={toggleDrawer}>
                        <div className="LeftSlot"><CiSquarePlus /></div>
                        <span style={{marginLeft:'0.5em'}} >Nuevo traslado</span> 
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem">
                    <div className="LeftSlot"><GrDocumentDownload /></div>
                    <span style={{marginLeft:'0.5em'}} >Exportar filas</span> 
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem">
                    <div className="LeftSlot"><RiFileDownloadFill /></div>
                    <span style={{marginLeft:'0.5em'}} >Exportar página</span> 
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem" disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}>
                    <div className="LeftSlot"><TbFileExport /></div>
                    <span style={{marginLeft:'0.5em'}} >Exportar selección</span> 
                    </DropdownMenu.Item>

                    <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default DropdownOptionsTransferStock;
