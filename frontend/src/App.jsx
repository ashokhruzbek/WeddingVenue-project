import React from "react";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Toast from "./pages/Toast";
import { Toaster } from "react-hot-toast";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/main-page" element={<MainPage/>}></Route>
        <Route path="/toast" element={<Toast/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
