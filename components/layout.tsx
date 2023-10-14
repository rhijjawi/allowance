
import Header from './Header'
 
export default function Layout({ children } : any) {
  return (
    <>
      <Header />
      {/* <main className='flex min-h-screen flex-col items-center justify-between p-24 -z-[100]'>{children}</main> */}
      {children}
    </>
  )
}