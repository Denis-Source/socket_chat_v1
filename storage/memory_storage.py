from typing import List
from uuid import UUID

from models.message import Message
from models.room import Room
from storage.base_storage import BaseStorage, ModelDoesNotExist


class MemoryStorage(BaseStorage):
    rooms = {}
    messages = {}

    async def store_message(self, message: Message) -> bool:
        pass

    async def retrieve_message(self, uuid: UUID) -> Message:
        pass

    async def list_message(self, room: Room) -> List[Message]:
        pass

    async def list_room(self) -> List[Room]:
        return [room for _, room in self.rooms]

    async def store_room(self, room: Room) -> bool:
        if self.rooms.get(room.uuid):
            return False
        else:
            self.rooms[room.uuid] = room
            return False

    async def retrieve_room(self, uuid: UUID) -> Room:
        try:
            return self.rooms[uuid]
        except ValueError:
            raise ModelDoesNotExist
