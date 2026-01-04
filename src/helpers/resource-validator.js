import { IndexedDBService } from "./indexedDb/indexed-db-helper";

const indexedDBService = new IndexedDBService();

/**
 * Normaliza un path para comparación
 * Ejemplos:
 * - "/products-create" -> "products"
 * - "/purchase-orders/create" -> "purchase-orders"
 * - "/reports-cumulative-sales" -> "reports"
 * - "/admin-users" -> "admin"
 */
const normalizePathForComparison = (path) => {
    // Remover slash inicial si existe
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Extraer el primer segmento (antes del primer slash)
    const firstSegment = cleanPath.split("/")[0];

    // Extraer la primera parte (antes del primer guión)
    const baseSegment = firstSegment.split("-")[0];

    return baseSegment;
};

/**
 * Valida si el usuario tiene acceso a un recurso basado en el path actual
 * Soporta rutas con "/" y "-"
 * 
 * Ejemplos de coincidencias:
 * - Recurso: "/products" coincide con: "/products-create", "/products-list", "/products/123"
 * - Recurso: "/purchase-orders" coincide con: "/purchase-orders/create", "/purchase-orders/edit/123"
 * - Recurso: "/reports" coincide con: "/reports-cumulative-sales", "/reports-detailed-sales"
 * - Recurso: "/admin" coincide con: "/admin-users", "/admin-roles"
 */
export const validateResourceAccess = async (currentPath) => {
    try {
        const user = await indexedDBService.getItemById(localStorage.getItem('userId'));
        const resources = user?.resources;

        if (currentPath === "/home") {
            return true;
        }

        if (!resources || resources.length === 0) {
            return false;
        }

        // Normalizar el path actual
        const currentBaseSegment = normalizePathForComparison(currentPath);

        // Validar si existe algún recurso que coincida
        const hasAccess = resources.some(resource => {
            if (!resource.path) return false;

            const resourceBaseSegment = normalizePathForComparison(resource.path);

            return resourceBaseSegment === currentBaseSegment;
        });

        return hasAccess;
    } catch (error) {
        console.error("Error validating resource access:", error);
        return false;
    }
};
