import React from 'react';
import {LogModel} from "../../../Models/Log.model";
import styles from "./LogItem.module.scss"

const LogItem = ({logItem}: { logItem: LogModel }) => {
    return (
        <div className={styles.logItem}>
            {logItem.received ?
                <p className={styles.source}>received:</p>
                :
                <p className={styles.source}>sent:</p>
            }
            <p className={styles.type}>{logItem.type}</p>
            <p className={styles.message}>{logItem?.message}</p>
        </div>
    );
};

export default LogItem;