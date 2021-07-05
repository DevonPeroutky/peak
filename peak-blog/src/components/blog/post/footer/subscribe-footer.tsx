import {PeakPost} from "component-library";
import React, { useState } from "react";
import {notify} from "../../../../utils/toast";
import {useAppContext} from "../../../../data/context";
import {create_subscriber} from "../../../../data/subscribers";
import {sleep} from "../../../../../../peak-app/src/chrome-extension/utils/generalUtil";
import { motion } from "framer-motion"
import {validateEmail} from "../../../../utils/string";

const INITIAL = "Submit"
const LOADING = "Loading..."
const SUCCESS = "Success! 🎉"

export const FooterCTA = (props: { post: PeakPost }) => {
    const { subdomain } = useAppContext()
    const [loading, setLoading] = useState<string>(INITIAL)

    return (
        <div className={"w-full flex flex-col justify-center items-start my-12 py-12 border-t"}>
            <h2 className={"mb-2"}>Subscribe to my newsletter</h2>
            <div>
                If you want to hear about what I'm building, writing, and thinking about each week, sign up for the {`${subdomain.title}`} newsletter.&nbsp;
                <span className={"bg-blue-100"}>I only send emails when a new essay is posted. Never spam.</span>
                <Input loading={loading} setLoading={setLoading} subdomain={subdomain}/>
            </div>
        </div>
    )
}

const Input = (props: { loading, setLoading, subdomain }) => {
    const { loading, setLoading, subdomain } = props
    const [email, setEmail] = useState<string>("")

    const inputVariants = {
        submitted: {
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            border: 0
        },
        initial: {
            width: "100%",
        }
    }

    const buttonVariants = {
        submitted: {
            borderRadius: '0.5rem',
            minWidth: 'max-content'
        },
    }
    const submit = () => {
        if (!email) {
            notify("We need to know your email!", "subscribe-failure", { type: "warning"})
            return
        }

        if (!validateEmail(email)) {
            notify("That email doesn't look valid", "subscribe-failure", { type: "warning"})
            return
        }

        setLoading(LOADING)
        create_subscriber(subdomain.id, email).then(_ => {
            sleep(1000).then(r => setLoading(SUCCESS))
        })
        .catch(err => {
            notify("Failed to subscribe", "subscribe-failure")
            sleep(1000).then(_ => setLoading(INITIAL))
        })
    }

    return (
        <div className={"flex w-full justify-center pt-4 h-15"}>
            <motion.input
                initial={ "initial" }
                animate={ (loading === SUCCESS) ? "submitted" : "initial" }
                transition={{
                    ease: 'easeInOut',
                    duration: 1,
                }}
                variants={inputVariants}

                // Regular Props
                placeholder={"Your Email"}
                className={"border-t border-b border-l border-blue-300 rounded-l-lg h-12 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"}
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <motion.button
                initial={ "initial" }
                disabled={loading === SUCCESS }
                animate={ (loading === SUCCESS) ? "submitted" : "initial" }
                transition={{
                    ease: 'easeInOut',
                    duration: 1,
                }}
                variants={buttonVariants}
                onClick={() => submit()}
                className={"py-2 px-4 flex justify-center items-center bg-blue-500 text-white rounded-r-lg font-light text-sm accessible-button focus:ring-0 w-28 h-12 min-w-max"}
            >
                { loading }
            </motion.button>
        </div>
    )
}