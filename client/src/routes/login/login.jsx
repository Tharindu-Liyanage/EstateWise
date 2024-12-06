import "./login.scss";
import React, {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {

  
const {updateUser} = useContext(AuthContext);

  const [err,setErr] = React.useState("");
  const [load,setLoad] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e)=>{

    e.preventDefault();
    setLoad(true);
    setErr("");

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");


    try{

      const res = await apiRequest.post("/auth/login", {
        username,
        password
      });

      updateUser(res.data);
    
      navigate("/profile");
    } catch(err){
      setErr(err.response?.data?.message);
      console.log(err);
    } finally{
      setLoad(false);
    }



  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required type="text" placeholder="Username" />
          <input name="password" required type="password" placeholder="Password" />
          <button disabled={load}>Login</button>
          {err && <span>{err}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
