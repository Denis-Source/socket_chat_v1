from __future__ import annotations

from enum import Enum
from random import choice

from .base_model import BaseModel
from .message import Message
from .model_types import ModelTypes
from .user import User


class RoomColors(str, Enum):
    WHITE = "#ffffff"
    GRUN = "#5da247"
    GELP = "#fbeb50"
    BLAU = "#2b347e"
    ROT = "#cf2e24"
    ORANGE = "#e69635"
    ROSA = "#d95d98"
    VIOLETT = "#5e297e"
    GRAU = "#888888"
    BEIGE = "#e79d7e"


class Room(BaseModel):
    TYPE = ModelTypes.ROOM

    def __init__(self, color: RoomColors = None):
        super().__init__()
        if not color:
            self.color = choice([e.value for e in RoomColors])
        else:
            self.color = color
        self.name = f"{self.TYPE}-{self.uuid}"
        self.users = []
        self.messages = []

    def __str__(self):
        return self.name

    def add_user(self, user: User):
        self.users.append(user)

    def add_message(self, message: Message):
        self.messages.append(message)

    def remove_user(self, user: User) -> bool:
        if user in self.users:
            self.users.remove(user)
            return True
        return False

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE,
            "uuid": str(self.uuid),
            "name": self.name,
            "color": self.color
        }
