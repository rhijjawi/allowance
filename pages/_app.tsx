import '../components/globals.css'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ExpenseCTXProvider } from '@/components/contexts/expenseCTX';
import { FileManagerProvider } from '@/components/contexts/fileManagerCTX';
import Layout from '../components/layout'
import { TransactionHandlerProvider } from '@/components/contexts/transactionHandler';
import { AlertProvider } from '@/components/contexts/alertHandler';
import { ClerkProvider } from '@clerk/nextjs';
const inter = Inter({ subsets: ['latin'] })

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
                      <Component {...pageProps} />
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
