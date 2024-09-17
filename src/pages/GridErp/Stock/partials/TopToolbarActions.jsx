import { Button, Col, Row } from "reactstrap";
import {
    MaterialReactTable,
    createMRTColumnHelper,
    useMaterialReactTable,
} from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import DropdownOptions from "./BtnOptions";



const columnHelper = createMRTColumnHelper();

const columns = [
    columnHelper.accessor('name', {
        header: 'Producto',
        size: 100,
    }),
    columnHelper.accessor('warehouse', {
        header: 'Bodega',
        size: 80,
    }),
    columnHelper.accessor('stock', {
        header: 'Stock',
        size: 40,
    }),
    columnHelper.accessor('costPrice', {
        header: 'Precio de costo',
        size: 100,
    }),
    columnHelper.accessor('salePrice', {
        header: 'Precio de venta',
        size: 100,
    }),
    columnHelper.accessor('category', {
        header: 'Categoría',
        size: 120,
    }),
    columnHelper.accessor('subCategory', {
        header: 'Subcategoría',
        size: 120,
    }),
    columnHelper.accessor('createdAt', {
        header: 'Creado',
        size: 80,
    }),
];

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
                <DropdownOptions table={table}></DropdownOptions>
            </Col>

        </Row>
    )
}