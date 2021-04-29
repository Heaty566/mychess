import './App.css';
import React from 'react';
import Login from './containers/login';
import Register from './containers/register';
import Information from './containers/information';
import Navbar from './components/navbar';
import Layout from 'antd/lib/layout/layout';

import { useSelector } from 'react-redux';
import { IAuthState } from './store/auth/dto';
import { store, RootState } from './store';

import { getUserInfo } from './store/auth/action';

import { Route, Switch } from 'react-router-dom';
import RouterHOC from './HOC/routerHOC';

function App() {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);
    React.useEffect(() => {
        store.dispatch(getUserInfo());
    }, [authState.isLogin]);
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
                    <Route path="/information">
                        <Information />
                    </Route>
                </Switch>
            </Layout>
        </div>
    );
}

export default App;
