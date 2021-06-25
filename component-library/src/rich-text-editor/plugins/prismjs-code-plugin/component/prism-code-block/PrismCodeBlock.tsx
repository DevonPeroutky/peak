import React from "react";
import { SPRenderElementProps } from "@udecode/slate-plugins";
import "./prism-code-block.scss";

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-clike';
import 'prismjs/themes/prism-okaidia.css';

export const PrismCodeBlock = (props: SPRenderElementProps) => {
    const { attributes, element, children } = props

    console.log(`--------------`)
    console.log(`ELEMENT: `, element)
    console.log(`ATTRIBUTES: `, attributes)

    return (
        <pre className="language-java" {...attributes}>
            <code>{children}</code>
        </pre>
    )
}
