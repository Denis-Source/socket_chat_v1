import React from 'react';
import {RoomModel} from "../../../Models/Room.model";
import Button from "../../Button/Button";

import styles from "./RoomItem.module.scss"
import cross from "../../../Styles/Images/cross.svg"


const RoomItem = ({room, callback, callbackDelete}: { room: RoomModel, callback: any, callbackDelete: any }) => {
    console.log(room.color);
    return (
        <div className={styles.room}>
            <div className={styles.top}>
                <p className={styles.name}>{room.name}</p>
                <img className={styles.delete} onClick={() => callbackDelete(room)} src={cross} alt="cross"/>
            </div>
            <div className={styles.select}>
                <div className={styles.colorIcon} style={{backgroundColor: `${room.color}aa`}}></div>
                <Button callback={() => callback(room)} text={"Select"}/>
            </div>
        </div>
    );
};

export default RoomItem;