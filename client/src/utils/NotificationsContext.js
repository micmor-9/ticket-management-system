import {createContext, useEffect, useRef, useState} from "react";
import {useAuth} from "./AuthContext";
import {useDialog} from "./DialogContext";
import {Client} from "@stomp/stompjs";

export const NotificationsContext = createContext();

export const useNotifications = () => {
    const savedNotifications = sessionStorage.getItem("notifications");
    const [notifications, setNotifications] = useState(savedNotifications ? JSON.parse(atob(savedNotifications)) : []);
    const [currentUser] = useAuth();
    const clientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const {showDialog} = useDialog();

    const SOCKET_URL = "ws://localhost:8081/ws";

    useEffect(() => {
        if (currentUser && currentUser.id) {
            clientRef.current = null;
            const client = new Client({
                brokerURL: SOCKET_URL,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            client.onConnect = () => {
                sessionStorage.setItem("notifications", notifications ? btoa(JSON.stringify(notifications)) : btoa(null));
                subscriptionRef.current = client.subscribe(
                    `/topic/notifications-${currentUser.id}`,
                    (message) => {
                        const notification = JSON.parse(message.body);
                        showDialog(notification.description, "info");
                        setNotifications((notifications) => [...notifications, notification]);
                        const savedNotifications = sessionStorage.getItem("notifications");
                        if (savedNotifications) {
                            const decodedNotifications = JSON.parse(atob(savedNotifications));
                            sessionStorage.setItem("notifications", btoa(JSON.stringify([...decodedNotifications, notification])));
                        } else {
                            sessionStorage.setItem("notifications", btoa(JSON.stringify([notification])));
                        }
                    }
                );
                console.log(`Connected to notifications-${currentUser.id}!`);
            };

            client.onStompError = function (frame) {
                console.log("Broker reported error: " + frame.headers["message"]);
                console.log("Additional details: " + frame.body);
            };

            client.onWebSocketError = function (frame) {
                console.log("WS reported error: ");
                console.log(frame);
            };

            client.onDisconnect = () => {
                console.log("Disconnected!");
            };

            client.activate();

            clientRef.current = client;

            return () => {
                if (clientRef.current) {
                    if (clientRef.current.active) {
                        try {
                            if (subscriptionRef.current)
                                subscriptionRef.current.unsubscribe();
                            clientRef.current.deactivate();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            };
        }
    }, [currentUser]);

    return [notifications, setNotifications];
};