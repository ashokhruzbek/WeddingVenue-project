import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`http://localhost:4000/login`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/main-page"), 1000);
      toast.success("Muvaffaqiyatli kirdingiz");
    } catch (err) {
      toast.error(err.response?.data || "Xatolik yuz berdi!");
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
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h1>
              <a href="http://blog.stackfindover.com/" rel="dofollow">
                Wedding Venue
              </a>
            </h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15">
                  Sign in to your account
                </span>
                <form id="stripe-login " onSubmit={handleSubmit}>
                  <div className="field padding-bottom--24">
                    {/* <label htmlFor="text">Username</label> */}
                    <input
                      placeholder="Username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field padding-bottom--24">
                    <div className="grid--50-50">
                      {/* <label htmlFor="password">Password</label> */}
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {/* {error && <p style={{ color: "red", margin: "0 auto" }}>{error}</p>} */}
                  <div className="field padding-bottom--24">
                    <button type="submit"> Continue</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="footer-link padding-top--24">
              <span>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
