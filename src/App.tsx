import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Regitser from './pages/Regitser';
import Login from './pages/Login';

const routes = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },
  { path: 'register', element: <Regitser /> },
  { path: 'login', element: <Login /> },
]);

const App: React.FC = () => {
  return <RouterProvider router={routes} />;
};

export default App;
