import React, { useEffect, useState, useMemo } from "react";
import { Container, Row } from "reactstrap";
import { SubCategoryHelper } from "../helper/subcategory_helper";
import { FormatDate } from "../../Products/components/FormatDate";
import { ToastContainer } from "react-toastify";
import { TableContainerListSubCategories } from "../partials/TableContainerListSubCategories";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { SubCategoryContext } from "../context/subcategoryContext";
import { DrawerCreateSubCategory } from "../components/DrawerCreateSubCategory";


const helper = new SubCategoryHelper();

export function ListSubCategories() {
    document.title = "Subcategorías | Innventa-G";
    const { updateSubCategoryData, subCategoryData } = React.useContext(SubCategoryContext);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(false);
    const [dataSelectCategories, setDataSelectCategories] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20, //customize the default page size
    });
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        if (!subCategoryList.length) {
            setIsLoadingTable(true);
        } else {
            setShowProgressBarTable(true);
        }

        helper.getSubCategories(pagination.pageIndex + 1, pagination.pageSize)
            .then(async (response) => {
                let categories = response?.data;
                console.log(categories);
                
                let totalRowCount = response?.totalRowCount;
                if (categories && Array.isArray(categories) && categories.length > 0) {
                    let parseCategories = categories.map((c) => {
                        return {
                            id: c?._id,
                            name: c?.name,
                            shortCode: c?.shortCode,
                            description: c?.description,
                            createdAt: c?.createdAt,
                        }
                    });
                    setSubCategoryList(parseCategories);
                    setRowCount(totalRowCount);
                }
                return;
            })
            .catch(e => console.log(e))
            .finally(() => {
                setIsLoadingTable(false);
                setShowProgressBarTable(false);
            });
    }, [subCategoryData.subCategoryList]);

    useEffect(() => {
        console.log('useEffect');
        //do something when the pagination state changes
    }, [pagination.pageIndex, pagination.pageSize]);

    const columns = useMemo(() =>
        [
            {
                header: "Nombre",
                accessorKey: "name",
                enableColumnFilter: false,
                enableEditing: false,
                size: 300, //large column
                Cell: ({ cell }) => (
                    <h5>{cell.row.original.name}</h5>
                ),
            },
            {
                header: "Código corto",
                accessorKey: "shortCode",
                enableColumnFilter: false,
                enableEditing: false,
                size: 200, //large column
                Cell: ({ cell }) => (
                    <h5>{cell.row.original.shortCode}</h5>
                ),
            },
            {
                header: "Descripción",
                accessorKey: "description",
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell }) => (
                    <h5>{cell.row.original.description}</h5>
                ),
            },
            {
                header: "Creado",
                accessorKey: "createdAt",
                enableColumnFilter: false,
                enableEditing: false,
                Cell: ({ cell }) => {
                    return <FormatDate {...cell} />;
                },
            },

        ],
        [validationErrors]
    );


    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />

            <DrawerCreateSubCategory />

            <Container fluid>
                <BreadCrumb title="Ver subcategorías" pageTitle="subcategorías" />
                <Row>
                    <div className="card-body pt-2 mt-1">
                        <TableContainerListSubCategories
                            columns={columns}
                            dataList={subCategoryList}
                            setDataList={setSubCategoryList}
                            isLoadingTable={isLoadingTable}
                            showProgressBarTable={showProgressBarTable}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                            pagination={pagination}
                            setPagination={setPagination}
                            rowCount={rowCount}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    )
}