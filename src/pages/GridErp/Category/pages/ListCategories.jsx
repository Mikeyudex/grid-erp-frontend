import React, { useEffect, useState, useMemo, useContext } from "react";
import { Container, Row } from "reactstrap";
import { CategoryHelper } from "../helper/category_helper";
import { FormatDate } from "../../Products/components/FormatDate";
import { ToastContainer } from "react-toastify";
import { TableContainerListCategories } from "../partials/TableContainerListCategories";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { useWebSocketClient } from "../../../../context/websocketClient";
import { DrawerCreateCategory } from "../components/DrawerCreateCategory";
import { CategoryProductContext } from "../context/categoryProductContext";


const helper = new CategoryHelper();

export function ListCategories() {
    document.title = "Categorias | Innventa-G";
    const { updateCategoryData, categoryData } = React.useContext(CategoryProductContext);
    const [categoryList, setCategoryList] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(false);
    const [dataSelectCategories, setDataSelectCategories] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20, //customize the default page size
    });
    const [rowCount, setRowCount] = useState(0);

    const handler = {
        notification: (data) => {
            console.log('Notification received:', data);
        },
        pong: (data) => {
            console.log('Pong received:', data);
        },
        importProduct: (data) => {
            console.log('Product received:', data);
        },
    };

    /*  useWebSocketClient({ userId: "1143135078", handler });
  */
    useEffect(() => {
        if (!categoryList.length) {
            setIsLoadingTable(true);
        } else {
            setShowProgressBarTable(true);
        }

        helper.getCategories(pagination.pageIndex + 1, pagination.pageSize)
            .then(async (response) => {
                let categories = response?.data;
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
                    setCategoryList(parseCategories);
                    setRowCount(totalRowCount);
                }
                return;
            })
            .catch(e => console.log(e))
            .finally(() => {
                setIsLoadingTable(false);
                setShowProgressBarTable(false);
            });
    }, [categoryData.categoryList]);

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

            <DrawerCreateCategory />

            <Container fluid>
                <BreadCrumb title="Ver categorías" pageTitle="Categorías" />
                <Row>
                    <div className="card-body pt-2 mt-1">
                        <TableContainerListCategories
                            columns={columns}
                            dataList={categoryList}
                            setDataList={setCategoryList}
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