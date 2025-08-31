"use client";

import { useEffect, useState } from "react";
import { db, auth, googleProvider } from "@/lib/firebaseClient";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  // 🔹 escuchar login/logout
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // 🔹 login con Google
  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  // 🔹 logout
  const logout = async () => {
    await signOut(auth);
  };

  // 🔹 leer tareas desde Firestore
  const fetchTasks = async () => {
    if (!user) return;

    const boardId = "srL1tmQbiE20le3sZuzA"; // ⚠️ poné tu tablero real
    const snap = await getDocs(collection(db, "tableros", boardId, "tareas"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log("Tareas:", data); // 👈 log para verificar
    setTasks(data);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prueba Firestore</h1>

      {!user ? (
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Iniciar sesión con Google
        </button>
      ) : (
        <div className="mb-4">
          <p>Hola {user.email}</p>
          <button onClick={logout} className="bg-gray-600 text-white px-3 py-1 rounded">
            Cerrar sesión
          </button>
        </div>
      )}

      {user && (
        <>
          <button onClick={fetchTasks} className="bg-green-600 text-white px-4 py-2 rounded">
            Cargar tareas
          </button>

          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="border rounded p-2">
                <strong>{t.title}</strong> — {t.status}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
