import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";
import Navbar from "~/components/Navbar";

import "~/styles/globals.css";

import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';

import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import { Toaster } from 'react-hot-toast';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <div className={GeistSans.className}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </div>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
