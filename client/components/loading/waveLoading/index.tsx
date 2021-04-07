import * as React from 'react';

import styles from './style.module.css';

export interface WaveLoadingProps {}

const WaveLoading: React.FunctionComponent<WaveLoadingProps> = () => {
    return (
        <div className="flex space-x-2 justify-center items-center fade-in" data-testid="wave-loading">
            <div className={`${styles.item} ${styles.animation1}`}></div>
            <div className={`${styles.item} ${styles.animation2}`}></div>
            <div className={`${styles.item} ${styles.animation1}`}></div>
            <div className={`${styles.item} ${styles.animation2}`}></div>
            <div className={`${styles.item} ${styles.animation1}`}></div>
        </div>
    );
};

export default WaveLoading;
