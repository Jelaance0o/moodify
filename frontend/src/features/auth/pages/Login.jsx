import FormGroup from "../components/FormGroup";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router";
import "../styles/login.scss";
import { useAuth } from "../hook/useAuth";
import { useState } from "react";

 const Login = () => {
  const { handleLogin, loading } = useAuth;

  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const handleSubmit = async (e) => {
     e.preventDefault();
     await handleLogin({ email, password });
     navigate("/")
   };

  return (
    <div>
      <div className="login-page">
        <div className="form-container">
          <h1>Login</h1>
          <form>
            <FormGroup
              value={password}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
              label="Email :"
            />

            <FormGroup
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              label="Password :"
            />

            <Button title="Login"></Button>
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
