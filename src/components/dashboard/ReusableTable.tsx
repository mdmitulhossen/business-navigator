import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type TableColumn<T> = {
  header: React.ReactNode;
  accessor?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T, index: number) => React.Key);
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  isLoading?: boolean;
  className?: string;
  caption?: React.ReactNode;
}

function getRowKey<T>(row: T, index: number, rowKey?: keyof T | ((row: T, index: number) => React.Key)) {
  if (typeof rowKey === 'function') return rowKey(row, index);
  if (rowKey) return String(row[rowKey] ?? index);
  return index;
}

function renderCellValue<T>(row: T, column: TableColumn<T>, index: number) {
  if (column.cell) return column.cell(row, index);

  if (!column.accessor) return null;

  const value = row[column.accessor];
  if (React.isValidElement(value)) return value;
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '—';
  return String(value);
}

export function ReusableTable<T>({
  columns,
  data,
  rowKey,
  emptyStateTitle = 'No records found',
  emptyStateDescription = 'There is nothing to show right now.',
  isLoading = false,
  className,
  caption,
}: ReusableTableProps<T>) {
  const hasRows = data.length > 0;

  return (
    <div className={cn('w-full rounded-2xl border border-border bg-card shadow-sm', className)}>
      <Table>
        {caption ? <caption>{caption}</caption> : null}
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead key={index} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              </TableCell>
            </TableRow>
          ) : hasRows ? (
            data.map((row, index) => (
              <TableRow key={getRowKey(row, index, rowKey)}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={columnIndex} className={column.className}>
                    {renderCellValue(row, column, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                <div className="mx-auto max-w-sm space-y-2">
                  <p className="text-base font-medium text-foreground">{emptyStateTitle}</p>
                  <p className="text-sm text-muted-foreground">{emptyStateDescription}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
