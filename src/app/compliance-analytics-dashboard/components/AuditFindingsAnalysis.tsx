'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface FindingData {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  resolved: number;
}

interface TopFinding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  department: string;
  frequency: number;
  lastOccurrence: string;
}

interface AuditFindingsAnalysisProps {
  trendData: FindingData[];
  topFindings: TopFinding[];
}

const AuditFindingsAnalysis = ({ trendData, topFindings }: AuditFindingsAnalysisProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [viewType, setViewType] = useState<'trend' | 'top'>('trend');

  const periods = [
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-error bg-red-50';
      case 'medium': return 'text-warning bg-yellow-50';
      case 'low': return 'text-success bg-green-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return 'XCircleIcon';
      case 'high': return 'ExclamationTriangleIcon';
      case 'medium': return 'ExclamationCircleIcon';
      case 'low': return 'InformationCircleIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const totalFindings = trendData.reduce((sum, month) => 
    sum + month.critical + month.high + month.medium + month.low, 0
  );

  const resolvedFindings = trendData.reduce((sum, month) => sum + month.resolved, 0);
  const resolutionRate = totalFindings > 0 ? Math.round((resolvedFindings / totalFindings) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Audit Findings Analysis</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {totalFindings} total findings
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Resolution Rate:</span>
              <span className={`text-sm font-medium ${
                resolutionRate >= 80 ? 'text-success' : 
                resolutionRate >= 60 ? 'text-warning' : 'text-error'
              }`}>
                {resolutionRate}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewType('trend')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ${
                viewType === 'trend' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Trend
            </button>
            <button
              onClick={() => setViewType('top')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-150 ${
                viewType === 'top' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Top Issues
            </button>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {viewType === 'trend' ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="critical" stackId="a" fill="#B91C1C" name="Critical" />
              <Bar dataKey="high" stackId="a" fill="#DC2626" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#D97706" name="Medium" />
              <Bar dataKey="low" stackId="a" fill="#059669" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-4">
          {topFindings.map((finding, index) => (
            <div key={finding.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getSeverityIcon(finding.severity)} 
                    size={20} 
                    className={finding.severity === 'critical' ? 'text-red-700' : 
                              finding.severity === 'high' ? 'text-error' :
                              finding.severity === 'medium' ? 'text-warning' : 'text-success'}
                  />
                  <div>
                    <div className="font-medium text-foreground">{finding.title}</div>
                    <div className="text-sm text-muted-foreground">{finding.department}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{finding.frequency} occurrences</div>
                  <div className="text-xs text-muted-foreground">Last: {finding.lastOccurrence}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(finding.severity)}`}>
                  {finding.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend for trend chart */}
      {viewType === 'trend' && (
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-700 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-muted-foreground">Low</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditFindingsAnalysis;