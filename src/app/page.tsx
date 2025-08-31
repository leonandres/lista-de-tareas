"use client";

import { useEffect, useState } from "react";
import { auth, googleProvider, db } from "@/lib/firebaseClient";
import { signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

type Task = {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "testing" | "done";
  description?: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const handleLogin = async () => { await signInWithPopup(auth, googleProvider); };
  const handleLogout = async () => { await signOut(auth); };

  const fetchTasks = async () => {
    if (!user) return;
    const boardId = "srL1tmQbiE20le3sZuzA"; // tu ID real
    const snap = await getDocs(collection(db, "tableros", boardId, "tareas"));
    const data: Task[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }));
    setTasks(data);
  };

  return (
    <main className="p-6">
      {!user ? (
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Iniciar sesión</button>
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="border rounded px-3 py-1">Salir</button>
          </div>

          <button onClick={fetchTasks} className="bg-green-600 text-white px-4 py-2 rounded">Cargar tareas</button>
          <ul className="mt-4 space-y-2">
            {tasks.map(t => (
              <li key={t.id} className="border rounded p-2 bg-white">
                <strong>{t.title}</strong> — {t.status}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
