import React from "react";
import { Node } from "slate";

export const EstimateReadTime = (props: { body: Node[], className?: string }) => {

   const estimatedReadTime = (body: Node[]): number => {
      return Math.max(Math.floor((body.length) * .3), 1)
   }

   const time = estimatedReadTime(props.body)
   return (
       <span className={props.className}>{time} minute{(time === 1) ? "" : "s"} read</span>
   )
}