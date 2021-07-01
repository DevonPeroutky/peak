import {PeakPost} from "component-library";
import React from "react";
import {notify} from "../../../../utils/toast";
import {useAppContext} from "../../../../data/context";

export const FooterCTA = (props: { post: PeakPost }) => {
    const {subdomain} = useAppContext()

    return (
        <div className={"w-full flex flex-col justify-center items-start my-12 py-12 border-t"}>
            <h2 className={"mb-2"}>Subscribe to my newsletter</h2>
            <div>
                If you want to hear about what I'm building, writing, and thinking about each week, sign up for the {`${subdomain.title}`} newsletter.&nbsp;
                <span className={"bg-blue-100"}>I only send emails when a new essay is posted. Never spam.</span>
            </div>
            <div className={"flex w-full pt-4"}>
                <input placeholder={"Your Email"} className={"flex flex-grow border-t border-b border-l border-blue-300 rounded-l-lg h-12 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"}/>
                <button
                    className={"py-2 px-4 flex justify-center items-center bg-blue-500 text-white rounded-r-lg font-light text-sm accessible-button"}
                    onClick={() => notify("Ability to subscribe coming soon!", "subscribe")}
                >
                    <div className={"mr-2"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <polyline points="3 7 12 13 21 7" />
                        </svg>
                    </div>
                    Subscribe
                </button>
            </div>
            {/*<div className={"flex"}>*/}
            {/*    <div class="flex flex-col lg:py-0 py-4">*/}
            {/*        <label for="email3" class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">Email</label>*/}
            {/*        <div class="relative">*/}
            {/*            <div class="absolute text-white flex items-center px-4 border-r dark:border-gray-700 h-full bg-indigo-700 dark:bg-indigo-600 rounded-l cursor-pointer">*/}
            {/*                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">*/}
            {/*                    <path stroke="none" d="M0 0h24v24H0z" />*/}
            {/*                    <rect x="3" y="5" width="18" height="14" rx="2" />*/}
            {/*                    <polyline points="3 7 12 13 21 7" />*/}
            {/*                </svg>*/}
            {/*            </div>*/}
            {/*            <input placeholder={"Your Email"} className={"divide-gray-50 border-b"}/>*/}
            {/*            /!*<input id="email3" class="text-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:text-gray-400 focus:outline-none  dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-16 text-sm border-gray-300 rounded border shadow" placeholder="Placeholder" />*!/*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    /!*<SubscribeButton/>*!/*/}
            {/*</div>*/}
        </div>
    )
}