import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MetricCard {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

interface RiskMetricsProps {
  totalRisks: number;
  criticalRisks: number;
  mitigatedRisks: number;
  overdueReviews: number;
}

const RiskMetrics = ({ totalRisks, criticalRisks, mitigatedRisks, overdueReviews }: RiskMetricsProps) => {
  const metrics: MetricCard[] = [
    {
      title: 'Total Active Risks',
      value: totalRisks,
      change: 5.2,
      changeType: 'increase',
      icon: 'ExclamationTriangleIcon',
      color: 'text-orange-600'
    },
    {
      title: 'Critical Risks',
      value: criticalRisks,
      change: 12.3,
      changeType: 'increase',
      icon: 'ShieldExclamationIcon',
      color: 'text-red-600'
    },
    {
      title: 'Mitigated This Month',
      value: mitigatedRisks,
      change: 8.7,
      changeType: 'increase',
      icon: 'CheckCircleIcon',
      color: 'text-green-600'
    },
    {
      title: 'Overdue Reviews',
      value: overdueReviews,
      change: 3.1,
      changeType: 'decrease',
      icon: 'ClockIcon',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4 lg:p-6 hover-lift h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
              <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">{metric.title}</p>
              <p className="text-xl lg:text-2xl font-bold text-foreground mt-2">{metric.value}</p>
              <div className="flex items-center mt-2">
                <Icon
                  name={metric.changeType === 'increase' ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                  size={14}
                  className={metric.changeType === 'increase' ? 'text-red-500' : 'text-green-500'}
                />
                <span className={`text-xs font-medium ml-1 ${
                  metric.changeType === 'increase' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {metric.change}%
                </span>
                <span className="text-xs text-muted-foreground ml-1 truncate">vs last month</span>
              </div>
            </div>
            <div className={`p-2.5 lg:p-3 rounded-lg bg-muted ${metric.color} flex-shrink-0 ml-3`}>
              <Icon name={metric.icon} size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskMetrics;