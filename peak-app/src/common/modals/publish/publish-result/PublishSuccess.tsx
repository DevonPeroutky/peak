import React, {useState} from 'react';
import {Button, Result} from "antd";

export const PublishSuccess = (props: { postUrl: string}) => {
    return (
        <Result
            status="success"
            title="Published!"
            subTitle="Your post is live! Soon we'll have more tools to help you share these posts directly on to other platforms"
            extra={[
                <Button type="primary" key="console" href={props.postUrl}>View the post on your blog</Button>,
                <Button key="buy">Close</Button>,
            ]}
        />
    )
}