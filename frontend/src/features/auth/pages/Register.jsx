import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import "../styles/register.scss";
import {Link, useNavigate} from 'react-router'
import "../../shared/styles/global.scss";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const {handleRegister , loading}= useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

async function handleSubmit(e) {
  e.preventDefault()
  setErrorMessage("")
    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to register. Please try again."
      );
    }
  
}


  return (
    <div className="register-page">
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>

          <FormGroup 
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          placeholder="Username" 
          label="Username :" />

          <FormGroup 
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email" 
          label="Email :" />

          <FormGroup 
          type="password"
          value={password}
          placeholder="Enter Your Password" 
          onChange={(e)=>setPassword(e.target.value)}
          label="Password :" />
          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>Already have an account ? <Link to="/login" >Login User</Link> </p>
      </div>
    </div>
  );
};

export default Register;
