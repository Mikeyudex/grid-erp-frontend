"use client"

import { useState, useEffect } from "react"
import { ToastContainer } from "react-toastify"
import { Container } from "reactstrap"
import BreadCrumb from "../../Products/components/BreadCrumb";
import { numberFormatPrice, ProductHelper } from "../../Products/helper/product_helper"
import { obtenerAtributosUnicos, transformarDatos } from "../utils/order"
import OrderGrid from "../components/order-item-grid"
import { AccountHelper } from "../../Accounts/helpers/account_helper";
import { PurchaseHelper } from "../helper/purchase_helper";
import moment from "moment";


const productHelper = new ProductHelper();
const accountHelper = new AccountHelper();
const purchaseHelper = new PurchaseHelper();

export default function PurchaseOrderPage() {
    document.title = "Crear pedido | Quality";
    const [selectedClient, setSelectedClient] = useState(null);
    //const [products, setProducts] = useState([]);
    //const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [clients, setClients] = useState([]);
    const [matMaterialPrices, setMatMaterialPrices] = useState([]);
    const [matTypeOptions, setMatTypeOptions] = useState([]);
    const [materialTypeOptions, setMaterialTypeOptions] = useState([]);
    const [accountList, setAccountList] = useState([]);
    const [advances, setAdvances] = useState([]);

    const handleGetProducts = async () => {
        try {
            let response = await productHelper.getProductsLite(1, 100);
            return response?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetClients = async () => {
        try {
            let response = await productHelper.getClients(1, 100, ["_id", "name", "lastname", "commercialName", "email", "typeCustomerId", "documento", "contacts"]);
            return response?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetAdvanceByCustomer = async () => {
        try {
            let response = await purchaseHelper.getAdvanceByCustomer(selectedClient?._id);
            return response?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleGetMatMaterialPrices = async () => {
        try {
            let response = await productHelper.getMatMaterialPrices();
            return response || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const handleGetAccounts = async () => {
        try {
            let response = await accountHelper.getAccounts();
            return response?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client)
    };

    useEffect(() => {
        handleGetClients()
            .then(async (c) => {
                let clients = (c || [])
                    .map((c) => ({
                        ...c,
                        id: c._id,
                        name: `${c.name} ${c.lastname}`,
                        company: c.commercialName,
                        typeCustomerId: c.typeCustomerId?._id,
                        typeCustomerName: c.typeCustomerId?.name,
                        documento: c.documento,
                        contacts: c?.contacts,
                    }));
                setClients(clients);
            })
            .catch(e => console.log(e))
    }, []);

    useEffect(() => {
        handleGetMatMaterialPrices()
            .then(async (data) => {
                //mapear los objetos que sean diferentes
                let matTypeOptions = obtenerAtributosUnicos(data, "tipo_tapete");
                let materialTypeOptions = obtenerAtributosUnicos(data, "tipo_material");
                setMatTypeOptions(matTypeOptions);
                setMaterialTypeOptions(materialTypeOptions);
                let transformedData = transformarDatos(data);
                setMatMaterialPrices(transformedData);
            })
            .catch(e => console.log(e))
    }, []);

    useEffect(() => {
        handleGetAccounts()
            .then(async (data) => {
                let accounts = data;
                setAccountList(accounts);
            })
            .catch(e => console.log(e))
    }, []);

    /* useEffect(() => {
        handleGetProducts()
            .then(async (data) => {
                let products = data;
                setProducts(products);
            })
            .catch(e => console.log(e))
            .finally(() => {
                setIsLoadingProducts(false);
            });
    }, []); */

    useEffect(() => {
        if (selectedClient) {
            handleGetAdvanceByCustomer()
                .then(async (data) => {
                    let advances = data;
                    if (advances.length > 0) {
                        setAdvances(advances);
                        setAccountList(prev => [...prev, ...advances.map(a => ({
                            _id: a._id,
                            name: `${a?.typeOperation} - ${numberFormatPrice(a?.value)} - (${moment(a?.date).format("DD/MM/YYYY")})`,
                            typeAccount: a?.typeOperation,
                            description: a?.description,
                        }))]);
                    }
                })
                .catch(e => console.log(e))
        }
    }, [selectedClient]);


    return (
        <div className="page-content">
            <ToastContainer closeButton={false} limit={1} />
            <Container fluid>
                <BreadCrumb title="Crear Orden de Pedido" pageTitle="Pedidos" to={`/purchase-orders`} />
                <OrderGrid
                    selectedClient={selectedClient}
                    onClientSelect={handleClientSelect}
                    clients={clients}
                    /* products={products} */
                    matTypeOptions={matTypeOptions}
                    materialTypeOptions={materialTypeOptions}
                    matMaterialPrices={matMaterialPrices}
                    accountList={accountList}
                    advances={advances}
                />
            </Container>
        </div>
    )
}

