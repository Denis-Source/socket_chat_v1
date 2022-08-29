import React, {useEffect, useRef} from 'react';
import {RoomModel} from "../../../Models/Room.model";

import RoomItem from "../RoomItem/RoomItem";
import Button from "../../Button/Button";
import styles from "./RoomList.module.scss"
import ScrollToBottom from "react-scroll-to-bottom";

const RoomList = ({
                      rooms,
                      setSelectRoom,
                      callback,
                      callbackDelete
                  }: { rooms: RoomModel[] | undefined, setSelectRoom: any, callback: any, callbackDelete: any }) => {

    return (
        <>
            {rooms &&
                <ScrollToBottom className={styles.wrapper} followButtonClassName={styles.followButtonClassName}>
                    <div className={styles.rooms}>
                        {rooms.map(room =>
                            <RoomItem callback={setSelectRoom} callbackDelete={callbackDelete} room={room}
                                      key={room.uuid}/>
                        )}
                    </div>
                </ScrollToBottom>
            }
            <div className={styles.button}>
                <Button callback={callback} text={"Create room"}/>
            </div>
        </>
    );
};

export default RoomList;