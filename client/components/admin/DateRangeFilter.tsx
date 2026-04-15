import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  isLoading?: boolean;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  isLoading = false,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilter = useCallback(() => {
    onDateRangeChange(startDate || null, endDate || null);
  }, [startDate, endDate, onDateRangeChange]);

  const handleClearFilter = useCallback(() => {
    setStartDate("");
    setEndDate("");
    onDateRangeChange(null, null);
  }, [onDateRangeChange]);

  const hasActiveFilters = startDate || endDate;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Calendar className="h-5 w-5 text-gray-500" />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Date Range Filter
          {hasActiveFilters && (
            <span className="ml-2 text-sm font-normal text-blue-600">
              ({startDate && endDate ? "2 dates" : "1 date"} selected)
            </span>
          )}
        </button>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsExpanded(false);
                handleClearFilter();
              }}
              disabled={isLoading}
            >
              Clear
            </Button>
            <Button
              onClick={handleApplyFilter}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Applying..." : "Apply Filter"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
