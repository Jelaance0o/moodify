import React from "react";
import FormGroup from "../components/FormGroup";
import "../styles/register.scss";
import {Link} from 'react-router'
import "../../shared/styles/global.scss";
import { Button } from "../components/Button";
const Register = () => {
  return (
    <div className="register-page">
      <div className="form-container">
        <h1>Register</h1>
        <form>
          <FormGroup placeholder="Username" label="Username :" />
          <FormGroup placeholder="Email" label="Email :" />
          <FormGroup placeholder="Password" label="Password :" />
          <Button title="Register"></Button>
        </form>
        <p>Already have an account ? <Link to="/login" >Login User</Link> </p>
      </div>
    </div>
  );
};

export default Register;
