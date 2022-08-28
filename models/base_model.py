from abc import ABC, abstractmethod
from datetime import datetime
from uuid import uuid4


# class NotModelException:
#     raise Exception("Not a valid model")


class BaseModel(ABC):
    def __init__(self):
        self.created = datetime.now()
        self.uuid = uuid4()

    def get_iso_created(self) -> str:
        return self.created.isoformat()

    @abstractmethod
    def get_dict(self) -> dict:
        pass
