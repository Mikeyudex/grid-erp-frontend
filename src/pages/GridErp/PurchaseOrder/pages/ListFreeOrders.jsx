import { ListPurchaseOrder } from "./ListPurchaseOrder";

export const ListFreeOrders = () => {
    document.title = "Ordenes de pedido libres | Quality";
    return (
        <ListPurchaseOrder status="libre" />
    )
}