import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

const api = new APIClient();

export class ListProductHelper {

    validateRequired = (value) => !!value.length;

    validateProduct(product) {
        return {
            name: !this.validateRequired(product.name) ? 'El nombre del producto es requerido' : '',
            category: !this.validateRequired(product.category) ? 'La categoría es requerida' : '',
            subCategory: !this.validateRequired(product.subCategory) ? 'La subcategoría es requerida' : '',
            stock: !this.validateRequired(String(product.stock)) ? 'El stock es requerido' : '',
            warehouse: !this.validateRequired(product.warehouse) ? 'La bodega es requerida' : '',
            salePrice: !this.validateRequired(typeof product.salePrice === 'number' ? String(product.salePrice) : product.salePrice) ? 'El precio de venta es requerido' : '',
            costPrice: !this.validateRequired(typeof product.costPrice === 'number' ? String(product.costPrice) : product.costPrice) ? 'El precio de costo es requerido' : '',
        };
    }

    detectChanges = (original, updated) => {
        const changes = {};

        Object.keys(updated).forEach((key) => {
            if (original[key] !== updated[key]) {
                changes[key] = updated[key];
            }
        });
        return changes;
    };

    updateProduct = (payload, id) => api.put(`${url.UPDATE_PRODUCT}/${id}`, payload);

    deleteProduct = (id) => api.delete(`${url.DELETE_PRODUCT}/${id}`);
}