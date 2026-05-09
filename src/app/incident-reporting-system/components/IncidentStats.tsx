import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatsData {
  totalIncidents: number;
  openIncidents: number;
  criticalIncidents: number;
  resolvedThisWeek: number;
  averageResolutionTime: string;
  escalatedIncidents: number;
}

interface IncidentStatsProps {
  stats: StatsData;
  className?: string;
}

const IncidentStats = ({ stats, className = '' }: IncidentStatsProps) => {
  const statCards = [
    {
      title: 'Total Incidents',
      value: stats.totalIncidents,
      icon: 'ExclamationTriangleIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Open Incidents',
      value: stats.openIncidents,
      icon: 'ClockIcon',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-8%',
      changeType: 'decrease'
    },
    {
      title: 'Critical Incidents',
      value: stats.criticalIncidents,
      icon: 'ShieldExclamationIcon',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Resolved This Week',
      value: stats.resolvedThisWeek,
      icon: 'CheckCircleIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Avg Resolution Time',
      value: stats.averageResolutionTime,
      icon: 'ClockIcon',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '-2.3 days',
      changeType: 'decrease'
    },
    {
      title: 'Escalated',
      value: stats.escalatedIncidents,
      icon: 'ArrowTrendingUpIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+2',
      changeType: 'increase'
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
      {statCards.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-3 lg:p-4 hover-lift min-h-[112px] flex flex-col">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className={`p-2 rounded-lg ${card.bgColor} flex-shrink-0`}>
              <Icon name={card.icon} size={18} className={card.color} />
            </div>
            <div className={`flex items-center text-xs font-medium ${
              card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon 
                name={card.changeType === 'increase' ? 'ArrowUpIcon' : 'ArrowDownIcon'} 
                size={10} 
                className="mr-1" 
              />
              <span className="text-xs">{card.change}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-xl lg:text-2xl font-bold text-foreground mb-1 leading-tight">{card.value}</p>
            <p className="text-xs lg:text-sm text-muted-foreground leading-tight break-words">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncidentStats;