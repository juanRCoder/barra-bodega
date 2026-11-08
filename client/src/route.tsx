import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/auth/ProtectedRoute';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const BestSellers = lazy(() => import('@/pages/BestSellers'));
const Accounts = lazy(() => import('@/pages/Accounts'));
const AccountDetail = lazy(() => import('@/pages/AccountDetail'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const ScanNewProduct = lazy(() => import('@/pages/ScanNewProduct'));
const ScanNewOrder = lazy(() => import('@/pages/ScanNewOrder'));
const Register = lazy(() => import('@/pages/Register'));
const Login = lazy(() => import('@/pages/Login'));

const protect = (page: ReactNode) => <ProtectedRoute>{page}</ProtectedRoute>;

const route = createBrowserRouter([
  { path: '/', element: protect(<Dashboard />) },
  { path: '/best-sellers', element: protect(<BestSellers />) },
  { path: '/accounts', element: protect(<Accounts />) },
  { path: '/accounts/:id', element: protect(<AccountDetail />) },
  { path: '/inventory', element: protect(<Inventory />) },
  { path: '/scan/product', element: protect(<ScanNewProduct />) },
  { path: '/scan/new-order', element: protect(<ScanNewOrder />) },
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/login', element: <Login /> },
  { path: '*', element: <div>404</div> },
]);

export const MainRouter = () => {
  return <RouterProvider router={route} />;
};
