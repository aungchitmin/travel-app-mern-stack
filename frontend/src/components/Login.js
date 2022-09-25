import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";

function Login({setShowLogin, myStorage, setCurrentUser}) {
  const [error, setError] = useState(false);
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = {
        username:nameRef.current.value,
        password:passwordRef.current.value,
    }

    try {
        const res = await axios.post("/users/login", user)
        myStorage.setItem('user', res.data.username )
        setCurrentUser(res.data.username)
        setShowLogin(false)
        setError(false)
        
    } catch (error) {
        setError(true)
    }
  }
  return (
    <div className="loginContainer">
      <div className="logo">
        <FontAwesomeIcon icon={faLocationDot} />
        Travel Planner
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className="loginBtn">Login</button>
        
        {error && <span className="error">Something went wrong!</span>}
      </form>
      <FontAwesomeIcon icon={faXmark} onClick={() => setShowLogin(false)} className="loginCancel"/>
    </div>
  );
}

export default Login;
