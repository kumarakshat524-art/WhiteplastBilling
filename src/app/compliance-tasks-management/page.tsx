import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import TasksInteractive from './components/TasksInteractive';

export const metadata: Metadata = {
  title: 'Compliance Tasks Management - ComplianceHub',
  description: 'Centralized task management interface for tracking compliance workflows, assignments, and progress with advanced filtering and bulk operations.',
};

export default function ComplianceTasksManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar onToggleCollapse={() => {}} />
        <main className="flex-1 ml-0 lg:ml-60">
          <div className="p-6">
            <Breadcrumb items={[]} />
            <TasksInteractive />
          </div>
        </main>
      </div>
    </div>
  );
}