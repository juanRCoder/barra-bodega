import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';

const App = lazy(() => import('@/App'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const route = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/dashboard', element: <Dashboard /> }
]);

export const MainRouter = () => {
  return <RouterProvider router={route} />;
};
