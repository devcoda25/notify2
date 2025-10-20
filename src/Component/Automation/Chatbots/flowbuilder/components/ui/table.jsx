
import * as React from "react"

import clsx from "clsx"

const Table = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={clsx("w-full caption-bottom text-sm", className)}
        {...otherProps}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <thead ref={ref} className={clsx("[&_tr]:border-b", className)} {...otherProps} />
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <tbody
      ref={ref}
      className={clsx("[&_tr:last-child]:border-0", className)}
      {...otherProps}
    />
  )
})
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <tfoot
      ref={ref}
      className={clsx(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...otherProps}
    />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <tr
      ref={ref}
      className={clsx(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...otherProps}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <th
      ref={ref}
      className={clsx(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...otherProps}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <td
      ref={ref}
      className={clsx("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...otherProps}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(
  (props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <caption
      ref={ref}
      className={clsx("mt-4 text-sm text-muted-foreground", className)}
      {...otherProps}
    />
  )
})
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
