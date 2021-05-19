import React, { useState } from 'react';
import {Button, Divider, Form, Input} from "antd";
import {CommentOutlined, CompassOutlined, RocketOutlined} from "@ant-design/icons/lib";
import "./blog-setup.scss"
import {createBlog} from "../../../redux/slices/blog/blogSlice";
import {BlogConfiguration} from "../../../redux/slices/blog/types";
import {useCurrentUser} from "../../../utils/hooks";
import {subdomain_regex} from "../../../utils/blog";

/**
 * Creation:
 * 1. Blog Name
 * 2. Blog Description
 * 3. Subdomain
 * ----------------
 * - Import Mailing List
 * @param props
 * @constructor
 */
export const BlogSetup = (props: {}) => {
    const user = useCurrentUser()
    const [loading, setLoading] = useState(false)

    const onFinish = (values: BlogConfiguration) => {
        setLoading(true)
        createBlog(user.id, values).then(_ => {
            setLoading(false)
        })
    }

    return (
        <div className={"blog-setup-container"}>
            <h1>Create your Blog</h1>
            <Divider/>
            <Form
                name="normal_login"
                onFinish={onFinish}
            >
                <Form.Item
                    name="title"
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 255,
                            message: 'Please enter your desired name for your blog. Max Length ',
                        },
                    ]}
                >
                    <Input prefix={<CompassOutlined className="input-icon"/>} placeholder="Publication Name"/>
                </Form.Item>
                <Form.Item
                    name="description"
                    rules={[
                        {
                            required: true,
                            type: "string",
                            max: 255,
                            message: 'Please enter a description for your blog',
                        },
                    ]}
                >
                    <Input prefix={<CommentOutlined className="input-icon"/>} placeholder="What is your blog about?"/>
                </Form.Item>
                <Form.Item
                    name="subdomain"
                    rules={[
                        {
                            required: true,
                            pattern: subdomain_regex,
                            message: 'Subdomain must be less than 63 characters, only contain letters/numbers/hyphens, but must begin and end with a alphanumeric'
                        },
                    ]}
                >
                    <Input placeholder="Subdomain" suffix={".cur8.dev"}/>
                </Form.Item>
                <Form.Item hasFeedback>
                    <Button icon={<RocketOutlined />} type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Create my Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}