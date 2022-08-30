import asyncio
import json
from json import JSONDecodeError

import websockets
import logging

from websockets.exceptions import ConnectionClosedError

from models.message import Message
from models.model_types import ModelTypes
from models.room import Room
from models.user import User
from server.messages import Messages, MessageBodies

from config import Config


class Chat:
    TYPE = str(ModelTypes.CHAT)
    logger = logging.getLogger(TYPE)
    logging.basicConfig(level=logging.DEBUG, format="%(message)s")

    rooms = {}
    clients = set()

    def __init__(self):
        self.methods = {
            MessageBodies.SELECT_ROOM: self.select_room,
            MessageBodies.LIST_ROOM: self.list_room,
            MessageBodies.CREATE_ROOM: self.create_room,
            MessageBodies.SEND_MESSAGE: self.send_message,
            MessageBodies.LEAVE_ROOM: self.leave_room,
            MessageBodies.DELETE_ROOM: self.delete_room,
            MessageBodies.CHANGE_ROOM_COLOR: self.change_room_color,
            MessageBodies.CHANGE_ROOM_NAME: self.change_room_name
        }

    async def change_room_name(self, payload: dict, user: User) -> bool:
        # try:
            room_uuid = payload["uuid"]
            room: Room = self.rooms.get(room_uuid)
            room_name = payload["name"]
            if room:
                self.logger.info(f"Changing name for {room} to {room_name}")
                room.set_name(room_name)
                await user.websocket.send(json.dumps(Messages.OK))
                await self.broadcast_rooms()
                return True
            else:
                self.logger.info(f"No room found for {user}")
                await user.websocket.send(json.dumps(Messages.NO_SPECIFIED_ROOM))
                return False
        # except KeyError:
        #     await user.websocket.send(json.dumps(
        #         Messages.BAD_DATA_SENT
        #     ))
        #     return False

    async def change_room_color(self, payload: dict, user: User) -> bool:
        try:
            color: str = payload["color"]
            room: Room = self.rooms.get(payload["uuid"])
            if not room:
                await user.websocket.send(json.dumps(
                    Messages.NO_SPECIFIED_ROOM
                ))
                return False

            if Room.check_color(color):
                self.logger.info(f"Changing color of {room.name}")
                room.set_color(color)
                await user.websocket.send(json.dumps(
                    Messages.OK
                ))
                await self.broadcast_rooms()
                return True
            else:
                await user.websocket.send(json.dumps(
                    Messages.BAD_DATA_SENT
                ))
                return False

        except KeyError:
            await user.websocket.send(json.dumps(
                Messages.BAD_DATA_SENT
            ))
            return False

    async def create_room(self, payload: dict, user: User) -> bool:
        room = Room()
        self.rooms[str(room.uuid)] = room
        self.logger.info(f"Created room: {room} for {user}")
        await user.websocket.send(json.dumps(Messages.OK))
        await self.broadcast_rooms()
        return True

    async def list_room(self, payload: dict, user: User) -> bool:
        rooms = [room.get_dict() for _, room in self.rooms.items()]
        self.logger.info(f"Retrieved rooms list for {user}")
        await user.websocket.send(json.dumps({
            "type": MessageBodies.LIST_ROOM,
            "payload": rooms,
        }))
        return True

    async def select_room(self, payload: dict, user: User) -> bool:
        try:
            room_uuid = payload["uuid"]
            room: Room = self.rooms.get(room_uuid)
            if room:
                self.logger.info(f"Selected {room} for {user}")
                user.set_room(room)
                room.add_user(user)

                history = [message.get_dict() for message in room.messages]

                await user.websocket.send(json.dumps({
                    "type": MessageBodies.HISTORY,
                    "payload": history
                }))
                return True
            else:
                self.logger.info(f"No room found for {user}")
                await user.websocket.send(json.dumps(Messages.NO_SPECIFIED_ROOM))
                return False

        except KeyError:
            self.logger.info(f"Bad data for {user}")
            await user.websocket.send(json.dumps(Messages.BAD_DATA_SENT))
            return False

    async def leave_room(self, payload: dict, user: User) -> bool:
        try:
            room: Room = self.rooms.get(str(user.room.uuid))
            if room:
                self.logger.info(f"Disconnect {user} from {room}")
                user.leave_room()
                room.remove_user(user)
                await user.websocket.send(json.dumps(Messages.OK))
                return True
            else:
                self.logger.info(f"No room found for {user}")
                await user.websocket.send(json.dumps(Messages.NO_SPECIFIED_ROOM))
                return False

        except KeyError:
            self.logger.info(f"Bad data for {user}")
            await user.websocket.send(json.dumps(Messages.BAD_DATA_SENT))
            return False

    async def delete_room(self, payload: dict, user: User) -> bool:
        try:
            room_uuid = payload["uuid"]
            room: Room = self.rooms.get(room_uuid)
            self.logger.info(f"Trying to delete room {room}")
            if room:
                if not room.users:
                    self.rooms.pop(str(room.uuid))
                    self.logger.info(f"Room {room} deleted")
                    await user.websocket.send(json.dumps(
                        Messages.OK
                    ))
                    await self.broadcast_rooms()
                    return True
                else:
                    self.logger.info(f"Room {room} is not empty {', '.join([str(user) for user in room.users])}")
                    await user.websocket.send(json.dumps(
                        Messages.ROOM_NOT_EMPTY
                    ))
                    return False
            else:
                self.logger.info(f"No room found for {user}")
                await user.websocket.send(json.dumps(Messages.NO_SPECIFIED_ROOM))
                return False

        except KeyError:
            self.logger.info(f"Bad data for {user}")
            await user.websocket.send(json.dumps(Messages.BAD_DATA_SENT))
            return False

    async def send_message(self, payload: dict, user: User) -> bool:
        try:
            body = payload["body"]
            if user.room:
                message = Message(body, user, user.room)
                user.room.add_message(message)
                self.logger.info(f"Message sent from {user}")
                await user.websocket.send(json.dumps(Messages.OK))

                await self.broadcast_message(message, user.room)

                return True
            else:
                self.logger.info(f"{user} is not in room")
                await user.websocket.send(json.dumps(Messages.SELECT_ROOM))

                return False

        except KeyError:
            self.logger.info(f"Bad data for {user}")
            await user.websocket.send(json.dumps(Messages.BAD_DATA_SENT))
            return False

    async def broadcast_message(self, message: Message, room: Room):
        self.logger.info(f"Broadcasting message {message} in room {room}")
        for user in room.users:
            self.logger.info(f"Sending message to {user}")
            await user.websocket.send(json.dumps({
                "type": MessageBodies.MESSAGE,
                "payload": message.get_dict()
            }))

    async def send_rooms(self, user):
        self.logger.info(f"Sending rooms to {user}")
        await user.websocket.send(json.dumps({
            "type": MessageBodies.LIST_ROOM,
            "payload": [room.get_dict() for _, room in self.rooms.items()]
        }))

    async def broadcast_rooms(self):
        self.logger.info(f"Broadcasting rooms")
        for user in self.clients:
            await self.send_rooms(user)

    async def handle_user(self, user):
        await user.websocket.send(json.dumps({
            "type": MessageBodies.USER,
            "payload": user.get_dict()
        }))
        await user.websocket.send(json.dumps(Messages.SELECT_ROOM))
        await self.send_rooms(user)

        async for raw_message in user.websocket:
            try:
                memo = json.loads(raw_message)
                self.logger.debug(f"Received message: {raw_message}")

                method = self.methods[memo["type"]]
                payload = memo["payload"]

                await method(payload=payload, user=user)

            except (JSONDecodeError, KeyError) as e:
                self.logger.info(e)
                await user.websocket.send(json.dumps(Messages.BAD_DATA_SENT))

    async def listen(self, websocket):
        user = User(websocket)
        self.logger.info(f"New user {user} connected")
        self.clients.add(user)
        try:
            await self.handle_user(user)

        except ConnectionClosedError:
            pass
        finally:
            self.logger.info(f"{user} disconnected")
            if user.room:
                self.rooms[str(user.room.uuid)].remove_user(user)
            self.clients.remove(user)

    def run(self):
        loop = asyncio.get_event_loop()
        try:
            socket_server = websockets.serve(self.listen, Config.IP, Config.PORT)
            self.logger.info("Started WebSocket server")
            loop.run_until_complete(socket_server)
            loop.run_forever()
        finally:
            loop.close()
            self.logger.info("Successfully shut down")


if __name__ == '__main__':
    Chat().run()
