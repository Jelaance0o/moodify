import { createBrowserRouter } from "react-router"
import Login from "./src/features/auth/pages/Login"
import Register from "./src/features/auth/pages/Register"

export const router = createBrowserRouter([

    {
        path: "/",
        element : <h1>Home Page</h1>
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    },

])
