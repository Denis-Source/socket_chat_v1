from websockets.legacy.server import WebSocketServerProtocol
from logging import getLogger

from .base_model import BaseModel
from .model_types import ModelTypes


class User(BaseModel):
    TYPE = ModelTypes.USER
    logger = getLogger(TYPE)

    def __init__(self, websocket: WebSocketServerProtocol):
        super().__init__()
        self.name = f"{self.TYPE}-{self.uuid}"
        self.websocket = websocket
        self.room = None

    def __str__(self):
        return self.name

    def set_room(self, room):
        self.room = room

    def leave_room(self):
        self.room = None

    def get_dict(self):
        return {
            "type": self.TYPE,
            "uuid": str(self.uuid),
            "name": self.name,
        }
