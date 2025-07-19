import { useEffect, useRef } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useSocketIO } from "../../hooks/use-websocket-io";
import { URL_BASE_WEBSOCKET } from "../../helpers/url_helper";
import { IndexedDBService } from "../../helpers/indexedDb/indexed-db-helper";

const indexedDbService = new IndexedDBService();

export const SocketNotifier = () => {
    const currentUserId = localStorage.getItem("userId");

    const cacheRef = useRef({
        connected: new Set(),
        disconnected: new Set(),
        statusChanged: new Map(),
    });

    const { connectedUsers, isConnected } = useSocketIO({
        url: URL_BASE_WEBSOCKET,
        currentUserId: currentUserId,
    });

    const getAvatar = async (userId) => {
        const userData = await indexedDbService.getItemById(userId);
        if (userData && userData.avatar) {
            return userData.avatar;
        } else {
            return "https://via.placeholder.com/150"; // URL por defecto si no hay avatar
        }
    }

    // 🟢 User connected notification
    useEffect(() => {
        if (!connectedUsers || !isConnected) return;

        connectedUsers.forEach((user) => {
            if (user.id !== currentUserId && !cacheRef.current.connected.has(user.id)) {
                cacheRef.current.connected.add(user.id);
                getAvatar(user.id)
                    .then((avatar) => {
                        Toastify({
                            text: `${user.name} se ha conectado`,
                            duration: 4000,
                            gravity: "bottom",
                            position: "right",
                            stopOnFocus: true,
                            close: true,
                            className: "toastify-connection",
                            avatar: avatar,

                        }).showToast();
                    })
                    .catch((error) => {
                        console.error("Error cargando avatar de usuario", error);
                    });
            }
        });
    }, [connectedUsers, currentUserId, isConnected]);

    // 🔴 User disconnected notification
    useEffect(() => {
        connectedUsers.forEach((user) => {
            if (
                user.id !== currentUserId &&
                user.status === "offline" &&
                !cacheRef.current.disconnected.has(user.id)
            ) {
                cacheRef.current.disconnected.add(user.id);
                getAvatar(user.id)
                    .then((avatar) => {
                        Toastify({
                            text: `${user.name} se ha desconectado`,
                            duration: 4000,
                            gravity: "bottom",
                            position: "right",
                            stopOnFocus: true,
                            close: true,
                            className: "toastify-disconnection",
                            avatar: avatar,
                        }).showToast();
                    })
                    .catch((error) => {
                        console.error("Error cargando avatar de usuario", error);
                    });
            }
        });
    }, [connectedUsers, currentUserId]);

    // 🔄 User status changed notification
    useEffect(() => {
        connectedUsers.forEach((user) => {
            if (user.id === currentUserId) return;

            const lastStatus = cacheRef.current.statusChanged.get(user.id);
            if (lastStatus && lastStatus !== user.status) {
                getAvatar(user.id)
                    .then((avatar) => {
                        Toastify({
                            text: `${user.name} está ahora ${user.status}`,
                            duration: 3000,
                            gravity: "bottom",
                            position: "right",
                            stopOnFocus: true,
                            close: true,
                            avatar: avatar,
                            backgroundColor: user.status === "online" ? "#4CAF50" : "#FF9800",
                        }).showToast();
                    })
                    .catch((error) => {
                        console.error("Error cargando avatar de usuario", error);
                    });
            }
            cacheRef.current.statusChanged.set(user.id, user.status);
        });
    }, [connectedUsers, currentUserId]);

    return null; // No renderiza nada, solo escucha y lanza notificaciones
};