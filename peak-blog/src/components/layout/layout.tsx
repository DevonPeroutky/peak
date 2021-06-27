import styles from "../../../styles/Home.module.css";
import React from "react";
import {SUBDOMAIN_LOADING_STATE} from "../../data/subdomain/types";
import {InitialLoader} from "../loaders/InitialLoader";

export const MainLayout = (props: {children, subdomainLoadingState: SUBDOMAIN_LOADING_STATE}) => {
    const { children, subdomainLoadingState } = props

    const content = (subdomainLoadingState === SUBDOMAIN_LOADING_STATE.LOADING) ? <InitialLoader/> :
        <div className={styles.contentContainer}>
            {children}
        </div>

    return (
        <div className={styles.container}>
            {content}
        </div>
    )
}
