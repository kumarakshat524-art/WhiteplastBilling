import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  owner: string;
  status: 'Open' | 'In Progress' | 'Mitigated' | 'Closed';
  department: string;
  nextReview: string;
  mitigationStatus: string;
  lastUpdated: string;
}

interface RiskRegisterProps {
  risks: Risk[];
  selectedRisks: string[];
  onRiskSelect: (riskId: string) => void;
  onSelectAll: () => void;
  onRiskClick: (risk: Risk) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const RiskRegister = ({
  risks,
  selectedRisks,
  onRiskSelect,
  onSelectAll,
  onRiskClick,
  sortField,
  sortDirection,
  onSort
}: RiskRegisterProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Mitigated': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 20) return 'text-red-600 font-semibold';
    if (score >= 15) return 'text-orange-600 font-semibold';
    if (score >= 10) return 'text-yellow-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <Icon name="ChevronUpDownIcon" size={16} className="text-muted-foreground" />;
    }
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
        size={16} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground">Risk Register</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {risks.length} risks • {selectedRisks.length} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center px-2.5 py-1.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              <Icon name="FunnelIcon" size={14} className="mr-1.5" />
              Filter
            </button>
            <button className="inline-flex items-center px-2.5 py-1.5 text-xs lg:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              <Icon name="ArrowDownTrayIcon" size={14} className="mr-1.5" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-3 py-2.5 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRisks.length === risks.length && risks.length > 0}
                    onChange={onSelectAll}
                    className="rounded border-border focus:ring-primary"
                  />
                </th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">
                  <button
                    onClick={() => onSort('id')}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>ID</span>
                    <SortIcon field="id" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left min-w-[200px]">
                  <button
                    onClick={() => onSort('title')}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>Risk Description</span>
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">
                  <button
                    onClick={() => onSort('category')}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>Category</span>
                    <SortIcon field="category" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">
                  <button
                    onClick={() => onSort('probability')}
                    className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full"
                  >
                    <span>Likelihood</span>
                    <SortIcon field="probability" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">
                  <button
                    onClick={() => onSort('impact')}
                    className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full"
                  >
                    <span>Impact</span>
                    <SortIcon field="impact" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">
                  <button
                    onClick={() => onSort('riskScore')}
                    className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full"
                  >
                    <span>Score</span>
                    <SortIcon field="riskScore" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">
                  <button
                    onClick={() => onSort('owner')}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>Owner</span>
                    <SortIcon field="owner" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">
                  <button
                    onClick={() => onSort('status')}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>Status</span>
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">
                  <button
                    onClick={() => onSort('nextReview')}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>Next Review</span>
                    <SortIcon field="nextReview" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center whitespace-nowrap">
                  <span className="text-xs font-medium text-muted-foreground">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {risks.map((risk) => (
                <tr
                  key={risk.id}
                  className="hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
                  onClick={() => onRiskClick(risk)}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRisks.includes(risk.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onRiskSelect(risk.id);
                      }}
                      className="rounded border-border focus:ring-primary"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="text-xs font-medium text-foreground">{risk.id}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="min-w-[180px] max-w-[280px]">
                      <div className="text-xs font-medium text-foreground truncate">{risk.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 break-words">
                        {risk.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {risk.category}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < risk.probability ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < risk.impact ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className={`text-xs font-semibold ${getRiskScoreColor(risk.riskScore)}`}>
                      {risk.riskScore}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {risk.owner.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs text-foreground truncate max-w-[100px]">{risk.owner}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(risk.status)}`}>
                      {risk.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="text-xs text-foreground">{formatDate(risk.nextReview)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon name="PencilIcon" size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon name="EyeIcon" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskRegister;