import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Accounts = lazy(() => import('@/pages/Accounts'));
const AccountDetail = lazy(() => import('@/pages/AccountDetail'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const BestSellers = lazy(() => import('@/pages/BestSellers'));

const route = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/accounts', element: <Accounts /> },
  { path: '/accounts/:id', element: <AccountDetail /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/best-sellers', element: <BestSellers /> },
  { path: '*', element: <div>404</div> },
]);

export const MainRouter = () => {
  return <RouterProvider router={route} />;
};
