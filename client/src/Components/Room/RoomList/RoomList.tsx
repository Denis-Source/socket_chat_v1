import React, {useState} from 'react';
import {RoomModel} from "../../../Models/Room.model";

import RoomItem from "../RoomItem/RoomItem";
import Button from "../../Button/Button";
import styles from "./RoomList.module.scss"
import ScrollToBottom from "react-scroll-to-bottom";
import search from "../../../Styles/Images/search.svg"


const RoomList = ({
                      rooms,
                      setSelectRoom,
                      callback,
                      callbackDelete,
                      callbackChangeColor,
                      callbackChangeName,
                  }: { rooms: RoomModel[], setSelectRoom: any, callback: any, callbackDelete: any, callbackChangeColor: any, callbackChangeName: any }) => {

    const [filteredString, setFilteredString] = useState<string>("");

    return (
        <>
            <div className={styles.searchWrapper}>
                <label className={styles.searchLabel}>Search:</label>
                <input className={styles.search} type="text"
                       onChange={(event) => setFilteredString(event.target.value)}/>
            </div>
            {rooms &&
                <ScrollToBottom className={styles.wrapper} followButtonClassName={styles.followButtonClassName}>
                    <div className={styles.rooms}>
                        {rooms.filter(room => room.name.includes(filteredString)).map(room =>
                            <RoomItem callbackChangeName={callbackChangeName} callbackChangeColor={callbackChangeColor}
                                      callback={setSelectRoom} callbackDelete={callbackDelete} room={room}
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