import '../components/globals.css'
import { Inter, Raleway } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ExpenseCTXProvider } from '@/components/contexts/expenseCTX';
import { FileManagerProvider } from '@/components/contexts/fileManagerCTX';
import Layout from '../components/layout'
import { TransactionHandlerProvider } from '@/components/contexts/transactionHandler';
import { AlertProvider } from '@/components/contexts/alertHandler';
import { ClerkProvider } from '@clerk/nextjs';
import { GuardianOnboardingProvider } from '@/components/contexts/GuardianOnboardingCTX';
import Script from 'next/script';
const raleway = Raleway({ subsets: ['latin'] })


export default function MyApp({Component, pageProps }: {Component: any, pageProps: any}) {
  return (
    <>
      {/* <UserProvider> */}
      <ClerkProvider>
          <ExpenseCTXProvider>
              <FileManagerProvider>
                <TransactionHandlerProvider>
                    <Layout>
                      <AlertProvider>
                        <GuardianOnboardingProvider>
                          <Script src="https://simple.logmoney.app/latest.js"  />
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
                        </GuardianOnboardingProvider>
                      </AlertProvider>
                    </Layout>
                </TransactionHandlerProvider>
              </FileManagerProvider>
          </ExpenseCTXProvider>
      </ClerkProvider>
      {/* </UserProvider> */}
    </>
  )
}
