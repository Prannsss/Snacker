
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Image
        src="/logo/Snacker.png"
        alt="Snacker App Logo"
        width={150} // You might want to adjust this width
        height={150} // And this height, or use aspect ratio if known
        priority //  Hint to Next.js to load this image early
      />
      <p className="mt-6 text-xl font-semibold text-primary animate-pulse">
        Loading Snacker...
      </p>
    </div>
  );
}
