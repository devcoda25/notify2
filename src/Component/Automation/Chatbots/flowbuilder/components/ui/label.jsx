


import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import clsx from "clsx"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={clsx(labelVariants(), className)}
      {...otherProps}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
