import Image from "next/image";
import Component from "@/components/query"; // Assuming this is your search component

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-12 bg-gradient-to-b from-green-200 to-blue-200">
      <div className="text-center mb-12">
        <Image
          src="/pokemon-logo.png"
          alt="Pokémon Logo"
          width={200}
          height={80}
          priority
          className="mb-8"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Pokémon Card Finder</h1>
        <p className="text-lg text-gray-600 mb-8">
          Search for your favorite Pokémon cards and explore detailed information.
        </p>
      </div>
      <div className="flex w-full max-w-7xl justify-center">
        <Component />
      </div>
    </main>
  );
}
