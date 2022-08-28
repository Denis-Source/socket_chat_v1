import React, {useEffect, useRef} from 'react';
import {LogModel} from "../../../Models/Log.model";
import LogItem from "../LogItem/LogItem";
import styles from "./LogList.module.scss"
import ScrollToBottom from "react-scroll-to-bottom";

const LogList = ({logItems}: { logItems: LogModel[] }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);


    return (
        <ScrollToBottom followButtonClassName={styles.scrollButton} className={styles.wrapper}>
            <div className={styles.logList}>

                {logItems.map((logItem, index) =>
                    <LogItem logItem={logItem} key={index}/>
                )}
                <div ref={messagesEndRef}/>
            </div>
        </ScrollToBottom>
    );
};

export default LogList;