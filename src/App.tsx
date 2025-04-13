import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Regitser from './pages/Regitser';
import Login from './pages/Login';
import TodoList from './pages/TodoList';
import ProtectedRoute from './components/ProtectedRoute';

const routes = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { 
        path: '', 
        element: <ProtectedRoute><Home /></ProtectedRoute> 
      },
      { 
        path: 'home', 
        element: <ProtectedRoute><Home /></ProtectedRoute> 
      },
      { path: 'register', element: <Regitser /> },
      { path: 'login', element: <Login /> },
      { 
        path: 'todo/:id', 
        element: <ProtectedRoute><TodoList /></ProtectedRoute> 
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
