import React from 'react';
import styles from "./Button.module.scss";

const Button = ({callback, text}: { callback: any, text: string }) => {
    return (
        <button className={styles.button} onClick={callback}>
            {text}
        </button>
    );
};

export default Button;