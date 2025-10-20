


import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import clsx from "clsx"

const Separator = React.forwardRef(
  (
    props,
    ref
  ) => {
    const { className, orientation = "horizontal", decorative = true, ...otherProps } = props;
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={clsx(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...otherProps}
      />
    )
  }
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
