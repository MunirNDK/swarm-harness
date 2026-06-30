import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dac-black">
      {/* Subtle red glow */}
      <div
        className="absolute inset-0 bg-dac-red/5 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col items-center text-center py-20">
        {/* 404 */}
        <h1 className="font-heading text-[10rem] sm:text-[12rem] font-bold text-dac-red leading-none tracking-tighter">
          404
        </h1>

        {/* Heading */}
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-dac-white mt-4">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-4 text-dac-muted text-base sm:text-lg max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* CTA */}
        <Button variant="primary" size="lg" className="mt-8" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </Container>
    </div>
  );
}
