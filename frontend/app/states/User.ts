"use client";
import { atom, selector } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    name: "",
    email: "",
  },
});

export const isLoggedInState = selector({
  key: "isLoggedInState",
  get: ({ get }) => {
    const user = get(userState);
    return !!user.email;
  },
});

export const userNameState = selector({
  key: "userNameState",
  get: ({ get }) => {
    const user = get(userState);
    return user.name;
  },
});

export const userEmailState = selector({
  key: "userEmailState",
  get: ({ get }) => {
    const user = get(userState);
    return user.email;
  },
});
