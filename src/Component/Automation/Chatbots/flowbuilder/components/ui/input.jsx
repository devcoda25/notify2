
import * as React from "react"

import clsx from "clsx"

const Input = React.forwardRef(
  (props, ref) => {
    const { className, type, ...otherProps } = props;
    return (
      <input
        type={type}
        className={clsx(
          "flex h-10 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "transition-all duration-200 ease-in-out",
          className
        )}
        ref={ref}
        {...otherProps}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
