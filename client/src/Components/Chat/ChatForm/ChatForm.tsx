import React, {SyntheticEvent, useRef, useState} from 'react';

import styles from "./ChatForm.module.scss"

const ChatForm = ({callback}: { callback: any }) => {
    // Todo!
    const ref = useRef(null);
    const handleSubmit = (event: any) => {
        event.preventDefault();
        // @ts-ignore
        if (ref.current.value) {
            // @ts-ignore
            callback(event, ref.current.value);
            // @ts-ignore
            ref.current.value = "";
        }
    };

    const onEnterPress = (event: any) => {
        if(event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault();
            handleSubmit(event)
        }
    }

    return (
        <form className={styles.form}>
            <textarea ref={ref} rows={4} onKeyDown={onEnterPress} className={styles.textArea}/>
            <input className={styles.submit} type="submit"
                   onClick={handleSubmit}/>
        </form>
    );
};

export default ChatForm;