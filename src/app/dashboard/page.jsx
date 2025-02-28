"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetch("/api/v1/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!", { position: "top-right" });
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Dashboard</h2>
        {user ? (
          <>
            <p className="text-lg font-semibold text-gray-600">
              Welcome, {user.name}
            </p>
            <p className="text-lg font-semibold text-gray-600">{user.email}</p>
            <button
              onClick={logout}
              className="mt-6 w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
