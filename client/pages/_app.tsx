/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';

import '../styles/tailwind.css';

//* Import
import Navbar from '../components/navbar';
import AutoLogin from '../common/HOC/autoLogin';
import { store } from '../store';
import { apiActions } from '../store/api';
import { Provider } from 'react-redux';
import { authActions } from '../store/auth';

export interface AppProps {
    Component: React.FunctionComponent;
    pageProps: any;
}

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
    const cookies = new Cookies();

    useEffect(() => {
        const reToken = cookies.get('re-token');
        if (reToken) store.dispatch(authActions.updateLogin());
    }, []);

    useEffect(() => {
        store.dispatch(apiActions.resetState());
    }, [Component]);

    return (
        <Provider store={store}>
            <div className="min-h-screen flex flex-col bg-gray-700">
                <Navbar />
                <AutoLogin Component={Component} props={pageProps} />
            </div>
        </Provider>
    );
};

export default App;
