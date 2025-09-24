import { CheckCircle2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary/80 text-primary-foreground shadow-md backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-3 p-4">
        <CheckCircle2 className="h-8 w-8" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Task Master
        </h1>
      </div>
    </header>
  );
}
