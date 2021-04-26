import './App.css';
import React from 'react';
import Login from './containers/login';
import Register from './containers/register';
import Navbar from './components/navbar';
import Layout from 'antd/lib/layout/layout';
import Cookies from 'universal-cookie';

import { Route, Switch } from 'react-router-dom';

function App() {
    React.useEffect(() => {
        const cookies = new Cookies();
        cookies.get('re-token');
    }, []);
    return (
        <div className="App h-screen ">
            <Layout className="h-full">
                <Navbar />
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                </Switch>
            </Layout>
        </div>
    );
}

export default App;
