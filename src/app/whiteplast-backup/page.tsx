import type { Metadata } from 'next';
import BackupInteractive from './components/BackupInteractive';

export const metadata: Metadata = {
  title: 'Backup & Restore - Whiteplast Distribution',
};

export default function BackupPage() {
  return <BackupInteractive />;
}
