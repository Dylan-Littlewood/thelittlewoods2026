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
        <h1 className="text-center text-2xl">Welcome to Dylan and Jess' wedding website</h1>
        <p className="w-96 text-center">
          This site is still under construction so please be patient while we work on getting this up and running.
        </p>
      </main>
    </div>
  );
}
