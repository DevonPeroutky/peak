import React from "react";
import {BlogHome} from "../components/blog/home/blog-home";
import {InitialLoader} from "../components/loaders/InitialLoader";
import {useAppContext} from "../data/context";

const App = () => {
    const { subdomain, author } = useAppContext()

    return (
        <>
            {/* @ts-ignore */}
            {(subdomain) ? <BlogHome/> : <InitialLoader/>}
            <div className="fixed bottom-3 left-3 text-gray-500 text-left text-xs flex flex-col">A Peak blog by <span className={"text-base font-bold"}>{author.given_name} {author.family_name}</span></div>
        </>
    )
}
export default App
