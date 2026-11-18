import React from 'react'
import FaceExpression from './features/Expression/components/FaceExpression'
import { RouterProvider } from 'react-router'
import "../src/features/shared/styles/global.scss"
import { router } from './app.routes'
import { AuthProvider } from './features/auth/auth.context'


const App = () => {
  return (
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  
  )
}
export default App
