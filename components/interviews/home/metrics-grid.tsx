"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsGrid() {
  const metrics = [
    {
      title: "Today's Interviews",
      value: "8",
      description: "3 completed, 5 remaining",
      icon: Calendar,
    },
    {
      title: "Completed Today",
      value: "3",
      description: "All feedback submitted",
      icon: CheckCircle,
    },
    {
      title: "Pending Feedback",
      value: "2",
      description: "Feedback submission required",
      icon: Clock,
    },
    {
      title: "This Week",
      value: "32",
      description: "Total scheduled interviews",
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}