import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import AuditInteractive from './components/AuditInteractive';

export const metadata: Metadata = {
  title: 'Audit Timeline Management - ComplianceHub',
  description: 'Comprehensive audit project management interface with timeline visualization, evidence collection workflows, and team collaboration tools for internal and external audits.',
};

export default function AuditTimelineManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar onToggleCollapse={() => {}} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={[]} />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Audit Timeline Management
                </h1>
                <p className="text-muted-foreground">
                  Coordinate audit projects through timeline visualization and evidence collection workflows
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground">Active Audits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary">16</div>
                  <div className="text-sm text-muted-foreground">Evidence Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-warning">2</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <AuditInteractive />
        </div>
      </main>
    </div>
  );
}