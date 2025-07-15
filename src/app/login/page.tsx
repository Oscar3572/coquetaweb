'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (cred.user.email === 'dhernandezsic@gmail.com') {
        router.push('/admin'); // redirige al dashboard principal
      } else {
        setError('No tienes acceso autorizado.');
      }
    } catch (err: any) {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fde9ef] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md p-8 rounded-lg w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4 text-center text-[#4B2E2E]">
          Inicio de sesión
        </h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-3 text-sm text-black placeholder:text-gray-600"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4 text-sm text-black placeholder:text-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-[#bb8588] text-white font-semibold py-2 rounded hover:bg-[#a46d77]"
        >
          Ingresar
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
