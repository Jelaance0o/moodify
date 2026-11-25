import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register , logout, getMe } from "../services/auth.api";


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    
    const {loading, setLoading , user , setUser} = context

    async function handleRegister({email, username , password}){
        const data = await register({email, username , password})
        setUser(data.user)
        return true
    }
    async function handleLogin({email, username , password}){
        const data = await login({email, username , password})
        setUser(data.user)
    }
    useEffect(() => {
        setLoading(true)
        getMe().then(
            (data) => setUser(data.user),
            (error) => {
                if (error.response?.status === 401) {
                    setUser(null)
                } else {
                    console.error("Unable to load the current user", error)
                }
            },
        ).finally(() => setLoading(false))
    }, [setLoading, setUser])

    async function handleLogout(){
        const data = await logout()
        setUser(data.user)
    }


    return {handleLogin , handleLogout, handleRegister, loading, user}
}