// src/pages/auth/signed-out.tsx
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignedOut() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="mx-auto max-w-md p-6 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1 className="text-2xl font-semibold mb-2">Sesión cerrada</h1>
      <p className="mb-4">Cerraste sesión correctamente.</p>
      <p className="mb-4 text-sm text-white/70">
        Serás redirigido al inicio en 3 segundos...
      </p>
      <Link href="/" className="text-blue-400 underline">
        Volver al inicio ahora
      </Link>
    </main>
  );
}
