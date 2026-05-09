import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MetricCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
  description: string;
}

interface AccessMetricsProps {
  metrics: MetricCard[];
}

const AccessMetrics = ({ metrics }: AccessMetricsProps) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return 'ArrowTrendingUpIcon';
    if (change < 0) return 'ArrowTrendingDownIcon';
    return 'MinusIcon';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric.color}`}>
              <Icon name={metric.icon} size={24} className="text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric.change)}`}>
              <Icon name={getChangeIcon(metric.change)} size={16} />
              <span>{Math.abs(metric.change)}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              {metric.value.toLocaleString()}
            </h3>
            <p className="text-sm font-medium text-foreground">{metric.title}</p>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccessMetrics;