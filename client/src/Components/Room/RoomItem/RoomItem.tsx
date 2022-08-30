import React, {useState} from 'react';
import {RoomModel} from "../../../Models/Room.model";
import Button from "../../Button/Button";

import styles from "./RoomItem.module.scss"
import cross from "../../../Styles/Images/cross.svg"
import {TwitterPicker} from 'react-color';


const RoomItem = ({
                      room,
                      callback,
                      callbackDelete,
                      callbackChangeColor,
                      callbackChangeName,
                  }: { room: RoomModel, callback: any, callbackDelete: any, callbackChangeColor: any, callbackChangeName: any }) => {
    const [pickerVisible, setPickerVisible] = useState<boolean>(false);
    const [enteredName, setEnteredName] = useState<string>(room.name);
    const [focus, setFocus] = useState<boolean>(false);

    if (!focus && enteredName != room.name) {
        setEnteredName(room.name)
    }

    return (
        <div className={styles.room}>
            <div className={styles.top}>
                <input className={styles.name}
                       onChange={(event) => {
                           setEnteredName(event.target.value);
                           callbackChangeName(event.target.value, room);
                       }}
                       onFocus={() => {
                        setFocus(true);
                       }}
                       onBlur={() => {
                           setFocus(false);
                       }}
                       value={enteredName}/>
                <img className={styles.delete} onClick={() => callbackDelete(room)} src={cross} alt="cross"/>
            </div>
            <div className={styles.select}>
                <div>
                    <div className={styles.colorIcon} style={{backgroundColor: `${room.color}aa`}}
                         onClick={() => setPickerVisible(!pickerVisible)}>
                    </div>
                    {pickerVisible ?
                        <div className={styles.innerWrapper}>
                            <div className={styles.fullHeight}></div>
                            <div className={styles.popOver}>
                                <div className={styles.cover} onClick={() => {
                                    setPickerVisible(!pickerVisible);
                                }}/>
                                <TwitterPicker onChangeComplete={(color) => callbackChangeColor(color.hex, room)}/>
                            </div>
                        </div> : null}
                </div>
                <Button callback={() => callback(room)} text={"Select"}/>
            </div>
        </div>
    );
};

export default RoomItem;