"use client"
import { createContext, useReducer, useContext, type ReactNode, type Dispatch, } from "react";

type UserType = {
  id: string;
  role: "ADMIN" | "USER";
  email: string;
  createdAt: Date;
  updatedAt: Date;
  full_name: string;
  phone: string;
};

type AuthState = { 
  user: UserType | null
};

type AuthAction = { type: "LOGIN"; payload: {user: UserType | null} } | { type: "LOGOUT" };

type AuthContextType = {
  userState: AuthState;
  userDispatch: Dispatch<AuthAction>;
};

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":{
      const userInfo = { user: action.payload.user}
      localStorage.setItem('current_user', JSON.stringify(userInfo))
      return userInfo;
    }

    case "LOGOUT":
      localStorage.removeItem('current_user');
      return { user: null };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const currentUser = localStorage.getItem("current_user") ;
  const [userState, userDispatch] = useReducer(AuthReducer, currentUser ? JSON.parse(currentUser) : { user: null } );

  return (
    <AuthContext.Provider value={{ userState, userDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};


