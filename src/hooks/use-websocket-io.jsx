import { useEffect, useState, useRef, useCallback } from "react"
import { io } from "socket.io-client";
import { IndexedDBService } from "../helpers/indexedDb/indexed-db-helper";
import { PATH_SOCKETIO_BACKOFFICE } from "../helpers/url_helper";

const indexedDbService = new IndexedDBService();

export function useSocketIO({ url, currentUserId }) {
    const socketRef = useRef(null);

    const [connectedUsers, setConnectedUsers] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [connectionError, setConnectionError] = useState(null)

    const updateUser = useCallback((updatedUser) => {
        setConnectedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUser.id
                    ? { ...user, ...updatedUser, lastSeen: new Date() }
                    : user
            )
        )
    }, [])

    useEffect(() => {
        const socket = io(url, {
            path: PATH_SOCKETIO_BACKOFFICE,
            transports: ["websocket"],
        })

        socketRef.current = socket

        socket.on("connect", async () => {
            setIsConnected(true)
            setConnectionError(null)
            socket.emit("get_connected_users")

            // Registra automáticamente al reconectar
            if (currentUserId) {
                try {
                    const user = await indexedDbService.getItemById(currentUserId);
                    if (user) {
                        let userSocket = {
                            id: user?.id,
                            name: user?.name,
                            email: user?.email,
                            avatar: user?.avatar,
                            role: user?.role?.name,
                        }
                        socket.emit("register_user", userSocket);
                    } else {
                        console.warn("Usuario no encontrado en IndexedDB");
                    }
                } catch (error) {
                    console.error("Error cargando usuario de IndexedDB", error);
                }
            }
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })

        socket.on("connect_error", (err) => {
            console.error("Connection error:", err)
            setConnectionError("No se pudo conectar al servidor")
        })

        socket.on("users_list", ({ users }) => {
            const usersWithLastSeen = users.map((u) => ({
                ...u,
                lastSeen: new Date(),
            }))
            setConnectedUsers(usersWithLastSeen)
        })

        socket.on("user_connected", (user) => {
            setConnectedUsers((prev) => {
                const exists = prev.find((u) => u.id === user.id)
                if (exists) return prev
                return [...prev, { ...user, lastSeen: new Date() }]
            })
        })

        socket.on("user_disconnected", ({ userId }) => {
            updateUser({ id: userId, status: "offline" })
        })

        socket.on("user_status_changed", ({ userId, status }) => {
            updateUser({ id: userId, status })
        })

        return () => {
            socket.disconnect()
        }
    }, [url, updateUser])

    const changeUserStatus = (status) => {
        const socket = socketRef.current
        if (socket && isConnected) {
            socket.emit("change_status", { status })
        }
    }

    const registerUser = (user) => {
        const socket = socketRef.current
        if (socket && isConnected) {
            socket.emit("register_user", user)
        }
    }

    const unregisterUser = (userId) => {
        const socket = socketRef.current
        if (socket && isConnected) {
            socket.emit("unregister_user", { userId })
        }
    }

    const disconnectSocket = () => {
        const socket = socketRef.current
        if (socket) {
            socket.disconnect()
        }
    }

    const filteredUsers = connectedUsers.filter(user => user.id !== currentUserId)

    return {
        isConnected,
        connectedUsers: filteredUsers,
        /* connectedUsers, */
        connectionError,
        changeUserStatus,
        registerUser,
        unregisterUser,
        disconnectSocket,
    }
}
