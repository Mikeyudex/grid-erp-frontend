import React, { useEffect, useState, useMemo } from "react";
import {
    Container,
    Row,
} from "reactstrap";
import { useSnackbar } from 'react-simple-snackbar';
import { ToastContainer } from "react-toastify";

import "nouislider/distribute/nouislider.css";
import { optionsSnackbarDanger, optionsSnackbarSuccess, ProductHelper } from "../../Products/helper/product_helper";
import BreadCrumb from "../../Products/components/BreadCrumb";
import { MatMaterialPriceContext } from "../context/Context";
import { FormatDate } from "../../Products/components/FormatDate";
import { TableListMatMaterialPrice } from "../partials/TableListMatMaterialPrice";
import { Link } from "react-router-dom";
import ModalAddMaterialPrice from "../components/ModalAddMatMaterialPrice";

const helper = new ProductHelper();

export const ListMatMaterialPrice = (props) => {
    document.title = "Tipo - Material | Quality";

    const { updateMatMaterialPriceData, matMaterialPriceData } = React.useContext(MatMaterialPriceContext);
    const [matMaterialPriceList, setMatMaterialPriceList] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showProgressBarTable, setShowProgressBarTable] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [openSnackbarSuccess, closeSnackbarSuccess] = useSnackbar(optionsSnackbarSuccess);
    const [openSnackbarDanger, closeSnackbarDanger] = useSnackbar(optionsSnackbarDanger);
    const [openModalAdd, setOpenModalAdd] = useState(false);

    const handleCloseModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
        updateMatMaterialPriceData({ ...matMaterialPriceData, openModalAddMaterialPrice: !matMaterialPriceData.openModalAddMaterialPrice });
    }

    useEffect(() => {
        helper.getMatMaterialPrices()
            .then(async (response) => {
                let matMaterialPrices = response;
                if (matMaterialPrices && Array.isArray(matMaterialPrices) && matMaterialPrices.length > 0) {
                    setMatMaterialPriceList(matMaterialPrices);
                    updateMatMaterialPriceData({ ...matMaterialPriceData, matMaterialPriceList: [...matMaterialPriceData.matMaterialPriceList, matMaterialPrices] });
                }
                return;
            })
            .catch(e => {
                openSnackbarDanger('Ocurrió un error :(, intenta más tarde.');
                console.log(e);
            })
            .finally(() => {
                setIsLoadingTable(false);
                setShowProgressBarTable(false);
            });
    }, []);


    useEffect(() => {
        setOpenModalAdd(matMaterialPriceData.openModalAddMaterialPrice);
    }, [matMaterialPriceData.openModalAddMaterialPrice]);

    const columns = useMemo(() =>
        [
            {
                header: "Id",
                accessorKey: "id",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 30,
                Cell: ({ cell }) => {
                    return (
                        <Link to={`/purchase-orders/view-detail/${cell.row.original._id}`}>
                            <h6>{cell.row.original._id}</h6>
                        </Link>
                    )
                }
            },
            {
                header: "Tipo",
                accessorKey: "tipo_tapete",
                enableColumnFilter: true,
                enableEditing: false,
                grow: true,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.tipo_tapete}</h6>)
                }
            },
            {
                header: "Material",
                accessorKey: "tipo_material",
                enableColumnFilter: true,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.tipo_material}</h6>)
                },
            },
            {
                header: "Precio Base",
                accessorKey: "precioBase",
                enableColumnFilter: false,
                enableEditing: false,
                size: 30,
                Cell: ({ cell }) => {
                    return (<h6>{cell.row.original.precioBase.toLocaleString()}</h6>)
                },
            },

        ],
        [matMaterialPriceList, validationErrors]
    );

    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Lista de tipo - material" pageTitle="Tipo - Material" />
                <ModalAddMaterialPrice
                    isOpen={openModalAdd}
                    closeModal={handleCloseModalAdd} />
                <Row>
                    <div className="card-body pt-2 mt-1">
                        <TableListMatMaterialPrice
                            columns={columns}
                            list={(matMaterialPriceList || [])}
                            isLoadingTable={isLoadingTable}
                            showProgressBarTable={showProgressBarTable}
                            setList={setMatMaterialPriceList}
                            setValidationErrors={setValidationErrors}
                            validationErrors={validationErrors}
                        />
                    </div>
                </Row>
            </Container>
        </div>
    );
};

