import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register , logout, getMe } from "../services/auth.api";


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    
    const {loading, setLoading , user , setUser} = context

    async function handleRegister({email, username , password}){
        setLoading(true)
        const data = await register({email, username , password})
        setUser(data.user)
        setLoading(false)
    }
    async function handleLogin({email, username , password}){
        setLoading(true)
        const data = await login({email, username , password})
        setUser(data.user)
        setLoading(false)
    }
    async function handleGetme(){
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }
    async function handleLogout(){
        setLoading(true)
        const data = await logout()
        setUser(data.user)
        setLoading(false)
    }

    useEffect(() => {
      handleGetme()
    }, [])
    

    return {handleLogin , handleLogout , handleGetme, handleRegister , loading, user}
}