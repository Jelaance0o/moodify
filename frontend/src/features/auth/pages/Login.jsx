import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import "../styles/login.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/auth.api";


const Login = () => {
  const { handleLogin, loading } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const submitHandler = async (e) => {
     e.preventDefault();

     await login(email, password);
   }; 



  return (
    <div>
      <div className="login-page">
        <div className="form-container">
          <h1>Login</h1>
          <form onSubmit={submitHandler}>

            <FormGroup
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            value={email}
            placeholder="Email"
            label="Email :"
            />

            <FormGroup
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            value={password}
              placeholder="Password"
              label="Password :"
            />

            <button className="button">Login</button>
          </form>
          <p>
            Don't have a account ? <Link to="/Register">Register User</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
