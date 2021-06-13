import React from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {InitialLoader} from "../components/loaders/InitialLoader";
import {useAppContext} from "../data/context";

const App = () => {
    const { subdomain } = useAppContext()

    return (
        <>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome/> : <InitialLoader/>}
        </>
    )
}
export default App
