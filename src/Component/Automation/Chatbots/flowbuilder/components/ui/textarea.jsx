
import * as React from 'react';

import clsx from 'clsx';

const Textarea = React.forwardRef(
  (props, ref) => {
    const {className, ...otherProps} = props;
    return (
      <textarea
        className={clsx(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus:border-primary focus:ring-primary',
          'transition-all duration-200 ease-in-out',
          className
        )}
        ref={ref}
        {...otherProps}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
