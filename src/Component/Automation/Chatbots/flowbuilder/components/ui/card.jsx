
import * as React from "react"

import clsx from "clsx"

const Card = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...otherProps}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={clsx("flex flex-col space-y-1.5 p-6", className)}
      {...otherProps}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <h3
      ref={ref}
      className={clsx(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...otherProps}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <p
      ref={ref}
      className={clsx("text-sm text-muted-foreground", className)}
      {...otherProps}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return <div ref={ref} className={clsx("p-6 pt-0", className)} {...otherProps} />
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={clsx("flex items-center p-6 pt-0", className)}
      {...otherProps}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
