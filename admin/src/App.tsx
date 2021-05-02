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

import { Redirect, Route, Switch } from 'react-router-dom';
import Admin from './containers/admin';
import RouterHOC from './HOC/routerHOC';
import AuthRouter from './HOC/authRouter';

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
                    <AuthRouter path={'/login'} Component={Login} />
                    <AuthRouter path={'/register'} Component={Register} />
                    <RouterHOC path="/information" Component={Information} redirectTo="./login" />
                    <RouterHOC path="/admin" Component={Admin} redirectTo="./login" role="ADMIN" />
                </Switch>
            </Layout>
        </div>
    );
}

export default App;
