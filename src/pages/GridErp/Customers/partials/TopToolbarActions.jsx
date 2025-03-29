import { Col, Row } from "reactstrap";

import { mkConfig, generateCsv, download } from 'export-to-csv';
import DropdownOptions from "./BtnOptions";
import DropdownOptionsTransferStock from "./BtnOptionsTransferStock";

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});


export function TopToolbarActions({
    table,
    toggleDrawer,
    viewType
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

                {
                    <DropdownOptions
                        toggleDrawer={toggleDrawer}
                        table={table} />
                }

            </Col>

        </Row>
    )
}