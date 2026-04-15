import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface RowAction<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (row: T, index: number) => void;
  variant?: 'default' | 'destructive' | 'ghost';
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchFields?: (keyof T)[];
  rowKey?: keyof T | ((row: T, index: number) => string);
  onSearch?: (query: string) => void;
  perPage?: number;
  loading?: boolean;
  actions?: RowAction<T>[];
  onEdit?: (row: T, index: number) => void;
  onDelete?: (row: T, index: number) => void;
  striped?: boolean;
  hoverable?: boolean;
  title?: string;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  searchFields = [],
  rowKey = 'id',
  onSearch,
  perPage = 10,
  loading = false,
  actions = [],
  onEdit,
  onDelete,
  striped = true,
  hoverable = true,
  title,
  emptyMessage = 'No data found',
}: TableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filtered = search
    ? data.filter(row =>
        searchFields.some(field =>
          String((row as any)[field]).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const sorted = sortBy
    ? [...filtered].sort((a, b) => {
        const aVal = (a as any)[sortBy];
        const bVal = (b as any)[sortBy];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    onSearch?.(value);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    return String((row as any)[rowKey]);
  };

  const allActions = [
    ...(onEdit ? [{ label: 'Edit', icon: Edit2, onClick: onEdit, variant: 'ghost' as const }] : []),
    ...actions,
    ...(onDelete ? [{ label: 'Delete', icon: Trash2, onClick: onDelete, variant: 'destructive' as const }] : []),
  ];

  return (
    <div className="space-y-4">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      {searchFields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80">
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    className={`px-4 py-3 font-semibold text-muted-foreground text-${col.align || 'left'}`}
                    style={{ width: col.width, textAlign: col.align || 'left' }}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(String(col.key))}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        {col.label}
                        {sortBy === col.key && (
                          <span className="text-xs">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
                {allActions.length > 0 && (
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (allActions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (allActions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => {
                  const firstAction = allActions[0];
                  const FirstActionIcon = firstAction?.icon;

                  return (
                    <motion.tr
                      key={getRowKey(row, i)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b last:border-0 transition-colors ${
                        hoverable ? 'hover:bg-slate-50/50' : ''
                      } ${striped && i % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                    >
                      {columns.map(col => (
                        <td 
                          key={String(col.key)} 
                          className="px-4 py-3"
                          style={{ textAlign: col.align || 'left' }}
                        >
                          {col.render
                            ? col.render((row as any)[col.key as string], row, i)
                            : (row as any)[col.key as string]}
                        </td>
                      ))}
                      {allActions.length > 0 && (
                        <td className="px-4 py-3 text-center">
                          {allActions.length === 1 && firstAction ? (
                            <Button
                              size="sm"
                              variant={firstAction.variant || 'ghost'}
                              onClick={() => firstAction.onClick(row, i)}
                            >
                              {FirstActionIcon && <FirstActionIcon className="size-4" />}
                              {firstAction.label}
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {allActions.map((action, idx) => {
                                  const ActionIcon = action.icon;
                                  return (
                                    <DropdownMenuItem
                                      key={idx}
                                      onClick={() => action.onClick(row, i)}
                                      className={action.variant === 'destructive' ? 'text-destructive' : ''}
                                    >
                                      {ActionIcon && <ActionIcon className="mr-2 size-4" />}
                                      {action.label}
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, sorted.length)} of{' '}
              {sorted.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
