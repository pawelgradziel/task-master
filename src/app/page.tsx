import Header from '@/components/header';
import TaskList from '@/components/task-list';
import { CloudFunctionTest } from '@/components/cloud-function-test';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <CloudFunctionTest />
        <TaskList />
      </main>
    </div>
  );
}
