import { useImage } from 'react-image'
import React from 'react'
import { DefaultSpinner } from '../spinner'

export const ImageLoader = (props: {
  className?: string
  url: string | string[]
  fallbackElement: JSX.Element
}) => {
  const { url, className, fallbackElement } = props
  const { src, error, isLoading } = useImage({
    srcList: url,
    useSuspense: false
  })

  if (isLoading) {
    return <DefaultSpinner className={className} />
  }

  if (error || src === undefined) {
    return fallbackElement
  }

  return <img className={className} src={src} />
}
