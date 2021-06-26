import styles from "../../../styles/Home.module.css";
import React, {useEffect} from "react";
import Head from "next/head";
import {useAppContext} from "../../data/context";

export const MainLayout = ({children}) => {
    return (
        <>
            <Head>
                <title>Peak</title>
                <link rel="icon" href={"/default-peak-favicon.svg"} />
            </Head>
            <div className={styles.container}>
                <div className={styles.contentContainer}>
                    {children}
                </div>
            </div>
        </>
    )
}
