
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Image
        src="/logo/Snaker.png" // Updated path
        alt="Snacker App Logo"
        width={150} 
        height={150} 
        priority 
      />
      <p className="mt-6 text-xl font-semibold text-primary animate-pulse">
        Loading Snacker...
      </p>
    </div>
  );
}
