'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RiskItem {
  id: string;
  category: string;
  subcategory: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  probability: number;
  lastUpdated: string;
}

interface RiskHeatMapProps {
  risks: RiskItem[];
}

const RiskHeatMap = ({ risks }: RiskHeatMapProps) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const riskLevels = [
    { value: 'all', label: 'All Risks', color: 'bg-muted' },
    { value: 'low', label: 'Low', color: 'bg-success' },
    { value: 'medium', label: 'Medium', color: 'bg-warning' },
    { value: 'high', label: 'High', color: 'bg-error' },
    { value: 'critical', label: 'Critical', color: 'bg-red-700' }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success hover:bg-success/80';
      case 'medium': return 'bg-warning hover:bg-warning/80';
      case 'high': return 'bg-error hover:bg-error/80';
      case 'critical': return 'bg-red-700 hover:bg-red-700/80';
      default: return 'bg-muted hover:bg-muted/80';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return 'CheckCircleIcon';
      case 'medium': return 'ExclamationCircleIcon';
      case 'high': return 'ExclamationTriangleIcon';
      case 'critical': return 'XCircleIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const filteredRisks = filterLevel === 'all' 
    ? risks 
    : risks.filter(risk => risk.level === filterLevel);

  const riskCounts = {
    low: risks.filter(r => r.level === 'low').length,
    medium: risks.filter(r => r.level === 'medium').length,
    high: risks.filter(r => r.level === 'high').length,
    critical: risks.filter(r => r.level === 'critical').length
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Risk Heat Map</h3>
          <p className="text-sm text-muted-foreground">
            {filteredRisks.length} risks across all categories
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {riskLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk Level Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {riskLevels.slice(1).map((level) => (
          <div key={level.value} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className={`w-3 h-3 ${level.color} rounded-full`}></div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {riskCounts[level.value as keyof typeof riskCounts]}
              </div>
              <div className="text-xs text-muted-foreground">{level.label} Risk</div>
            </div>
          </div>
        ))}
      </div>

      {/* Heat Map Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            onClick={() => setSelectedRisk(risk)}
            className={`
              ${getRiskColor(risk.level)} 
              p-4 rounded-lg cursor-pointer transition-all duration-150 hover-lift
              ${selectedRisk?.id === risk.id ? 'ring-2 ring-ring' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon 
                name={getRiskIcon(risk.level)} 
                size={20} 
                className="text-white" 
              />
              <span className="text-xs text-white/80 font-medium uppercase">
                {risk.level}
              </span>
            </div>
            <div className="text-white">
              <div className="font-medium text-sm mb-1">{risk.category}</div>
              <div className="text-xs opacity-90">{risk.subcategory}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Details Panel */}
      {selectedRisk && (
        <div className="bg-muted rounded-lg p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">{selectedRisk.category}</h4>
            <button
              onClick={() => setSelectedRisk(null)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subcategory:</span>
              <span className="text-sm text-foreground">{selectedRisk.subcategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <span className={`text-sm font-medium capitalize ${
                selectedRisk.level === 'critical' ? 'text-red-700' :
                selectedRisk.level === 'high' ? 'text-error' :
                selectedRisk.level === 'medium' ? 'text-warning' : 'text-success'
              }`}>
                {selectedRisk.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Impact Score:</span>
              <span className="text-sm text-foreground">{selectedRisk.impact}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Probability:</span>
              <span className="text-sm text-foreground">{selectedRisk.probability}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated:</span>
              <span className="text-sm text-foreground">{selectedRisk.lastUpdated}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskHeatMap;