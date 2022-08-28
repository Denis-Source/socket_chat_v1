import React from 'react';
import {RoomModel} from "../../../Models/Room.model";
import Button from "../../Button/Button";

import styles from "./RoomItem.module.scss"


const RoomItem = ({room, callback, callbackDelete}: { room: RoomModel, callback: any, callbackDelete: any}) => {
    return (
        <div className={styles.room}>
            <div className={styles.top}>
                <p className={styles.name}>{room.name}</p>
                <button className={styles.delete} onClick={() => callbackDelete(room)}>x</button>
            </div>
            <div className={styles.select}>
                <Button callback={() => callback(room)} text={"Select"}/>
            </div>
        </div>
    );
};

export default RoomItem;