import {
    Decorate,
    getCodeBlockDecorate,
    getCodeBlockDeserialize,
    getCodeBlockOnKeyDown,
    getCodeBlockRenderLeaf,
    getRenderElement,
    KEYS_CODE_BLOCK,
    SlatePlugin,
    withCodeBlock
} from "@udecode/slate-plugins";
import {BaseRange, Editor, NodeEntry, Text } from 'slate';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-clike';

import React, {useMemo} from "react";
import {PrismCodeBlock} from "./component/PrismCodeBlock";
// Prism.manual = true;

const getLength = (token) => {
    if (typeof token === 'string') {
        return token.length
    } else if (typeof token.content === 'string') {
        return token.content.length
    } else {
        return token.content.reduce((l, t) => l + getLength(t), 0)
    }
}
export const getCodeHighlightDecorate = (): Decorate => (editor) => {

    return ([node, path]: NodeEntry) => {
        const ranges: BaseRange[] = []

        if (node === editor) return ranges

        const [parentNode] = Editor.parent(editor, path)
        // @ts-ignore
        if (!parentNode || parentNode.type !== 'code_block') return ranges

        if (!node || !Text.isText(node) || !node.text) {
            return ranges
        }

        // @ts-ignore
        const tokens = Prism.tokenize(node.text, Prism.languages.java)
        let start = 0

        for (const token of tokens) {
            const length = getLength(token)
            const end = start + length

            if (typeof token !== 'string') {
                ranges.push({
                    [token.type]: true,
                    anchor: { path, offset: start },
                    focus: { path, offset: end }
                })
            }

            start = end
        }

        return ranges
    };
};

export const PrismJsCodeBlockPlugin = (): SlatePlugin => ({
    pluginKeys: KEYS_CODE_BLOCK,
    renderElement: getRenderElement(KEYS_CODE_BLOCK),
    renderLeaf: getCodeBlockRenderLeaf(),
    deserialize: getCodeBlockDeserialize(),
    decorate: getCodeBlockDecorate(),
    onKeyDown: getCodeBlockOnKeyDown(),
    withOverrides: withCodeBlock(),
});

export const usePrismHighlightPlugin = (): SlatePlugin => ({
    renderLeaf: (editor => (props) => {
        const { attributes, leaf, children } = props
        const { text, ...rest } = leaf
        const className = (rest) ? `token ${Object.keys(rest).join(' ')}` : `token`
        return (
            <span {...attributes} className={className}>
                {children}
            </span>
        )
    }),
    renderElement: (editor => (props) => <PrismCodeBlock {...props}/>),
    pluginKeys: KEYS_CODE_BLOCK,
    decorate: getCodeHighlightDecorate(),
})
