import {PeakPost} from "component-library";
import React, { useState } from "react";
import {notify} from "../../../../utils/toast";
import {useAppContext} from "../../../../data/context";
import {create_subscriber} from "../../../../data/subscribers";

export const FooterCTA = (props: { post: PeakPost }) => {
    const {subdomain} = useAppContext()
    const [email, setEmail] = useState<string>("")

    return (
        <div className={"w-full flex flex-col justify-center items-start my-12 py-12 border-t"}>
            <h2 className={"mb-2"}>Subscribe to my newsletter</h2>
            <div>
                If you want to hear about what I'm building, writing, and thinking about each week, sign up for the {`${subdomain.title}`} newsletter.&nbsp;
                <span className={"bg-blue-100"}>I only send emails when a new essay is posted. Never spam.</span>
            </div>
            <div className={"flex w-full pt-4"}>
                <input
                    placeholder={"Your Email"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={"flex flex-grow border-t border-b border-l border-blue-300 rounded-l-lg h-12 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"}/>
                <button
                    className={"py-2 px-4 flex justify-center items-center bg-blue-500 text-white rounded-r-lg font-light text-sm accessible-button"}
                    onClick={() => {
                        create_subscriber(subdomain.id, email).then(subscriber => {
                            notify("Ability to subscribe coming soon!", "subscribe")
                        }).catch(err => notify("Failed to subscribe", "subscribe-failure"))
                    }}
                >
                    <div className={"mr-2"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <polyline points="3 7 12 13 21 7" />
                        </svg>
                    </div>
                    Subscribe
                </button>
            </div>
        </div>
    )
}