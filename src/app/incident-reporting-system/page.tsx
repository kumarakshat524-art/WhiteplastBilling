import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import IncidentReportingInteractive from './components/IncidentReportingInteractive';

export const metadata: Metadata = {
  title: 'Incident Reporting System - ComplianceHub',
  description: 'Streamlined incident capture and investigation management interface for rapid incident response and comprehensive tracking through structured workflows.',
};

export default function IncidentReportingSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          <div className="mb-6">
            <Breadcrumb />
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-foreground">Incident Reporting System</h1>
              <p className="text-muted-foreground mt-1">
                Manage incident reports, investigations, and resolution workflows with comprehensive tracking and escalation procedures.
              </p>
            </div>
          </div>
          
          <IncidentReportingInteractive />
        </div>
      </main>
    </div>
  );
}