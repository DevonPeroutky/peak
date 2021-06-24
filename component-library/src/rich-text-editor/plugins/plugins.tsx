import {
  createBlockquotePlugin,
  createBoldPlugin,
  createCodePlugin,
  createHeadingPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createParagraphPlugin,
  createStrikethroughPlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  // eslint-disable-next-line no-unused-vars
  SlatePlugin
} from '@udecode/slate-plugins'
import { createPeakTitlePlugin } from './peak-title-plugin'
import { createPeakCalloutPlugin } from './peak-callout-plugin'
import { createDividerPlugin } from './peak-divider'
import { createPeakMediaEmbedPlugin } from './peak-media-embed-plugin'

export const genericPlugins: SlatePlugin[] = [
  // editor
  // FOR SOME REASON SLATE BREAK IF THESE ARE DEFINED HERE.
  // createReactPlugin(),
  // createHistoryPlugin(),
  // createNodeIdPlugin(),
  // createListPlugin(),

  // elements
  createTodoListPlugin(),
  createImagePlugin(),
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createHeadingPlugin(),
  createLinkPlugin(),

  // marks
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
  createCodePlugin()
]

export const customPlugins: SlatePlugin[] = [
  createPeakTitlePlugin(),
  createPeakCalloutPlugin(),
  createDividerPlugin(),
  createPeakMediaEmbedPlugin()
]

export const basePlugins: SlatePlugin[] = [...genericPlugins, ...customPlugins]
