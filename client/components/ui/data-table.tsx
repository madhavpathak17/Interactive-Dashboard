import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: Record<string, any>[];
  title?: string;
  searchable?: boolean;
  pageSize?: number;
  className?: string;
}

export function DataTable({ 
  data, 
  title = "Data Table", 
  searchable = true, 
  pageSize = 10,
  className 
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No data available. Please upload a CSV file to view student placement records.
          </div>
        </CardContent>
      </Card>
    );
  }

  const columns = Object.keys(data[0]);

  // Filter and sort data
  let filteredData = data;
  if (searchTerm) {
    filteredData = data.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  if (sortConfig) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    setSortConfig(current => {
      if (current?.key === columnKey) {
        return {
          key: columnKey,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <CardTitle>{title}</CardTitle>
          {searchable && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="text-left p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="capitalize">{column.replace(/_/g, ' ')}</span>
                      <SortIcon columnKey={column} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-border hover:bg-accent/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column} className="p-3 text-sm">
                      {row[column]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
