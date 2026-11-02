import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';

const App = lazy(() => import('@/App'));

const route = createBrowserRouter([{ path: '/', element: <App /> }]);

export const MainRouter = () => {
  return <RouterProvider router={route} />;
};
