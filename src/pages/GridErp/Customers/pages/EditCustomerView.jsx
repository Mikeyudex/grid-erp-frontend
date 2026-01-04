"use client"
import { useNavigate, useParams } from "react-router-dom";
import CreateClientV2 from "./CreateCustomerV2";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { UPDATE_CUSTOMER } from "../helper/url_helper";


const EditCustomerView = () => {
    document.title = "Editar cliente | Quality Erp";

    const navigate = useNavigate();
    const { id } = useParams();

    const handleCancel = () => {
        navigate('/customers/list-v2');
    }

    const handleSubmit = async (payload) => {
        try {
            let token = getToken();
            const response = await fetch(`${UPDATE_CUSTOMER}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el cliente")
            }
            return navigate('/customers/list-v2');
        } catch (err) {
            console.error("Error updating client:", err)
            throw new Error("Error al actualizar el cliente");
        }
    }

    return (
        <CreateClientV2
            mode="edit"
            clientId={id}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    )

}

export default EditCustomerView