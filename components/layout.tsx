import Footer from './Footer'
import Header from './ui/headers/Header'
 
export default function Layout({ children } : any) {
  return (
    <>
      <link rel="shortcut icon" href="/favicon.ico" />
      <Header />
        {children}
      <Footer />
    </>
  )
}