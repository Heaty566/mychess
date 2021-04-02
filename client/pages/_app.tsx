/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Provider } from 'react-redux';
import '../styles/tailwind.css';

//* Import
import { store } from '../store';
import { apiActions } from '../store/api';
import Navbar from '../components/navbar';

export interface AppProps {
        Component: React.FunctionComponent;
        pageProps: any;
}

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
        const cookies = new Cookies();
        const reToken = cookies.get('re-token');

        useEffect(() => {}, []);

        useEffect(() => {
                store.dispatch(apiActions.resetState());
        }, [Component]);

        useEffect(() => {}, [reToken]);

        return (
                <Provider store={store}>
                        <div className="h-screen flex flex-col  bg-gray-700">
                                <Navbar />
                                <Component {...pageProps} />
                        </div>
                </Provider>
        );
};

export default App;
