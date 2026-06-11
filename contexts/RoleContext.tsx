"use client"

import { createContext, useReducer, useContext, type ReactNode, type Dispatch, } from "react";


type RoleState = {
    role: 'SELLER' | 'BUYER';
}

type RoleAction =
  | { type: "SWITCH_ROLE"; payload: 'SELLER' | 'BUYER'}

type RoleContextType = {
  roleState: RoleState;
  roleDispatch: Dispatch<RoleAction>;
};

const RoleReducer = (state: RoleState, action: RoleAction): RoleState => {
    
  switch (action.type) {
    case "SWITCH_ROLE":{
      if (state.role === action.payload) return state
      typeof window !== "undefined" && window.localStorage.setItem("role", JSON.stringify({ role: action.payload }))
      return { ...state, role: action.payload }
    }
    
    default:
      return state;
  }
};

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleContextProvider = ({ children }: { children: ReactNode }) => {
  const currentRole = typeof window !== "undefined" && window.localStorage.getItem("role") ;
  const [roleState, roleDispatch] = useReducer(RoleReducer, currentRole ? JSON.parse(currentRole) : { role: 'BUYER' } );

  return (
    <RoleContext.Provider value={{ roleState, roleDispatch }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleContextProvider");
  }
  return context;
};


// Update sidebar links to seller specific links and create the logic so that when a user routes to an alternate role