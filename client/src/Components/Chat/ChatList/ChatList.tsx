import React, {useEffect, useRef} from 'react';
import {MessageModel} from "../../../Models/Message.model";
import ChatItem from "../ChatItem/ChatItem";
import {UserModel} from "../../../Models/User.model";
import ChatForm from "../ChatForm/ChatForm";

import styles from "./ChatList.module.scss"
import ScrollToBottom from "react-scroll-to-bottom";

const ChatList = ({
                      messages,
                      user,
                      callback
                  }: { messages: MessageModel[], user: UserModel | undefined, callback: any }) => {


    return (
        <div>
            <ScrollToBottom className={styles.wrapper} followButtonClassName={styles.scrollButton}>
                <div className={styles.messages}>
                    {messages?.map((message) =>
                        <ChatItem isMine={message.user.name === user?.name} message={message} key={message.uuid}/>
                    )}
                </div>
            </ScrollToBottom>
            <ChatForm callback={callback}/>
        </div>
    );
};

export default ChatList;