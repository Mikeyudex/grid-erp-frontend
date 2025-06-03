"use client"
import { useNavigate, useParams } from "react-router-dom";
import LayoutCreateProductTapete from "../components/LayoutCreateProductTapete";
import { getToken } from "../../../../helpers/jwt-token-access/get_token";
import { UPDATE_PRODUCT } from "../helper/url_helper";


const EditProductMatView = () => {
    document.title = "Editar producto | Quality Erp";

    const pathListProducts = '/products-list-v2';
    const navigate = useNavigate();
    const { id } = useParams();

    const handleCancel = () => {
        navigate(pathListProducts);
    }

    const handleSubmit = async (payload) => {
        try {
            let token = getToken();
            const response = await fetch(`${UPDATE_PRODUCT}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el producto")
            }
            return navigate(pathListProducts);
        } catch (err) {
            console.error("Error updating product:", err)
            throw new Error("Error al actualizar el producto");
        }
    }

    return (
        <LayoutCreateProductTapete
            mode="edit"
            productId={id}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    )

}

export default EditProductMatView