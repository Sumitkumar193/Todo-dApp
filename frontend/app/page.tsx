"use client";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState, userState } from "./states/User";
import LoginSignup from "./components/LoginSignup";
import TodoList from "./components/TodoList";
import WebSocket from "@/app/socket/Socket";
import Header from "./components/Header";
import toast from "react-hot-toast";

export default function Home() {
  const [user, setUser] = useRecoilState(userState);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  useEffect(() => {
    WebSocket.init();
    WebSocket.emit("identify");

    WebSocket.on("identified", (data: { name: string; email: string }) => {
      if (!user.email) {
        setUser({ name: data.name, email: data.email });
      }
    });

    WebSocket.on("notification", (data: { message: string, type?: string }) => {
      if (data.type === "error") {
        toast.error(data.message);
      }
      if (data.type === "success") {
        toast.success(data.message);
      }
    })
  }, [WebSocket]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoggedIn ? (
        <div className="container mx-auto max-w-[80%]">
          <LoginSignup />
        </div>
      ) : (
        <>
          <Header />
          <TodoList />
        </>
      )}
    </div>
  );
}
