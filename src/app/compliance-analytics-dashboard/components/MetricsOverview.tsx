import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

interface MetricsOverviewProps {
  metrics: MetricCard[];
}

const MetricsOverview = ({ metrics }: MetricsOverviewProps) => {
  const getChangeColor = (changeType: string, change: number) => {
    if (change === 0) return 'text-muted-foreground';
    return changeType === 'increase' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType: string, change: number) => {
    if (change === 0) return 'MinusIcon';
    return changeType === 'increase' ? 'ArrowUpIcon' : 'ArrowDownIcon';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-card border border-border rounded-lg p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
              <Icon name={metric.icon} size={24} className="text-white" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType, metric.change)}`}>
              <Icon name={getChangeIcon(metric.changeType, metric.change)} size={16} />
              <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{metric.value}</h3>
            <p className="text-sm text-muted-foreground">{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;