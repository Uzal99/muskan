import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(5rem,20vw,12rem)] uppercase leading-none text-white">
          Cut<span className="text-brand">.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          This scene didn&apos;t make the final edit. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
