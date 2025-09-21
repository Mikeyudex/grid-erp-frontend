import { TopLayoutGeneralView } from "../../../../../Components/Common/TopLayoutGeneralView";
import ProductSalesReport from "../../components/product-sales-report";

export default function ProductSalesReportPage() {
    document.title = "Ventas por Producto | Quality";
    return (

        <TopLayoutGeneralView
            titleBreadcrumb="Ventas por Producto"
            pageTitleBreadcrumb="Reportes"
            to="/reports"
            main={<ProductSalesReport />}
        />
    )
}