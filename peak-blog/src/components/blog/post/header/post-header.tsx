import {PeakLogo} from "../../../primitives/logo/peak-logo";
import Link from "next/link";
import React from "react";
import styles from "../../../../../styles/Home.module.css";
import cn from 'classnames';
import { truncate } from 'lodash';
import {ConditionalImageLoader} from "../../../primitives/image/ConditionalImageLoader";
import {notify} from "../../../../utils/toast";
import {useAppContext} from "../../../../data/context";
import SubscribeButton from "../../../primitives/buttons/subscribe";

export default function PostHeaderBar() {
    const { subdomain, author } = useAppContext()
    return (
        <div className={"w-full divide-gray-50 border-b py-4 flex justify-center items-center"}>
            <div className={cn(styles.postContainer, "h-12", "flex", "items-center", "justify-between")}>
                <span className={"flex items-center leading-snug cursor-pointer hover:text-blue-400"}>
                    <Link href={"/"}>
                        <div className={"flex items-center"}>
                            <ConditionalImageLoader
                                src={subdomain && subdomain.fav_icon_url}
                                width={"48px"}
                                height={"48px"}
                                layout={"intrinsic"}
                                fallback={<PeakLogo className={"mr-4"}/>}
                                className={"mr-4"}/>
                            <span className={""}>{truncate(subdomain.title, { length: 50 })}</span>
                        </div>
                    </Link>
                </span>
                <SubscribeButton/>
            </div>
        </div>
    )
}
