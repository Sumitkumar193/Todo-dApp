"use client";
import { io, Socket } from "socket.io-client";

class WebSocket {
    static instance: Socket;

    static init() {
        if (!WebSocket.instance) {
            WebSocket.instance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
                withCredentials: true,
                reconnection: true,
            });
        }
        return WebSocket.instance;
    }

    static getInstance() {
        return WebSocket.init();
    }

    static emit<T>(event: string, data?: T) {
        WebSocket.instance.emit(event, data);
    }

    static on<T>(event: string, callback: (data: T) => void) {
        WebSocket.instance.on(event, callback);
    }

    static close() {
        WebSocket.instance.close();
    }

}

export default WebSocket;