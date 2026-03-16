import Header from '@/layouts/Header'
import { Outlet } from 'react-router-dom'
import Footer from '@/layouts/Footer'

const Content = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Content
