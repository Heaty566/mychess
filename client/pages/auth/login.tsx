import * as React from 'react';
import SeoHead from '../../components/common/seoHead';
import TextField from '../../components/form/textField';
import SideLink from '../../components/link/sidelink';
import routers from '../../common/constants/router';
import BtnForm from '../../components/btn/btnForm';
import LoginSocial from '../../components/form/loginSocial';

export interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = () => {
        React.useEffect(() => {
                console.log(process.env.SERVER_URL);
        });

        return (
                <>
                        <SeoHead title="Login" description="he" canonical="/" />
                        <div className="flex-1 chess-bg grid place-items-center grid-rows-max shadow-sm">
                                <form className="bg-gray-800 px-4 md:px-10 py-12 w-full max-w-md rounded-sm ">
                                        <h1 className="text-center text-4xl text-white mb-7">
                                                SIGN IN
                                        </h1>
                                        <div className="space-y-2">
                                                <TextField
                                                        name="username"
                                                        label="Username"
                                                        error=""
                                                />
                                                <TextField
                                                        name="password"
                                                        label="Password"
                                                        error=""
                                                />
                                        </div>
                                        <div className="mt-4 mb-7">
                                                <SideLink
                                                        label="Sign Up Instead"
                                                        position="text-right"
                                                        href={routers.register.link}
                                                />
                                        </div>
                                        <BtnForm label="Sign In" />
                                        <p className="text-center my-4 text-mercury">
                                                Or continue with
                                        </p>
                                        <LoginSocial />
                                </form>
                        </div>
                </>
        );
};
export default Home;
