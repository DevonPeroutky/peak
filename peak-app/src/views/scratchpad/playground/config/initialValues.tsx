import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_CODE_LINE,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_LI,
    ELEMENT_LINK,
    ELEMENT_OL,
    ELEMENT_PARAGRAPH,
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TODO_LI,
    ELEMENT_TR,
    ELEMENT_UL,
    MARK_HIGHLIGHT,
} from '@udecode/slate-plugins';
import {options} from "../defaultOptions";
import {getNodesWithRandomId} from "./utils";

export const initialValueHighlight: any = [
    {
        type: options[ELEMENT_H2].type,
        children: [
            {
                text: '🌈 Highlight',
            },
        ],
    },
    {
        type: options[ELEMENT_PARAGRAPH].type,
        children: [
            {
                text: 'The Highlight plugin enables support for ',
            },
            {
                text: 'highlights',
                [options[MARK_HIGHLIGHT].type]: true,
            },
            {
                text:
                    ', useful when reviewing content or highlighting it for future reference.',
            },
        ],
    },
    {
        type: options[ELEMENT_PARAGRAPH].type,
        children: [
            {
                text: 'BITCHES ',
            },
            {
                text: 'aint',
                [options[MARK_HIGHLIGHT].type]: true,
            },
            {
                text:
                    ', shit.',
            },
        ],
    },
];

export const initialValuePlayground: any = getNodesWithRandomId([
    ...initialValueHighlight,
]);