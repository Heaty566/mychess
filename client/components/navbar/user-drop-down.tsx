import Link from 'next/link';
import * as React from 'react';

import router from '../../common/constants/router';
import { AuthState } from '../../common/interface/user.interface';

export interface UserDropDownProps {
    authState: AuthState;
    handleLogoutUser: () => void;
    reference?: React.RefObject<HTMLUListElement>;
}

const UserDropDown: React.FunctionComponent<UserDropDownProps> = ({ authState, handleLogoutUser, reference }) => {
    return (
        <ul className="bg-woodsmoke" ref={reference}>
            <li>
                <Link href={`${router.userProfile.link}/${authState.id}`}>
                    <a className="block w-full px-4 py-2 capitalize duration-300 cursor-pointer focus:outline-none hover:bg-woodsmoke-400">Profile</a>
                </Link>
            </li>

            <li>
                <button
                    type="button"
                    onClick={handleLogoutUser}
                    className="w-full px-4 py-2 capitalize duration-300 cursor-pointer focus:outline-none hover:bg-woodsmoke-400"
                >
                    Logout
                </button>
            </li>
        </ul>
    );
};

export default UserDropDown;
