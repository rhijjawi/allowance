import "../components/globals.css";
import { Inter, Raleway } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ExpenseCTXProvider } from "@/components/contexts/expenseCTX";
import { FileManagerProvider } from "@/components/contexts/fileManagerCTX";
import Layout from "../components/layout";
import { TransactionHandlerProvider } from "@/components/contexts/transactionHandler";
import { AlertProvider } from "@/components/contexts/alertHandler";
import { ClerkProvider } from "@clerk/nextjs";
import { GuardianOnboardingProvider } from "@/components/contexts/GuardianOnboardingCTX";
import Script from "next/script";
import Head from "next/head";
import { StrictMode, useEffect, useState } from "react";
import { Subtitle } from "@tremor/react";
import { useRouter } from "next/router";
import React from "react";
const raleway = Raleway({ subsets: ["latin"] });

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  const router = useRouter();
  useEffect(() => {
    if (typeof localStorage === "undefined") {
      return;
    }
    if (
      localStorage.getItem("modals") === null ||
      !Array.isArray(JSON.parse(localStorage.getItem("modals")!))
    ) {
      localStorage.setItem("modals", JSON.stringify([]));
    }
  }, []);
  const MemoizedAlertProvider = React.memo(AlertProvider);
  return (
    <>
    <StrictMode>
      <ClerkProvider>
        <MemoizedAlertProvider>
          <ExpenseCTXProvider>
            <FileManagerProvider>
                <TransactionHandlerProvider>
                  <GuardianOnboardingProvider>
                    <Layout>
                      <Head>
                      <title key="main">
                        LogMoney.app | The better money app
                      </title>
                      <meta
                        property="og:title"
                        content="LogMoney.app | The better money app"
                        key="title"
                      />
                      <meta
                        property="og:description"
                        content="Discover LogMoney.app - the smart choice for responsible financial oversight. Discover how students and spenders across the world keep themselves financially accountable."
                        key="description"
                      />
                      <meta
                        property="og:image"
                        content="https://logmoney.app/og.png"
                        key="image"
                      />
                      <meta
                        property="og:url"
                        content="https://logmoney.app"
                        key="url"
                      />
                      <meta property="og:type" content="website" key="type" />
                      <meta
                        property="og:site_name"
                        content="LogMoney"
                        key="site_name"
                      />
                      {router.asPath !== "/" && (
                        <meta name="robots" content="noindex" />
                      )}
                      <meta
                        name="description"
                        content="Discover LogMoney.app - the smart choice for responsible financial oversight. Discover how students and spenders across the world keep themselves financially accountable."
                      />

                      <meta
                        property="og:description"
                        content="Discover LogMoney.app - the smart choice for responsible financial oversight. Discover how students and spenders across the world keep themselves financially accountable."
                      />

                      <meta name="twitter:card" content="summary_large_image" />
                      <meta property="twitter:domain" content="logmoney.app" />
                      <meta
                        property="twitter:url"
                        content="https://logmoney.app"
                      />
                      <meta
                        name="twitter:title"
                        content="LogMoney.app | The better money app"
                      />
                      <meta
                        name="twitter:description"
                        content="Discover LogMoney.app - the smart choice for responsible financial oversight. Discover how students and spenders across the world keep themselves financially accountable."
                      />
                      <meta
                        name="twitter:image"
                        content="https://logmoney.app/og.png"
                      />
                    </Head>
                    <Script src="https://simple.logmoney.app/latest.js" />
                    <noscript>
                      {/* eslint-disable @next/next/no-img-element */}
                      <img
                        src="https://simple.logmoney.app/noscript.gif"
                        alt=""
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </noscript>

                    <div className={raleway.className}>
                      <Component {...pageProps} />
                    </div>
                  </Layout>
                </GuardianOnboardingProvider>
                </TransactionHandlerProvider>
            </FileManagerProvider>
          </ExpenseCTXProvider>
        </MemoizedAlertProvider>
      </ClerkProvider>
      </StrictMode>
    </>
  );
}
