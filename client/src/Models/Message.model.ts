import {UserModel} from "./User.model";
import {RoomModel} from "./Room.model";

export interface MessageModel {
    body: string;
    uuid: string;
    user: UserModel;
    room: RoomModel;
    name: string;
    created: string;
}

