import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import SystemConfigurationInteractive from './components/SystemConfigurationInteractive';

export const metadata: Metadata = {
  title: 'System Configuration Center - ComplianceHub',
  description: 'Administrative control interface for managing system-wide compliance settings, workflow configurations, and integration parameters with comprehensive change control processes.',
};

export default function SystemConfigurationCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-6">
          <Breadcrumb 
            items={[
              { label: 'Dashboard', path: '/compliance-dashboard-overview', icon: 'HomeIcon' },
              { label: 'System Configuration', icon: 'Cog6ToothIcon' }
            ]}
          />
          
          <SystemConfigurationInteractive />
        </div>
      </main>
    </div>
  );
}