import RoomList from "./Components/Room/RoomList/RoomList";
import useWebSocket from "react-use-websocket";

import {RoomModel} from "./Models/Room.model";
import {SyntheticEvent, useState} from "react";
import {WSS_FEED_URL} from "./api";
import {UserModel} from "./Models/User.model";
import {Messages} from "./Messages";
import Heading from "./Components/Heading/Heading";
import ChatList from "./Components/Chat/ChatList/ChatList";
import {MessageModel} from "./Models/Message.model";
import LogList from "./Components/Log/LogList/LogList";

import styles from "./App.module.scss"
import {LogModel} from "./Models/Log.model";

function App() {
    const {sendJsonMessage, getWebSocket} = useWebSocket(WSS_FEED_URL, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => setCurrenRoom(undefined),
        shouldReconnect: (closeEvent) => true,
        onMessage: (event: WebSocketEventMap['message']) => processMessages(JSON.parse(event.data))
    });

    const [user, setUser] = useState<UserModel>()
    const [rooms, setRooms] = useState<RoomModel[]>([]);
    const [currentRoom, setCurrenRoom] = useState<RoomModel>();
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [logItems, setLogItems] = useState<LogModel[]>([])

    const processMessages = (data: any) => {
        setLogItems([...logItems, {
            type: data.type,
            message: data?.payload.message,
            received: true,
        }].slice(-100))

        switch (data.type) {
            case Messages.User:
                setUser(data.payload);
                break;
            case Messages.ListRoom:
                setRooms([...data.payload.slice(-30)])
                break;
            case Messages.History:
                setMessages([...data.payload.slice(-100)])
                break;
            case Messages.Message:
                setMessages(messages => [...messages, data.payload])
                break;
        }
    }

    const selectRoom = async (room: RoomModel) => {
        setCurrenRoom(room);
        sendJsonMessage({
            "type": Messages.SelectRoom,
            "payload": {
                "uuid": room.uuid
            }
        });
        setLogItems([...logItems, {
            type: Messages.SelectRoom,
            received: false,
            message: room.name.slice(0, 17) + "..."
        }].slice(-100))
    }

    const changeRoomName = async (name: string, room: RoomModel) => {
        sendJsonMessage({
                "type": Messages.SelectRoomName,
                "payload": {
                    "uuid": room.uuid,
                    "name": name,
                }
            }
        );
        setLogItems([...logItems, {
            type: Messages.SelectRoomName,
            received: false,
            message: name
        }].slice(-100))
    }

    const changeRoomColor = async (color: string, room: RoomModel) => {
        sendJsonMessage({
                "type": Messages.SelectRoomColor,
                "payload": {
                    "uuid": room.uuid,
                    "color": color,
                }
            }
        );
        setLogItems([...logItems, {
            type: Messages.SendMessage,
            received: false,
            message: color
        }].slice(-100))
    }

    const sendMessage = async (event: SyntheticEvent, messageBody: string) => {
        event.preventDefault();
        sendJsonMessage({
                "type": Messages.SendMessage,
                "payload": {
                    "body": messageBody,
                }
            }
        );
        setLogItems([...logItems, {
            type: Messages.SendMessage,
            received: false,
            message: messageBody.slice(0, 17) + "..."
        }].slice(-100))

    }
    const createRoom = async () => {
        await sendJsonMessage({
                "type": Messages.CreateRoom,
                "payload": {}
            }
        );

        setLogItems([...logItems, {
            type: Messages.CreateRoom,
            received: false
        }].slice(-100))

    }

    const leaveRoom = async () => {
        setLogItems([...logItems, {
            type: Messages.LeaveRoom,
            received: false,
            message: currentRoom?.name.slice(0, 17) + "..."
        }].slice(-100))

        await sendJsonMessage({
                "type": Messages.LeaveRoom,
                "payload": {}
            }
        );
        setCurrenRoom(undefined);
    }

    const deleteRoom = async (room: RoomModel) => {
        await sendJsonMessage({
                "type": Messages.DeleteRoom,
                "payload": {
                    "uuid": room.uuid
                }
            }
        );
        setLogItems([...logItems, {
            type: Messages.DeleteRoom,
            received: false,
            message: room.name.slice(0, 17) + "..."
        }].slice(-100))

    }

    return (
        <div className={styles.app}>
            <Heading callback={leaveRoom} user={user} room={currentRoom}/>
            <div className={styles.body}>
                <LogList logItems={logItems}/>
                <div>
                    {currentRoom ?
                        <div>
                            <ChatList callback={sendMessage} messages={messages} user={user}/>
                        </div>
                        :
                        <div className={styles.rooms}>
                            <RoomList callbackDelete={deleteRoom} callback={createRoom} setSelectRoom={selectRoom}
                                      rooms={rooms} callbackChangeColor={changeRoomColor}
                                      callbackChangeName={changeRoomName}/>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
