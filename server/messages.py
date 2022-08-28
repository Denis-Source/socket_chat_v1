from enum import Enum


class MessageBodies(str, Enum):
    OK = "ok"

    SELECT_ROOM = "select_room"
    LEAVE_ROOM = "leave_room"
    ROOM_SELECTED = "room_selected"
    LIST_ROOM = "list_room"
    CREATE_ROOM = "create_room"
    ROOM_CREATED = "room_created"
    SEND_MESSAGE = "send_message"
    NO_SPECIFIED_ROOM = "no_specified_room"
    HISTORY = "history"
    USER = "user"
    MESSAGE = "message"
    DELETE_ROOM = "delete_room"
    ROOM_NOT_EMPTY = "room_not_empty"

    BAD_DATA = "bad_data"


class MessageTypes(str, Enum):
    RESULT = "result"
    CALL = "call"


class Messages(dict, Enum):
    OK = {
        "type": MessageTypes.RESULT,
        "payload": {
            "message": MessageBodies.OK
        }
    }

    ROOM_CREATED = {
        "type": MessageTypes.RESULT,
        "payload": {
            "message": MessageBodies.ROOM_CREATED
        }
    }

    SELECT_ROOM = {
        "type": MessageTypes.CALL,
        "payload": {
            "message": MessageBodies.SELECT_ROOM
        }
    }
    SELECTED_ROOM = {
        "type": MessageTypes.RESULT,
        "payload": {
            "message": MessageBodies.ROOM_SELECTED
        }
    }
    NO_SPECIFIED_ROOM = {
        "type": MessageTypes.RESULT,
        "payload": {
            "message": MessageBodies.NO_SPECIFIED_ROOM
        }
    }

    BAD_DATA_SENT = {
        "type": MessageTypes.RESULT,
        "payload": {
            "message": MessageBodies.BAD_DATA
        }
    }

    ROOM_NOT_EMPTY = {
        "type": MessageTypes.RESULT,
        "payload": {
            "message": MessageBodies.ROOM_NOT_EMPTY
        }
    }
