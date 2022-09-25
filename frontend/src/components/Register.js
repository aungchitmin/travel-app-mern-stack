import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import axios from "axios";

function Register({setShowRegister}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newUser = {
        username:nameRef.current.value,
        email:emailRef.current.value,
        password:passwordRef.current.value,
    }

    try {
        await axios.post("/users/register", newUser)
        setError(false)
        setSuccess(true)
    } catch (error) {
        setError(true)
    }
  }
  return (
    <div className="registerContainer">
      <div className="logo">
        <FontAwesomeIcon icon={faLocationDot} />
        Travel Planner
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef}/>
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">Successful. You can login now!</span>
        )}{" "}
        {error && <span className="error">Something went wrong!</span>}
      </form>
      <FontAwesomeIcon icon={faXmark} onClick={() => setShowRegister(false)} className="registerCancel"/>
    </div>
  );
}

export default Register;
