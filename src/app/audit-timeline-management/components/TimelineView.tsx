'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AuditPhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
  progress: number;
  milestones: Milestone[];
  color: string;
}

interface Milestone {
  id: string;
  name: string;
  date: Date;
  status: 'completed' | 'pending' | 'overdue';
  type: 'deliverable' | 'review' | 'meeting' | 'deadline';
  dependencies?: string[];
}

interface TimelineViewProps {
  audits: AuditPhase[];
  selectedAudit?: string;
  onAuditSelect: (auditId: string) => void;
  onMilestoneUpdate: (auditId: string, milestoneId: string, newDate: Date) => void;
}

const TimelineView = ({
  audits,
  selectedAudit,
  onAuditSelect,
  onMilestoneUpdate
}: TimelineViewProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedMilestone, setDraggedMilestone] = useState<{auditId: string, milestoneId: string} | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="h-96 bg-muted animate-pulse rounded-lg">
        <div className="p-6">
          <div className="h-6 bg-muted-foreground/20 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted-foreground/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'in-progress': return 'bg-primary';
      case 'overdue': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'deliverable': return 'DocumentIcon';
      case 'review': return 'EyeIcon';
      case 'meeting': return 'UsersIcon';
      case 'deadline': return 'ClockIcon';
      default: return 'CircleStackIcon';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: viewMode === 'year' ? 'numeric' : undefined
    });
  };

  const getTimelineWidth = () => {
    const startDate = new Date(Math.min(...audits.flatMap(a => [a.startDate.getTime(), ...a.milestones.map(m => m.date.getTime())])));
    const endDate = new Date(Math.max(...audits.flatMap(a => [a.endDate.getTime(), ...a.milestones.map(m => m.date.getTime())])));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1200, totalDays * 4); // 4px per day minimum
  };

  const getPositionFromDate = (date: Date, containerWidth: number) => {
    const startDate = new Date(Math.min(...audits.flatMap(a => [a.startDate.getTime(), ...a.milestones.map(m => m.date.getTime())])));
    const endDate = new Date(Math.max(...audits.flatMap(a => [a.endDate.getTime(), ...a.milestones.map(m => m.date.getTime())])));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceStart = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return (daysSinceStart / totalDays) * containerWidth;
  };

  const handleMilestoneDrag = (auditId: string, milestoneId: string, event: React.DragEvent) => {
    setDraggedMilestone({ auditId, milestoneId });
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleTimelineDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedMilestone || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate new date based on drop position
    const startDate = new Date(Math.min(...audits.flatMap(a => [a.startDate.getTime(), ...a.milestones.map(m => m.date.getTime())])));
    const endDate = new Date(Math.max(...audits.flatMap(a => [a.endDate.getTime(), ...a.milestones.map(m => m.date.getTime())])));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysFromStart = Math.round((x / containerWidth) * totalDays);
    const newDate = new Date(startDate.getTime() + (daysFromStart * 24 * 60 * 60 * 1000));

    onMilestoneUpdate(draggedMilestone.auditId, draggedMilestone.milestoneId, newDate);
    setDraggedMilestone(null);
  };

  const timelineWidth = getTimelineWidth();

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Timeline Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Audit Timeline</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-muted-foreground">View:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'month' | 'quarter' | 'year')}
                className="px-3 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="month">Monthly</option>
                <option value="quarter">Quarterly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <button className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-150">
              <Icon name="PlusIcon" size={16} className="mr-2" />
              Add Milestone
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
            <span className="text-muted-foreground">Upcoming</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Overdue</span>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="p-6">
        <div 
          ref={timelineRef}
          className="relative overflow-x-auto"
          style={{ minHeight: '400px' }}
          onDrop={handleTimelineDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="relative" style={{ width: `${timelineWidth}px`, minHeight: '350px' }}>
            {/* Time Grid */}
            <div className="absolute top-0 left-0 right-0 h-8 border-b border-border">
              {/* Time markers would be generated based on viewMode */}
              <div className="flex justify-between text-xs text-muted-foreground px-4 py-2">
                <span>Nov 2024</span>
                <span>Dec 2024</span>
                <span>Jan 2025</span>
                <span>Feb 2025</span>
                <span>Mar 2025</span>
              </div>
            </div>

            {/* Audit Phases */}
            {audits.map((audit, index) => {
              const yPosition = 60 + (index * 80);
              const startX = getPositionFromDate(audit.startDate, timelineWidth);
              const endX = getPositionFromDate(audit.endDate, timelineWidth);
              const width = endX - startX;

              return (
                <div key={audit.id} className="absolute" style={{ top: yPosition }}>
                  {/* Phase Bar */}
                  <div
                    className={`h-8 rounded-lg cursor-pointer transition-all duration-150 hover:shadow-medium ${
                      selectedAudit === audit.id ? 'ring-2 ring-ring' : ''
                    }`}
                    style={{
                      left: startX,
                      width: Math.max(width, 100),
                      backgroundColor: audit.color
                    }}
                    onClick={() => onAuditSelect(audit.id)}
                  >
                    <div className="flex items-center h-full px-3">
                      <span className="text-white text-sm font-medium truncate">
                        {audit.name}
                      </span>
                      <span className="ml-auto text-white text-xs">
                        {audit.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="h-1 bg-white/30 rounded-full mt-1"
                    style={{ left: startX, width: Math.max(width, 100) }}
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${audit.progress}%` }}
                    ></div>
                  </div>

                  {/* Milestones */}
                  {audit.milestones.map((milestone) => {
                    const milestoneX = getPositionFromDate(milestone.date, timelineWidth);
                    return (
                      <div
                        key={milestone.id}
                        className="absolute cursor-move group"
                        style={{
                          left: milestoneX - 8,
                          top: 40
                        }}
                        draggable
                        onDragStart={(e) => handleMilestoneDrag(audit.id, milestone.id, e)}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 border-white ${getStatusColor(milestone.status)} group-hover:scale-110 transition-transform duration-150`}></div>
                        
                        {/* Milestone Tooltip */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg px-3 py-2 shadow-large opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Icon name={getMilestoneIcon(milestone.type)} size={14} className="text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{milestone.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(milestone.date)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Phase Label */}
                  <div className="absolute -left-4 top-0 transform -translate-x-full">
                    <div className="text-sm font-medium text-foreground whitespace-nowrap">
                      {audit.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(audit.startDate)} - {formatDate(audit.endDate)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current Date Indicator */}
            <div
              className="absolute top-8 bottom-0 w-0.5 bg-error z-10"
              style={{
                left: getPositionFromDate(currentDate, timelineWidth)
              }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-error rounded-full"></div>
              <div className="absolute -top-8 -left-8 text-xs text-error font-medium whitespace-nowrap">
                Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;