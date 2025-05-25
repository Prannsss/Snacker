import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-lg text-foreground">Loading Snacker...</p>
    </div>
  );
}
