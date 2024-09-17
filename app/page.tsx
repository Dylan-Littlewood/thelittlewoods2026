import Image from "next/image";

export default function Home() {
  return (
    <div className="grid content-center items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
          src="/WeddingLogo.png"
          alt="wedding logo"
          width={250}
          height={250}
          priority
        />
        <h1 className="text-center text-2xl">Development</h1>
        <p className="w-96 text-center">
          This is the development branch to be used separate to the actual sites deployment..
        </p>
      </main>
    </div>
  );
}
