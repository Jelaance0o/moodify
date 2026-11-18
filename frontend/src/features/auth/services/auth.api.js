import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials:true
});
// http://localhost:3000/api/auth/login
export async function login({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      username,
      password,
    });

    console.log("Success:", response.data);

    return response.data;
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Backend message:", error.response?.data);

    throw error;
  }
}
export async function register({username,email , password}){
   const response = await api.post("/api/auth/login/register", {
     email,
     password,
     username,
   });
   
   return response.data
}



export async function getMe(){
   const response = await api.get("/get-me")

   return response.data
}

export async function logout(){
   const response = await api.get("/logout")

   return response.data
}

