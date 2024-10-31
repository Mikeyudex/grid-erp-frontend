import { Button, Col, Row } from "reactstrap";
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
import { Link } from "react-router-dom";


const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

export function TopToolbarActions({
    table
}) {

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    return (
        <Row md={1}
        >
            <Col md={24} >
                <DropdownMenuExport table={table}></DropdownMenuExport>

                <DropdownMenuImport table={table}></DropdownMenuImport>

                <Link to="/products-create" className="text-secondary d-inline-block edit-item-btn">
                    <button
                    style={{background:'#132649', color:'white'}}
                        type="button"
                        className="btn btn-ghost-secondary waves-effect waves-light Innventabtn">
                        <PlusCircledIcon></PlusCircledIcon>
                        <span style={{ marginLeft: '0.3em' }}> Crear</span>
                    </button>
                </Link>

            </Col>

        </Row>
    )
}