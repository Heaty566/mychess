import * as React from 'react';
import BtnLink from '../components/link/btnLink';
import router from '../common/constants/router';

const NotFound: React.FunctionComponent = () => {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-8">
                <div className=" space-y-2">
                    <h1 className="text-9xl text-white">404</h1>
                    <h3 className="text-7xl text-mercury-700">Whoops!</h3>
                    <p className="text-2xl text-mercury-700">The page you were looking for doesn’t exist</p>
                </div>
                <BtnLink label="Back To Home" href={router.home.link} />
            </div>
        </div>
    );
};

export default NotFound;
