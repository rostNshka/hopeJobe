import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { observer } from 'mobx-react-lite'

import Vacancies from '@/pages/Vacancies/Vacancies'
import VacancyDetail from '@/pages/VacancyDetail'
import Favorites from '@/pages/Favorites'
import AddVacancy from '@/pages/AddVacancy'
import MyVacancy from '@/pages/MyVacancy'
import NotFound from '@/pages/NotFound/NotFound'
import Content from '@/layouts/Content'

import ProtectedRoutes from '@/context/ProtectedRoutes.tsx'
import { userStore } from '@/stores/user-store'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Content />,
    children: [
      { index: true, element: <Vacancies /> },
      { path: 'vacancies/:detailId', element: <VacancyDetail /> },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: 'favorites', element: <Favorites /> },
          { path: 'add-vacancy', element: <AddVacancy /> },
          { path: 'my-vacancy', element: <MyVacancy /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

const App: React.FC = observer(() => {
  if (userStore.loading) {
    return <div>Загрузка...</div>
  }

  return <RouterProvider router={router} />
})

export default App
