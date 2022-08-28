from .base_model import BaseModel
from .model_types import ModelTypes
from .user import User


class Message(BaseModel):
    TYPE = ModelTypes.MESSAGE

    def __init__(self, body: str, user: User, room):
        super().__init__()
        self.body = body
        self.user = user
        self.room = room
        self.name = f"{self.TYPE}-{self.uuid}"

    def __str__(self):
        return self.name

    def get_dict(self) -> dict:
        return {
            "type": self.TYPE,
            "uuid": str(self.uuid),
            "body": self.body,
            "created": self.get_iso_created(),
            "user": self.user.get_dict(),
            "room": self.room.get_dict(),
            "name": self.name
        }
