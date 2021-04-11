import Link from 'next/link';
import * as React from 'react';
import router from '../../../common/constants/router';
import { IAuthState } from '../../../store/auth/interface';

export interface UserDropDownProps {
    authState: IAuthState;
    handleLogoutUser: () => void;
}

const UserDropDown: React.FunctionComponent<UserDropDownProps> = ({ authState, handleLogoutUser }) => {
    return (
        <ul className="bg-woodsmoke">
            <li>
                <Link href={`${router.userProfile.link}/${authState.id}`}>
                    <a className="block w-full px-4 py-2 capitalize duration-300 cursor-pointer focus:outline-none hover:bg-woodsmoke-400">Profile</a>
                </Link>
            </li>

            <li>
                <button
                    type="button"
                    onClick={() => handleLogoutUser()}
                    className="w-full px-4 py-2 capitalize duration-300 cursor-pointer focus:outline-none hover:bg-woodsmoke-400"
                >
                    Logout
                </button>
            </li>
        </ul>
    );
};

export default UserDropDown;
