import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function Login() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Form validation (ixtiyoriy)
  if (!firstname || !lastname || !username || !password) {
    toast.error("Iltimos, barcha maydonlarni to‘ldiring.");
    return;
  }

  const formData = new FormData();
  formData.append("firstname", firstname);
  formData.append("lastname", lastname);
  formData.append("username", username);
  formData.append("password", password);

  try {
    await axios.post("http://localhost:4000/signup", formData);
    toast.success("Ro'yxatdan o'tdingiz! Endi tizimga kiring.");
    setTimeout(() => navigate("/"), 1000); 
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Xatolik yuz berdi!");
  }
};



  return (
    <div className="login-root">
      <div
        className="box-root flex-flex flex-direction--column"
        style={{ minHeight: "100vh", flexGrow: 1 }}
      >
        <div className="loginbackground box-background--white padding-top--64">
          <div className="loginbackground-gridContainer">
            <div
              className="box-root flex-flex"
              style={{ gridArea: "top / start / 8 / end" }}
            >
              <div
                className="box-root"
                style={{
                  backgroundImage:
                    "linear-gradient(white 0%, rgb(247, 250, 252) 33%)",
                  flexGrow: 1,
                }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "4 / 2 / auto / 5" }}
            >
              <div
                className="box-root box-divider--light-all-2 animationLeftRight tans3s"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "6 / start / auto / 2" }}
            >
              <div
                className="box-root box-background--blue800"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "7 / start / auto / 4" }}
            >
              <div
                className="box-root box-background--blue animationLeftRight"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "8 / 4 / auto / 6" }}
            >
              <div
                className="box-root box-background--gray100 animationLeftRight tans3s"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "2 / 15 / auto / end" }}
            >
              <div
                className="box-root box-background--cyan200 animationRightLeft tans4s"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "3 / 14 / auto / end" }}
            >
              <div
                className="box-root box-background--blue animationRightLeft"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "4 / 17 / auto / 20" }}
            >
              <div
                className="box-root box-background--gray100 animationRightLeft tans4s"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
            <div
              className="box-root flex-flex"
              style={{ gridArea: "5 / 14 / auto / 17" }}
            >
              <div
                className="box-root box-divider--light-all-2 animationRightLeft tans3s"
                style={{ flexGrow: 1 }}
              ></div>
            </div>
          </div>
        </div>

        <div
          className="box-root padding-top--24 flex-flex flex-direction--column"
          style={{ flexGrow: 1, zIndex: 9 }}
        >
          <div className="box-root padding-top--12 padding-bottom--12 flex-flex flex-justifyContent--center">
            <h1>
              <a href="http://blog.stackfindover.com/" rel="dofollow">
                Wedding Venue
              </a>
            </h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15">Sign Up your account</span>
                <form id="stripe-login" onSubmit={handleSubmit}>
                  <div className="field padding-bottom--24">
                    {/* <label htmlFor="text">Firstname</label> */}
                    <input
                      type="text"
                      placeholder="Firstname"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    {/* <label htmlFor="text">Lastname</label> */}
                    <input
                      type="text"
                      placeholder="Lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    {/* <label htmlFor="text">Username</label> */}
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <div className="grid--50-50">
                      {/* <label htmlFor="password">Password</label> */}
                    </div>
                    <input type="password" placeholder="Password" 
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />
                  </div>
                  <div className="field padding-bottom--22">
                    <button type="submit" onClick={handleSubmit} >Sign Up</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="footer-link padding-top--22">
              <span>
                Already have an account? <Link to="/">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
