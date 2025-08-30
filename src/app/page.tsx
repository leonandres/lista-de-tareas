"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider, db } from "@/lib/firebaseClient";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  // 🔹 Escuchar cambios de sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // 🔹 Login con Google
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🔹 Cargar tareas de Firestore (ejemplo: tablero fijo)
  const fetchTasks = async () => {
    if (!user) return;

    // ⚠️ Reemplaza con tu ID real del tablero en Firestore
    const boardId = "srL1tmQbiE20le3sZuzA";

    const querySnap = await getDocs(collection(db, "tableros", boardId, "tareas"));
    const data = querySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTasks(data);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tablero de tareas</h1>

      {!user ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Iniciar sesión con Google
        </button>
      ) : (
        <div className="mb-4">
          <p className="mb-2">Hola, {user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {user && (
        <div>
          <button
            onClick={fetchTasks}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Cargar tareas
          </button>

          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="border rounded p-2 bg-white">
                <strong>{t.title}</strong> — {t.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
