"use client";
import React, { ReactNode, createContext, useState } from "react";

type Props = {
  children: ReactNode;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
