"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TableMeta } from "./columns";
import { TablePagination } from "./TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  meta?: TableMeta;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnVisibility,
  columnFilters,
  onColumnFiltersChange,
  pagination,
  onPaginationChange,
  meta,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility,
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      onColumnFiltersChange(newFilters);
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      onPaginationChange(newPagination);
    },
    meta,
  });

  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No applications yet. Add your first application to get
                    started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pageCount}
        totalRows={data.length}
        filteredRows={filteredRowCount}
        onPageChange={(pageIndex) =>
          onPaginationChange({ ...pagination, pageIndex })
        }
        onPageSizeChange={(pageSize) =>
          onPaginationChange({ pageIndex: 0, pageSize })
        }
      />
    </div>
  );
}
