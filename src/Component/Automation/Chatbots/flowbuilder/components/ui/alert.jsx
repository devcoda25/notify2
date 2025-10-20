
import * as React from "react"
import { cva } from "class-variance-authority"

import clsx from "clsx"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(
  (props, ref) => {
  const { className, variant, ...otherProps } = props;
  return (
    <div
      ref={ref}
      role="alert"
      className={clsx(alertVariants({ variant }), className)}
      {...otherProps}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <h5
      ref={ref}
      className={clsx("mb-1 font-medium leading-none tracking-tight", className)}
      {...otherProps}
    />
  )
})
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={clsx("text-sm [&_p]:leading-relaxed", className)}
      {...otherProps}
    />
  )
})
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
