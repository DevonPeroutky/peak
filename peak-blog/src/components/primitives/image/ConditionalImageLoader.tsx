import {ImageProps} from "next/dist/client/image";
import Image from "next/image";
import React from "react";

interface ConditionalImageLoaderProps {
    src: string | undefined
    width: string
    height: string
    layout: "fixed" | "intrinsic" | "responsive"
    alt?: string
    className?: string
}

export const ConditionalImageLoader = (props: ConditionalImageLoaderProps ) => {
    const { src } = props
    return (!src) ? null : <NextImageWrapper {...props}/>
}

const NextImageWrapper = (props: ImageProps) => {
    // @ts-ignore
    const { src, className, alt, width, layout, height } = props
    return (src.startsWith("https://storage.googleapis.com")) ?
        <div className={className}>
            <Image
                src={src}
                alt={alt}
                width={width}
                layout={layout}
                height={height}
            />
        </div> : <img src={src} className={className} alt={alt} style={{width: width, height: height}}/>
}
