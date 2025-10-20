


import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import clsx from "clsx"

const ScrollArea = React.forwardRef(
  (props, ref) => {
  const { className, children, ...otherProps } = props;
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={clsx("relative overflow-hidden", className)}
      {...otherProps}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef(
  (props, ref) => {
  const { className, orientation = "vertical", ...otherProps } = props;
  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      className={clsx(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...otherProps}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.Scrollbar>
  )
})
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
