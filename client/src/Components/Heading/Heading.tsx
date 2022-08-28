import React from 'react';
import {UserModel} from "../../Models/User.model";
import styles from "./Heading.module.scss"
import {RoomModel} from "../../Models/Room.model";
import Button from "../Button/Button";

const Heading = ({
                     user,
                     room,
                     callback
                 }: { user: UserModel | undefined, room: RoomModel | undefined, callback: any }) => {
    return (
        <div className={styles.heading}>
            <h1 className={styles.header}>Chat</h1>
            <div className={styles.subHeading}>
                <div className={styles.button}>
                {room &&
                    <Button callback={callback} text={"Back to rooms"}/>
                }
                </div>
                <div className={styles.info}>
                    <p className={styles.text}><span>User:</span><span>{user?.name}</span></p>
                    {room && <p className={styles.text}><span>Room:</span><span>{room.name}</span></p>}
                </div>

            </div>
        </div>
    );
};

export default Heading;