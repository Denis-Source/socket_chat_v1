from .message import Message
from .model_types import ModelTypes
from .room import Room
from .user import User


class ModelFactory:
    MODELS = {
        ModelTypes.MESSAGE: Message,
        ModelTypes.USER: User,
        ModelTypes.ROOM: Room

    }

    def create(self, model_dict):
        if model_dict["type"] in ModelTypes:
            pass