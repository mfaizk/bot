import "./globals.css";
import "./index.css";
import { Roboto } from "next/font/google";
import QueryProvider from "../providers/query-provider";
import { Toaster } from "sonner";
import AuthGuard from "../guard/auth-guard";
import GoogleAuthProvider from "../providers/google-auth";
import "react-circular-progressbar/dist/styles.css";
import ClientProvider from "../providers/client-provider";
import "react-datepicker/dist/react-datepicker.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Qbots",
  description:
    "Automated crypto trading bot that runs 24/7, optimizing trades and maximizing profits with smart algorithmic execution.",
  icons: {
    icon: "/favicon.ico", // primary favicon (ico)
    shortcut: "/assets/logo1.png", // used for shortcut icon
    apple: "/assets/logo1.png", // apple touch icon (optional)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      {/* <head>
      <link rel="icon" href="/app/logo1.png" sizes="any" />
      </head> */}
      <body className="antialiased  ">
        <Toaster />
        <QueryProvider>
          <ClientProvider>
            <AuthGuard>
              <GoogleAuthProvider>{children}</GoogleAuthProvider>
            </AuthGuard>
          </ClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
