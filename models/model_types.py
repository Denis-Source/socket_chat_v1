from enum import Enum


class ModelTypes(str, Enum):
    MESSAGE = "message"
    USER = "user"
    ROOM = "room"
    CHAT = "chat"
