



export class ProductionHelper {

    constructor() {

    }

    getStatusBadgeColorItem(estado) {
        switch (estado) {
            case "pendiente":
                return "warning"
            case "fabricacion":
                return "primary"
            case "finalizado":
                return "success"
            case "inventario":
                return "info"
            case "cancelado":
                return "danger"
            default:
                return "secondary"
        }
    }

    getStatusBadgeColorOrder(estado) {
        switch (estado) {
            case "libre":
                return "warning"
            case "asignado":
                return "primary"
            case "fabricacion":
                return "info"
            case "despachado":
                return "success"
            default:
                return "secondary"
        }
    }

    getEstadoTextItem(estado) {
        console.log(estado);
        
        switch (estado) {
            case "pendiente":
                return "Pendiente"
            case "fabricacion":
                return "Fabricación"
            case "finalizado":
                return "Finalizado"
            case "inventario":
                return "Inventario"
            case "cancelado":
                return "Cancelado"
            default:
                return "Desconocido"
        }
    }

    getEstadoTextOrder(estado) {
        switch (estado) {
            case "libre":
                return "Libre"
            case "asignado":
                return "Asignado"
            case "fabricacion":
                return "Fabricación"
            case "despachado":
                return "Despachado"
            default:
                return "Desconocido"
        }
    }

}
