import Footer from "@/components/Footer/Footer";
import "./globals.css";
import ReduxProvider from "@/lib/reduxProvider";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "GameStart",
  description: "Welcome to GameStart",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="antialiased bg-midnight">
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
