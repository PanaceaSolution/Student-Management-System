import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/utils/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm text-gray-500", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";
Table.propTypes = {
  className: PropTypes.string,
};

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";
TableHeader.propTypes = {
  className: PropTypes.string,
};

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("bg-white dark:bg-gray-800", className)} {...props} />
));
TableBody.displayName = "TableBody";
TableBody.propTypes = {
  className: PropTypes.string,
};

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400 font-medium",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";
TableFooter.propTypes = {
  className: PropTypes.string,
};

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    role="row"
    className={cn(
      "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";
TableRow.propTypes = {
  className: PropTypes.string,
};

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    role="columnheader"
    className={cn(
      "px-6 py-3 align-middle font-bold text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";
TableHead.propTypes = {
  className: PropTypes.string,
};

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    role="cell"
    className={cn(
      "px-6 py-4 text-center text-gray-500 dark:text-gray-400",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";
TableCell.propTypes = {
  className: PropTypes.string,
};

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";
TableCaption.propTypes = {
  className: PropTypes.string,
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
