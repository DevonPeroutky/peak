import {
  getRenderElement,
  // eslint-disable-next-line no-unused-vars
  SlatePlugin
} from '@udecode/slate-plugins'
import { PEAK_CALLOUT } from './defaults'

export const createPeakCalloutPlugin = (): SlatePlugin => ({
  pluginKeys: PEAK_CALLOUT,
  renderElement: getRenderElement(PEAK_CALLOUT)
})
