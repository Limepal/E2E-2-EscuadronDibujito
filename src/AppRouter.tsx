


import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import { StrictMode } from 'react'

const router = createBrowserRouter([
{
    path: "/login",
    element: <LoginPage />

},
{
    path: "/register",
    element: <RegisterPage />

},
{
    path: "/",
    element: <LoginPage />

},



])

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)