import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useDialog} from "../utils/DialogContext";
import {Client} from "@stomp/stompjs";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [currentUser] = useContext(AuthContext);
    const clientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const {showDialog} = useDialog();

    const SOCKET_URL = "ws://localhost:8081/ws";

    useEffect(() => {
        if(currentUser && currentUser.id) {
            clientRef.current = null;
            const client = new Client({
                brokerURL: SOCKET_URL,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            client.onConnect = () => {
                subscriptionRef.current = client.subscribe(
                    `/topic/notifications-${currentUser.id}`,
                    (message) => {
                        console.log(message)
                        //const notification = JSON.parse(message.body);
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
}

export default Notifications;