"use client"

import { useEffect, useState } from "react"
import { Badge, Button, Popover, PopoverBody, PopoverHeader, ListGroup, ListGroupItem, Spinner, Tooltip } from "reactstrap"
import { Users, Wifi, WifiOff, Clock, Circle, UserMinus2Icon } from "lucide-react"
import { useSocketIO } from "../../hooks/use-websocket-io";

export function ConnectedUsers({
    websocketUrl,
    maxVisibleAvatars = 5,
    showConnectionStatus = true,
    className = "",
    currentUserId,
}) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverReady, setPopoverReady] = useState(false);
    const [tooltipUserMinus2Icon, setTooltipUserMinus2Icon] = useState(false);
    const { isConnected, connectedUsers, connectionError, changeUserStatus } = useSocketIO({ url: websocketUrl, currentUserId })

    // Obtener iniciales del nombre
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    // Obtener color del estado
    const getStatusColor = (status) => {
        switch (status) {
            case "online":
                return "success"
            case "away":
                return "warning"
            case "busy":
                return "danger"
            default:
                return "secondary"
        }
    }

    // Obtener texto del estado
    const getStatusText = (status) => {
        switch (status) {
            case "online":
                return "En línea"
            case "away":
                return "Ausente"
            case "busy":
                return "Ocupado"
            case "offline":
                return "Desconectado"
            default:
                return "Desconocido"
        }
    }

    // Formatear tiempo desde la última actividad
    const getLastSeenText = (lastSeen) => {
        const now = new Date()
        const diffMs = now.getTime() - lastSeen.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "Ahora"
        if (diffMins < 60) return `Hace ${diffMins}m`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `Hace ${diffHours}h`

        const diffDays = Math.floor(diffHours / 24)
        return `Hace ${diffDays}d`
    }

    const visibleUsers = connectedUsers.slice(0, maxVisibleAvatars)
    const hiddenUsersCount = Math.max(0, connectedUsers.length - maxVisibleAvatars)

    useEffect(() => {
        const checkTargetExists = () => {
            const exists = document.getElementById("connected-users-popover");
            setPopoverReady(!!exists);
        };

        checkTargetExists();

        const interval = setInterval(checkTargetExists, 100);
        return () => clearInterval(interval);
    }, []);

    const togglePopover = () => setPopoverOpen(!popoverOpen);

    return (
        <div className={`d-flex align-items-center ${className}`}>
            {/* Indicador de conexión */}
            {showConnectionStatus && (
                <div className="me-3 d-flex align-items-center">
                    {isConnected ? (
                        <div className="d-flex align-items-center text-success">
                            <Wifi size={16} className="me-1" />
                            <small>Conectado</small>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center text-danger">
                            <WifiOff size={16} className="me-1" />
                            <small>Desconectado</small>
                        </div>
                    )}
                </div>
            )}

            {/* Avatares de usuarios */}
            <div className="d-flex align-items-center position-relative">
                {!isConnected && !connectionError && (
                    <div className="d-flex align-items-center text-muted">
                        <Spinner size="sm" className="me-2" />
                        <small>Conectando...</small>
                    </div>
                )}

                {connectionError && (
                    <div className="d-flex align-items-center text-danger">
                        <WifiOff size={16} className="me-1" />
                        <small>Error de conexión</small>
                    </div>
                )}

                {isConnected && connectedUsers.length === 0 && (
                    <div className="d-flex align-items-center text-muted" id="UserMinus2Icon-container">
                        <UserMinus2Icon size={16} className="me-1 cursor-pointer" />
                        {/*  <small>Sin usuarios conectados</small> */}
                        <Tooltip
                            isOpen={tooltipUserMinus2Icon}
                            placement="top"
                            target="UserMinus2Icon-container"
                            toggle={() => setTooltipUserMinus2Icon(!tooltipUserMinus2Icon)}
                        >
                            Sin usuarios conectados
                        </Tooltip>
                    </div>
                )}

                {isConnected && connectedUsers.length > 0 && (
                    <>
                        {/* Avatares visibles */}
                        <div className="d-flex" style={{ marginRight: "-8px" }}>
                            {visibleUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="position-relative"
                                    style={{
                                        marginLeft: index > 0 ? "-8px" : "0",
                                        zIndex: visibleUsers.length - index,
                                    }}
                                >
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold border border-2 border-white"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            backgroundColor: user.avatar ? "transparent" : "#6c757d",
                                            backgroundImage: user.avatar ? `url(${user.avatar})` : "none",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            fontSize: "12px",
                                        }}
                                        title={`${user.name} - ${getStatusText(user.status)}`}
                                    >
                                        {!user.avatar && getInitials(user.name)}
                                    </div>

                                    {/* Indicador de estado */}
                                    <div
                                        className={`position-absolute rounded-circle border border-2 border-white bg-${getStatusColor(user.status)}`}
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            bottom: "-2px",
                                            right: "-2px",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Contador de usuarios adicionales */}
                        {hiddenUsersCount > 0 && (
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold border border-2 border-white"
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    fontSize: "11px",
                                    marginLeft: "-8px",
                                    zIndex: 0,
                                }}
                                title={`${hiddenUsersCount} usuarios más`}
                            >
                                +{hiddenUsersCount}
                            </div>
                        )}

                        {/* Botón para mostrar lista completa */}
                        <Button
                            id="connected-users-popover"
                            color="link"
                            size="sm"
                            className="p-1 ms-2 text-decoration-none"
                            onClick={togglePopover}
                        >
                            <Users size={16} />
                            <Badge color="primary" pill className="ms-1">
                                {connectedUsers.length}
                            </Badge>
                        </Button>

                        {/* Popover con lista completa */}
                        {popoverReady && (
                            <Popover
                                placement="bottom-end"
                                isOpen={popoverOpen}
                                target="connected-users-popover"
                                toggle={togglePopover}
                            >
                                <PopoverHeader className="d-flex align-items-center justify-content-between">
                                    <span className="me-2">Usuarios Conectados</span>
                                    <Badge color="primary" pill>
                                        {connectedUsers.length}
                                    </Badge>
                                </PopoverHeader>
                                <PopoverBody className="p-0 w-100" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    <ListGroup flush>
                                        {connectedUsers.map((user) => (
                                            <ListGroupItem key={user.id} className="d-flex align-items-center py-2 px-3">
                                                {/* Avatar + estado */}
                                                <div className="d-flex align-items-center me-2" style={{ minWidth: "32px", position: "relative" }}>
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                                        style={{
                                                            width: "28px",
                                                            height: "28px",
                                                            backgroundColor: user.avatar ? "transparent" : "#6c757d",
                                                            backgroundImage: user.avatar ? `url(${user.avatar})` : "none",
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        {!user.avatar && getInitials(user.name)}
                                                    </div>
                                                    <Circle
                                                        size={8}
                                                        className={`position-absolute text-${getStatusColor(user.status)}`}
                                                        style={{
                                                            bottom: "-2px",
                                                            right: "-2px",
                                                            fill: "currentColor",
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1 text-truncate">
                                                    <div className="fw-medium text-truncate" style={{ fontSize: "14px" }}>
                                                        {user.name}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: "12px" }}>
                                                        <span className={`text-${getStatusColor(user.status)}`}>{getStatusText(user.status)}</span>
                                                    </div>
                                                </div>
                                                {/* {
                                                    user.status === "offline" && (
                                                        <div className="text-muted d-flex align-items-center p-1" style={{ fontSize: "11px" }}>
                                                            <Clock size={12} className="me-1" />
                                                            {getLastSeenText(user.lastSeen)}
                                                        </div>
                                                    )
                                                } */}

                                                {/* Última vez */}
                                                <div className="text-muted d-flex align-items-center" style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                                                    <Clock size={12} className="me-1" />
                                                    {getLastSeenText(user.lastSeen)}
                                                </div>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </PopoverBody>
                            </Popover>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
