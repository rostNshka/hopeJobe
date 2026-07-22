import Header from '@/layouts/Header'
import { Outlet } from 'react-router-dom'
import Footer from '@/layouts/Footer'
import Toast from '@/components/Toast'

const Content = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  )
}

export default Content
