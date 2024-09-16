() => {
    const [tableData, setTableData] = useState(data);

    const handleSaveRow = ({
        exitEditingMode,
        row,
        values
    }) => {
        tableData[row.index] = values;
        setTableData([...tableData]);
        exitEditingMode();
    };

    return <MaterialReactTable
        columns={[{
            accessorKey: 'firstName',
            header: 'First Name'
        }, {
            accessorKey: 'lastName',
            header: 'Last Name'
        }, {
            accessorKey: 'address',
            header: 'Address'
        }, {
            accessorKey: 'state',
            header: 'State'
        }, {
            accessorKey: 'phoneNumber',
            enableEditing: false,
            header: 'Phone Number'
        }]}
        createDisplayMode="row"
        data={tableData}
        editDisplayMode="row"
        enableEditing
        onCreatingRowSave={() => { }}
        onEditingRowSave={handleSaveRow}
        renderTopToolbarCustomActions={({ table }) => <Button onClick={() => table.setCreatingRow(true)}>Add</Button>} />;
}