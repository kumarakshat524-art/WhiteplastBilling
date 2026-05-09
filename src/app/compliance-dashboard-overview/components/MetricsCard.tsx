import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MetricsCardProps {
  title: string;
  value: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  icon: string;
  color: 'primary' | 'warning' | 'error' | 'success';
  onClick?: () => void;
}

const MetricsCard = ({ title, value, trend, icon, color, onClick }: MetricsCardProps) => {
  const getColorClasses = (colorType: string) => {
    switch (colorType) {
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return 'ArrowTrendingUpIcon';
      case 'down':
        return 'ArrowTrendingDownIcon';
      default:
        return 'MinusIcon';
    }
  };

  const getTrendColor = () => {
    if (color === 'error' || color === 'warning') {
      return trend.direction === 'down' ? 'text-success' : 'text-error';
    }
    return trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div 
      className={`bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-medium hover-lift transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        <div className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${getTrendColor().includes('success') ? 'bg-success/10' : getTrendColor().includes('error') ? 'bg-error/10' : 'bg-muted/50'}`}>
          <Icon name={getTrendIcon()} size={14} />
          <span className={getTrendColor()}>{trend.percentage}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-foreground leading-tight">{value.toLocaleString()}</h3>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">vs {trend.period}</p>
      </div>
    </div>
  );
};

export default MetricsCard;