import React from "react";
import Image from 'next/image'
import cn from 'classnames'

export const PeakLogo = (props: { className?: string }) => {
    return (
        <div className={cn("flex h-full max-h-full items-center", props.className)}>
            <Image
                src="/images/grayscale-with-sun.svg" // Route of the image file
                alt="Kickass Logo"
                width={"50px"}
                height={"50px"}
            />
        </div>
    )
}
