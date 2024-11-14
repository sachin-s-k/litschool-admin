"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PerformanceMetrics } from "./performance-metrics";
import { InterviewInsights } from "./interview-insights";
import { DateRangePicker } from "./date-range-picker";
import { DateRange } from "react-day-picker";

export function ReportsTab() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting report in ${format} format`);
  };

  function onDateRangeChange(arg0: DateRange): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={(range) => onDateRangeChange(range ?? { from: undefined, to: undefined })}
        />
      </Card>

      <div className="grid gap-6">
        <PerformanceMetrics dateRange={dateRange} />
        <InterviewInsights dateRange={dateRange} />
      </div>
    </div>
  );
}