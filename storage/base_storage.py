from abc import abstractmethod, ABC
from typing import List
from uuid import UUID

from models.message import Message
from models.room import Room
from models.user import User


class ModelDoesNotExist(Exception):
    pass


class Singleton(type):
    _instances = {}

    async def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class BaseStorage(ABC, metaclass=Singleton):
    @abstractmethod
    async def store_message(self, message: Message) -> bool:
        pass

    @abstractmethod
    async def retrieve_message(self, uuid: UUID) -> Message:
        pass

    @abstractmethod
    async def list_message(self, room: Room) -> List[Message]:
        pass

    @abstractmethod
    async def list_room(self) -> List[Room]:
        pass

    @abstractmethod
    async def store_room(self, message: Room) -> bool:
        pass

    @abstractmethod
    async def retrieve_room(self, uuid: UUID) -> Room:
        pass
