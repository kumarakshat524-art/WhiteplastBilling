import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface RiskItem {
  id: string;
  category: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  description: string;
}

interface RiskHeatmapProps {
  risks: RiskItem[];
}

const RiskHeatmap = ({ risks }: RiskHeatmapProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500 text-white border-red-600';
      case 'high':
        return 'bg-orange-500 text-white border-orange-600';
      case 'medium':
        return 'bg-yellow-500 text-white border-yellow-600';
      default:
        return 'bg-green-500 text-white border-green-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return 'ExclamationTriangleIcon';
      case 'high':
        return 'ShieldExclamationIcon';
      case 'medium':
        return 'ExclamationCircleIcon';
      default:
        return 'CheckCircleIcon';
    }
  };

  const totalRisks = risks.reduce((sum, risk) => sum + risk.count, 0);
  const criticalRisks = risks.filter(r => r.level === 'critical').reduce((sum, risk) => sum + risk.count, 0);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Risk Heatmap</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-semibold text-foreground">{totalRisks}</span>
          </div>
        </div>
        
        {criticalRisks > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
            <Icon name="ExclamationTriangleIcon" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              {criticalRisks} Critical Risk{criticalRisks !== 1 ? 's' : ''} Require Immediate Attention
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className={`p-4 rounded-lg border-2 hover:shadow-medium transition-all duration-150 hover-lift cursor-pointer ${getRiskColor(risk.level)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon name={getRiskIcon(risk.level)} size={20} />
                <span className="text-xl font-bold">{risk.count}</span>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{risk.category}</h4>
                <p className="text-xs opacity-90 line-clamp-2">{risk.description}</p>
              </div>
              
              <div className="mt-3 pt-2 border-t border-white/20">
                <span className="text-xs font-medium uppercase tracking-wide">
                  {risk.level} Risk
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-muted-foreground">Critical</span>
              </div>
            </div>
            
            <button className="text-primary hover:text-primary/80 font-medium transition-colors duration-150">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;