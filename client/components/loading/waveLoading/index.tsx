import * as React from 'react';

import styles from './style.module.css';

export interface WaveLoadingProps {}

const WaveLoading: React.FunctionComponent<WaveLoadingProps> = () => {
    return (
        <div className="flex items-center justify-center space-x-2 fade-in">
            <div className={`${styles.item} ${styles.animation1}`}></div>
            <div className={`${styles.item} ${styles.animation2}`}></div>
            <div className={`${styles.item} ${styles.animation1}`}></div>
            <div className={`${styles.item} ${styles.animation2}`}></div>
            <div className={`${styles.item} ${styles.animation1}`}></div>
        </div>
    );
};

export default WaveLoading;
