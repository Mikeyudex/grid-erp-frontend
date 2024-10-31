import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect, useMemo } from 'react';

const environment = "LOCAL";

export const useWebSocketClient = ({ userId, handler }) => {
    // Determinar la URL del WebSocket en función del entorno
    const wsUrl = useMemo(() => {
        switch (environment) {
            case 'DEV':
                return "ws://localhost:4400";
            case 'LOCAL':
                return "ws://localhost:4400";
            case 'PROD':
                return "";
            default:
                return "ws://localhost:4400";
        }
    }, []);

    const { lastMessage, readyState } = useWebSocket(`${wsUrl}?userId=${userId}`, {
        onOpen: () => console.log('Connected to WebSocket'),
        shouldReconnect: () => true,
        onMessage: useCallback((message) => {
            const { topic, data } = JSON.parse(message.data);
            if (topic === 'notification') {
                handler[topic](data);
            } else if (topic === 'pong') {
                handler[topic](data);
            }
        }, []),
        onClose: () => console.log('Disconnected'),
    });

    useEffect(() => {
        /* if (lastMessage !== null) {
            const { topic, data } = JSON.parse(lastMessage.data);
            if (topic === 'notification') {
                dispatch({ type: 'ADD_NOTIFICATION', notification: data });
            }
        } */
    }, [lastMessage]);

    return { lastMessage, readyState };
};
