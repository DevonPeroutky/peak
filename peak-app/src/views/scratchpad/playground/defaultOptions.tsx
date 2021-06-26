import React from "react";
import {
    BlockquoteElementBase,
    ClassName,
    createSlatePluginsComponents,
    createSlatePluginsOptions,
    ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_MEDIA_EMBED,
    ELEMENT_MENTION,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TABLE,
    ELEMENT_TODO_LI,
    ELEMENT_UL,
    getBlockquoteElementStyles,
    MARK_STRIKETHROUGH,
    MentionElement,
    MentionNodeData,
    RootStyleSet,
    SlatePluginOptions,
    StyledElement,
    StyledElementProps,
    withDraggables,
    withPlaceholders,
    withProps
} from "@udecode/slate-plugins";
import {DragIndicator} from "@styled-icons/material/DragIndicator";
import { styled } from '@uifabric/utilities';


export const editableProps = {
    placeholder: 'Type…',
    style: {
        padding: '15px',
    },
};

const PEAK_STRIKETHROUGH_OPTIONS: Partial<SlatePluginOptions> = {
    hotkey: 'mod+shift+x',
}

export const PEAK_TODO_LIST_OPTIONS: Partial<SlatePluginOptions> = {
    hotkey: ['mod+opt+5', 'mod+shift+5'],
};

export const options = createSlatePluginsOptions({
    [MARK_STRIKETHROUGH]: PEAK_STRIKETHROUGH_OPTIONS,
    [ELEMENT_TODO_LI]: PEAK_TODO_LIST_OPTIONS
})

const renderMentionLabel = (mentionable: MentionNodeData) => {
    const entry = [].find((m) => m.value === mentionable.value);
    if (!entry) return 'unknown option';
    return `${entry.name} - ${entry.email}`;
};

export const BlockquoteElement = styled<
    StyledElementProps,
    ClassName,
    RootStyleSet
    >(BlockquoteElementBase, getBlockquoteElementStyles({ className: "peak-blockquote" }), undefined, {
    scope: 'BlockquoteElement',
});
let components = createSlatePluginsComponents({
    [ELEMENT_MENTION]: withProps(MentionElement, {
        renderLabel: renderMentionLabel,
    }),
    [ELEMENT_BLOCKQUOTE]: BlockquoteElement
})

