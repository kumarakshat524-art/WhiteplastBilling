'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface PolicyData {
  category: string;
  adopted: number;
  pending: number;
  total: number;
  adoptionRate: number;
}

interface PolicyAdoptionChartProps {
  data: PolicyData[];
}

const PolicyAdoptionChart = ({ data }: PolicyAdoptionChartProps) => {
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');

  const colors = ['#2563EB', '#0EA5E9', '#059669', '#D97706', '#DC2626'];

  const pieData = data.map((item, index) => ({
    name: item.category,
    value: item.adoptionRate,
    color: colors[index % colors.length]
  }));

  const totalPolicies = data.reduce((sum, item) => sum + item.total, 0);
  const totalAdopted = data.reduce((sum, item) => sum + item.adopted, 0);
  const overallAdoptionRate = Math.round((totalAdopted / totalPolicies) * 100);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Policy Adoption Rates</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">{overallAdoptionRate}%</span>
              <span className="text-sm text-muted-foreground">Overall Adoption</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {totalAdopted} of {totalPolicies} policies adopted
            </div>
          </div>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setChartView('bar')}
            className={`p-2 rounded-md transition-colors duration-150 ${
              chartView === 'bar' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="ChartBarIcon" size={16} />
          </button>
          <button
            onClick={() => setChartView('pie')}
            className={`p-2 rounded-md transition-colors duration-150 ${
              chartView === 'pie' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="ChartPieIcon" size={16} />
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="category" 
                stroke="#64748B"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Adoption Rate']}
              />
              <Bar 
                dataKey="adoptionRate" 
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Adoption Rate']}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Policy Details Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Adopted</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Pending</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Total</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-border last:border-b-0">
                <td className="py-3 text-foreground font-medium">{item.category}</td>
                <td className="py-3 text-right text-success font-medium">{item.adopted}</td>
                <td className="py-3 text-right text-warning font-medium">{item.pending}</td>
                <td className="py-3 text-right text-foreground">{item.total}</td>
                <td className="py-3 text-right">
                  <span className={`font-medium ${
                    item.adoptionRate >= 90 ? 'text-success' :
                    item.adoptionRate >= 70 ? 'text-warning' : 'text-error'
                  }`}>
                    {item.adoptionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyAdoptionChart;