import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import Content from '@/layouts/Content'

const Vacancies = lazy(() => import('@/pages/Vacancies/Vacancies'))
const VacancyDetail = lazy(() => import('@/pages/VacancyDetail'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const AddVacancy = lazy(() => import('@/pages/AddVacancy'))
const MyVacancy = lazy(() => import('@/pages/MyVacancy'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))

import ProtectedRoutes from '@/context/ProtectedRoutes.tsx'
import { userStore } from '@/stores/user-store'

import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SpinLoading from './components/SpinLoading'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Content />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SpinLoading />}>
            <Vacancies />
          </Suspense>
        ),
      },
      {
        path: 'vacancies/:detailId',
        element: (
          <Suspense fallback={<SpinLoading />}>
            <VacancyDetail />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: 'favorites',
            element: (
              <Suspense fallback={<SpinLoading />}>
                <Favorites />
              </Suspense>
            ),
          },
          {
            path: 'add-vacancy',
            element: (
              <Suspense fallback={<SpinLoading />}>
                <AddVacancy />
              </Suspense>
            ),
          },
          {
            path: 'my-vacancy',
            element: (
              <Suspense fallback={<SpinLoading />}>
                <MyVacancy />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<SpinLoading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
])

const App: React.FC = observer(() => {
  if (userStore.loading) {
    return <SpinLoading />
  }

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <RouterProvider router={router} />
    </SkeletonTheme>
  )
})

export default App
