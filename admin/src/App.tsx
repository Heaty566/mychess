import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "antd";
import Login from "./login";
import Navbar from "./components/navbar";
import Layout from "antd/lib/layout/layout";

function App() {
        return (
                <Layout>
                        <div className="App">
                                <Navbar />
                                <Login />
                        </div>
                </Layout>
        );
}

export default App;
