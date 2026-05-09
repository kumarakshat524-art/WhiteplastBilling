import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Risk {
  id: string;
  title: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  owner: string;
  status: 'Open' | 'In Progress' | 'Mitigated' | 'Closed';
  department: string;
}

interface RiskMatrixProps {
  risks: Risk[];
  onRiskClick: (risk: Risk) => void;
  selectedRisk: Risk | null;
}

const RiskMatrix = ({ risks, onRiskClick, selectedRisk }: RiskMatrixProps) => {
  const matrixSize = 5;
  
  const getRiskColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 20) return 'bg-red-500';
    if (score >= 15) return 'bg-orange-500';
    if (score >= 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskColorText = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score >= 20) return 'text-white';
    if (score >= 15) return 'text-white';
    if (score >= 10) return 'text-gray-800';
    return 'text-white';
  };

  const getRisksInCell = (probability: number, impact: number) => {
    return risks.filter(risk => 
      Math.ceil(risk.probability) === probability && 
      Math.ceil(risk.impact) === impact
    );
  };

  const impactLabels = ['Very High', 'High', 'Medium', 'Low', 'Very Low'];
  const probabilityLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

  return (
    <div className="bg-card rounded-lg border border-border p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-foreground">Risk Matrix</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Probability vs Impact visualization</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded"></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-red-500 rounded"></div>
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 -rotate-90">
            <span className="text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Impact</span>
          </div>

          {/* Matrix grid */}
          <div className="ml-16 lg:ml-20">
            {/* Impact labels */}
            <div className="flex mb-1.5">
              <div className="w-12 lg:w-16"></div>
              {impactLabels.map((label, index) => (
                <div key={index} className="flex-1 text-center px-1">
                  <span className="text-xs text-muted-foreground block truncate">{label}</span>
                </div>
              ))}
            </div>

            {/* Matrix cells */}
            {Array.from({ length: matrixSize }, (_, probIndex) => {
              const probability = matrixSize - probIndex;
              return (
                <div key={probIndex} className="flex items-center mb-0.5">
                  <div className="w-12 lg:w-16 text-right pr-1.5 lg:pr-2">
                    <span className="text-xs text-muted-foreground block truncate">
                      {probabilityLabels[probability - 1]}
                    </span>
                  </div>
                  {Array.from({ length: matrixSize }, (_, impactIndex) => {
                    const impact = impactIndex + 1;
                    const cellRisks = getRisksInCell(probability, impact);
                    const hasRisks = cellRisks.length > 0;
                    
                    return (
                      <div
                        key={impactIndex}
                        className={`
                          flex-1 aspect-square border border-border m-0.5 rounded cursor-pointer
                          transition-all duration-150 hover:scale-105 hover:shadow-medium
                          ${hasRisks ? getRiskColor(probability, impact) : 'bg-muted'}
                          ${selectedRisk && cellRisks.some(r => r.id === selectedRisk.id) ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => cellRisks.length > 0 && onRiskClick(cellRisks[0])}
                      >
                        {hasRisks && (
                          <div className={`p-1 lg:p-2 h-full flex flex-col justify-center items-center ${getRiskColorText(probability, impact)}`}>
                            <div className="text-base lg:text-lg font-bold">{cellRisks.length}</div>
                            <div className="text-xs opacity-90 hidden sm:block">
                              {cellRisks.length === 1 ? 'Risk' : 'Risks'}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* X-axis label */}
            <div className="text-center mt-3 lg:mt-4">
              <span className="text-xs lg:text-sm font-medium text-muted-foreground">Probability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk details tooltip */}
      {selectedRisk && (
        <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm lg:text-base truncate">{selectedRisk.title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{selectedRisk.category}</p>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Risk Score: <span className="font-medium text-foreground">{selectedRisk.riskScore}</span>
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Owner: <span className="font-medium text-foreground">{selectedRisk.owner}</span>
                </span>
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  ${selectedRisk.status === 'Open' ? 'bg-red-100 text-red-800' : ''}
                  ${selectedRisk.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${selectedRisk.status === 'Mitigated' ? 'bg-green-100 text-green-800' : ''}
                  ${selectedRisk.status === 'Closed' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {selectedRisk.status}
                </span>
              </div>
            </div>
            <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMatrix;