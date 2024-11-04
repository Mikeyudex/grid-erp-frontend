import { Button, Col, Row } from "reactstrap";
import React from "react";
import {
    MaterialReactTable,
    createMRTColumnHelper,
    useMaterialReactTable,
} from 'material-react-table';
import {
    PlusCircledIcon
} from '@radix-ui/react-icons';
import { mkConfig, generateCsv, download } from 'export-to-csv';

import DropdownExport from "./dropdown/dropdownExports";
import DropdownMenuExport from "./dropdown/dropdownExports";
import DropdownMenuImport from "./dropdown/DropdownImport";
import { CategoryProductContext } from "../context/categoryProductContext";


const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

export function TopToolbarActions({
    table
}) {
    const { updateCategoryData, categoryData } = React.useContext(CategoryProductContext);
    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const handleClickCreateCategory = () => {
        updateCategoryData({ ...categoryData, openDrawer: true });
    };

    return (
        <Row md={1}
        >
            <Col md={24} >
                <DropdownMenuExport table={table}></DropdownMenuExport>

                <DropdownMenuImport table={table}></DropdownMenuImport>
                <button
                    onClick={handleClickCreateCategory}
                    style={{ background: '#132649', color: 'white' }}
                    type="button"
                    className="btn btn-ghost-secondary waves-effect waves-light Innventabtn">
                    <PlusCircledIcon></PlusCircledIcon>
                    <span style={{ marginLeft: '0.3em' }}> Crear</span>
                </button>
            </Col>

        </Row>
    )
}