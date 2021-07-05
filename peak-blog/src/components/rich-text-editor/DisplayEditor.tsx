import React, {useEffect} from "react";
import { SlatePlugins } from "@udecode/slate-plugins-core";
import {
    basePlugins,
    pluginOptions,
    readOnlyProps,
    useReadOnlyComponents,
} from "component-library";

export interface DisplayEditorProps {
    value: any
    postId: string
}
export const DisplayEditor = ({
                                  postId,
                                  value
                              }: DisplayEditorProps) => {
    return (
        <SlatePlugins
            className={"flex flex-col flex-grow"}
            id={postId}
            plugins={[...basePlugins, ]}
            options={pluginOptions}
            components={useReadOnlyComponents()}
            editableProps={readOnlyProps}
            initialValue={value}
        />
    )
}
