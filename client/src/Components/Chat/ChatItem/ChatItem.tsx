import React from 'react';
import {MessageModel} from "../../../Models/Message.model";
import styles from "./ChatItem.module.scss"

const ChatItem = ({message, isMine}: { message: MessageModel, isMine: boolean }) => {
    return (
        <div className={isMine ? styles.myMessage : styles.otherMessage}>
            <p className={styles.body}>{message.body}</p>
            <p className={styles.user}>{message.user.name}</p>
            <p className={styles.date}>{convertTime(message.created)}</p>
        </div>
    );
};

const convertTime = (timeStr: string) => {
    const DAY_OFFSET = 24 * 60 * 60;

    const messageDate = new Date(timeStr);
    const now = new Date();
    return messageDate.getDate() > now.getTime() + DAY_OFFSET ?
        messageDate.toLocaleString() :
        messageDate.toLocaleTimeString()
}

export default ChatItem;