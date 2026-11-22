import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate , Navigate } from 'react-router'
import { useEffect } from 'react'
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity";


const Protected = ({children}) => {

    const {user , loading} = useAuth()
    const navigate = useNavigate()

    
           if (loading) {
             return (
               <UseAnimations className="loading" animation={infinity} size={80}/>
             );
           }

    if(!user){
      return <Navigate to={"/login"}/>
    }

  return children
}

export default Protected
