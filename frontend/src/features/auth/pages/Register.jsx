import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import "../styles/register.scss";
import { Link, useNavigate } from "react-router";
import "../../shared/styles/global.scss";
import { useAuth } from "../hooks/useAuth";


const Register = () => {
  const {handleLogin , loading} = useAuth()
  const [email, setEmail] = useState(null)
  const [password, setpassword] = useState(null)



  return (
    <div className="register-page">
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

          <FormGroup
            type="email"
           
            placeholder="Email"
            label="Email :"
          />

          <FormGroup
            type="password"
            placeholder="Enter Your Password"
            label="Password :"
          />

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account ? <Link to="/login">Login User</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
