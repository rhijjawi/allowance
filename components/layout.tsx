
import Footer from './Footer'
import Header from './ui/headers/Header'
 
export default function Layout({ children } : any) {
  return (
    <>
      <link rel="shortcut icon" href="/favicon.ico" />
      <Header />
      {/* <main className='flex min-h-screen flex-col items-center justify-between p-24 -z-[100]'>{children}</main> */}
        {children}
      <Footer />
    </>
  )
}