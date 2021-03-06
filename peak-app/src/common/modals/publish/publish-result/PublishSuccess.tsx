import React, {useState} from 'react';
import {Button, Result} from "antd";
import {useBlog} from "../../../../redux/slices/blog/hooks";
import config from "../../../../constants/environment-vars"

export const PublishSuccess = (props: { postUrl: string}) => {
    const blog = useBlog()
    return (
        <Result
            className={"animate__animated animate__zoomIn"}
            status="success"
            title="Published!"
            subTitle="Your post is live! Soon we'll have more tools to help you share these posts directly on to other platforms"
            extra={[
                <Button type="primary" key="console" href={props.postUrl} target={'_blank'} className="animate__animated animate__zoomIn">{`View the post on ${blog.subdomain}.${config.blog_domain}`}</Button>,
            ]}
        />
    )
}