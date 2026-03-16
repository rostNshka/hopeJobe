import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Vacancies from '@/pages/Vacancies'
import VacancyDetail from '@/pages/VacancyDetail'
import Favorites from '@/pages/Favorites'
import AddVacancy from '@/pages/AddVacancy'
import NotFound from '@/pages/NotFound'
import Content from '@/layouts/Content'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Content />,
    children: [
      { index: true, element: <Vacancies /> },
      { path: 'vacancies/:detailId', element: <VacancyDetail /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'add-vacancy', element: <AddVacancy /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
