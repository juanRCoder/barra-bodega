import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const BestSellers = lazy(() => import('@/pages/BestSellers'));
const Accounts = lazy(() => import('@/pages/Accounts'));
const AccountDetail = lazy(() => import('@/pages/AccountDetail'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const ScanNewProduct = lazy(() => import('@/pages/ScanNewProduct'));
const ScanNewOrder = lazy(() => import('@/pages/ScanNewOrder'));
const Register = lazy(() => import('@/pages/Register'));
const Login = lazy(() => import('@/pages/Login'));

const route = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/best-sellers', element: <BestSellers /> },
  { path: '/accounts', element: <Accounts /> },
  { path: '/accounts/:id', element: <AccountDetail /> },
  { path: '/inventory', element: <Inventory /> },
  { path: '/scan/product', element: <ScanNewProduct /> },
  { path: '/scan/new-order', element: <ScanNewOrder /> },
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/login', element: <Login /> },
  { path: '*', element: <div>404</div> },
]);

export const MainRouter = () => {
  return <RouterProvider router={route} />;
};
