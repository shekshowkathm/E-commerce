import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import NotFound from "./components/NotFound";
import CartPage from "./components/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFound />,
  },
  {
    path: "/cart",
    element: <CartPage />,
    
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
