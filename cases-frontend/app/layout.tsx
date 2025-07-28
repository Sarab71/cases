'use client';
import "./globals.css";
import Header from '@/components/Header';
import Spinner from '@/components/LoadingBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from '@/context/LoadingContext';
import LoadingBar from "@/components/LoadingBar";

function GlobalSpinner() {
  const { loading } = useLoading();
  return loading ? <LoadingBar /> : null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <GlobalSpinner />
          <Header />
          <main className="p-4">
            {children}
          </main>
          <ToastContainer position="top-right" autoClose={1500} />
        </LoadingProvider>
      </body>
    </html>
  );
}
