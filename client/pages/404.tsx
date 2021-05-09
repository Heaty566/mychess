import * as React from 'react';

import BtnLink from '../components/btn/btn-link';
import SeoHead from '../components/common/seoHead';
import routers from '../common/constants/router';

const NotFound: React.FunctionComponent = () => {
    return (
        <>
            <SeoHead {...routers[404].header} />
            <div className="flex items-center justify-center flex-1">
                <div className="space-y-8 text-center">
                    <div className="space-y-2 ">
                        <h1 className="text-white text-9xl">404</h1>
                        <h3 className="text-7xl text-mercury-700">Whoops!</h3>
                        <p className="text-2xl text-mercury-700">The page you were looking for doesn’t exist</p>
                    </div>
                    <BtnLink label="Back To Home" href={routers.home.link} />
                </div>
            </div>
        </>
    );
};

export default NotFound;
