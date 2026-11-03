import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Accounts = lazy(() => import('@/pages/Accounts'));
const Inventory = lazy(() => import('@/pages/Inventory'));

const route = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/accounts', element: <Accounts /> },
  { path: '/inventory', element: <Inventory /> },
]);

export const MainRouter = () => {
  return <RouterProvider router={route} />;
};
