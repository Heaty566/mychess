/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import '../styles/tailwind.css';
import { store } from '../store';

import { apiActions } from '../store/api';
import { Provider } from 'react-redux';
import AutoLoginWrapper from '../common/HOC/autoLoginWrapper';
import { authActions } from '../store/auth';

import Navbar from '../components/navbar';
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
            <div className="flex flex-col min-h-screen bg-gray-700">
                <Navbar />
                <AutoLoginWrapper>
                    <Component {...pageProps} />
                </AutoLoginWrapper>
            </div>
        </Provider>
    );
};

export default App;
