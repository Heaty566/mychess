import { useForm } from "react-hook-form";
import Link from "next/link";

import Button from "../../components/button";
import PasswordField from "../../components/form/passwordField";
import TextField from "../../components/form/textField";
import LoginSocial from "../../components/loginSocial";

export interface LoginFormProps {}

export interface LoginProps {
        username: string;
        password: string;
}

const LoginForm: React.FunctionComponent<LoginFormProps> = () => {
        const { register, handleSubmit } = useForm<LoginProps>({
                defaultValues: {
                        username: "",
                        password: "",
                },
        });

        const onSubmit = (data) => {
                console.log(data);
        };

        return (
                <div className="bg__form">
                        <div className="w-352 bg-gray-600 py-16 px-8 flex flex-col justify-center rounded">
                                <form className="flex flex-col justify-center mb-4" onSubmit={handleSubmit(onSubmit)}>
                                        <h1 className="text-4xl text-gray-50 font-bold mb-4 text-center">Sign In</h1>
                                        <TextField label="Username" name="username" register={register} />
                                        <PasswordField label="Password" name="password" register={register} />
                                        <Link href="#">
                                                <a href="#" className="text-right text-white hover:text-blue-200 mb-4">
                                                        Forgot Your Password
                                                </a>
                                        </Link>
                                        <Button type="submit" label="Login" />
                                </form>
                                <LoginSocial />
                                <div className="w-full text-center">
                                        <p className="text-xs text-coolGray-300">
                                                Want to have a MyGame account?
                                                <a className="text-xs text-white hover:text-blue-200 font-medium" href="#">
                                                        {" "}
                                                        Sign Up Here
                                                </a>
                                        </p>
                                </div>
                        </div>
                </div>
        );
};

export default LoginForm;
