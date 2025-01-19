"use client";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState, userState } from "./states/User";
import LoginSignup from "./components/LoginSignup";
import TodoList from "./components/TodoList";
import WebSocket from "@/app/socket/Socket";
import Header from "./components/Header";

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
