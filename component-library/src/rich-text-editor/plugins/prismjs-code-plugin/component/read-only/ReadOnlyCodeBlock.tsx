import React from "react";
import {PrismCodeBlock} from "../prism-code-block";
import "./read-only-code-block.scss";
import { capitalize } from "lodash";

export const ReadOnlyCodeBlock = (props: any) => {
  const { element } = props
  return (
    <div>
      <span className={`selected-language`}>{capitalize(element.language) || `Java`}</span>
      <PrismCodeBlock {...props}/>
    </div>
  )
}
