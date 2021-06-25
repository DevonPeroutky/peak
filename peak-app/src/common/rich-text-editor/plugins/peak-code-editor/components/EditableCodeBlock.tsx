import React, {useState} from "react";
import { PrismCodeBlock } from "component-library";
import {LanguageSelect} from "./LanguageSelect";
import { Transforms } from "slate";
import { useEditorState } from "@udecode/slate-plugins";
import 'prismjs/themes/prism-okaidia.css';

export const EditableCodeBlock = (props: any) => {
    const { attributes, element } = props
    const editor = useEditorState()
    const [language, setLanguage] = useState(element.language || `java`)

    const updateLanguage = (newLanguage: string) => {
        setLanguage(newLanguage)

        // @ts-ignore
        Transforms.setNodes(editor, { language: newLanguage }, {
            match: node => {
                // @ts-ignore
                return node && node.id === element.id },
            at: []
        })
    }

    return (
        <>
            <div style={{ height: 0, overflow: "hidden" }}>{props.children}</div>
            <LanguageSelect updateLanguage={updateLanguage} language={language}/>
            <PrismCodeBlock {...props}/>
        </>
    )
}
