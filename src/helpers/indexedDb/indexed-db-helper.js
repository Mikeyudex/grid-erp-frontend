import { openDB } from 'idb';

// Configuración inicial de IndexedDB
const DATABASE_NAME = 'quality-erp';
const STORE_NAME = 'items';
const DATABASE_VERSION = 1;

export class IndexedDBService {

    // Inicializa o abre la base de datos
    async initDB() {
        return await openDB(DATABASE_NAME, DATABASE_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            },
        });
    };

    async destroyDB() {
        const db = await this.initDB();
        db.close();
    };

    async clearStore() {
        try {
            const db = await this.initDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            await tx.objectStore(STORE_NAME).clear();
            await tx.done;
            console.log(`El almacén ${STORE_NAME} ha sido limpiado.`);
            return true;
        } catch (error) {
            return error;
        }
    };

    // Agregar un nuevo dato
    async addItem(data) {
        const db = await this.initDB();
        const id = await db.add(STORE_NAME, data);
        return id;
    };

    // Obtener todos los datos
    async getAllItems() {
        const db = await this.initDB();
        const items = await db.getAll(STORE_NAME);
        return items;
    };

    //Obtener item por id
    async getItemById(id) {
        const db = await this.initDB();
        const item = await db.get(STORE_NAME, id);
        return item;
    };

    //Eliminar item
    async deleteItem(id) {
        const db = await this.initDB();
        await db.delete(STORE_NAME, id);
    };

    //actualizar item
    async updateItem(id, updatedData) {
        const db = await this.initDB();
        await db.put(STORE_NAME, { ...updatedData, id });
    };

    async findItem(key, value) {
        const db = await this.initDB();
        const allItems = await db.getAll(STORE_NAME);
        return allItems.find((item) => item[key] === value) || null;
    };

}
