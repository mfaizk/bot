"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="764424849033-i0p8p198gd45esi1fb16tnm255qekjma.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
