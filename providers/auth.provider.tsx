"use client";
import * as React from "react";
export const AuthContext = React.createContext<any>(null);
export function AuthProvider({children}:{children:React.ReactNode}){ return <AuthContext.Provider value={null}>{children}</AuthContext.Provider> }
export default AuthProvider;
