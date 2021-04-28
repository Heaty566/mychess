import * as React from 'react';
import { Layout, Menu } from 'antd';
import { ReactComponent as NavbarLogoIcons } from '../../asset/icons/navbar-logo-md.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { IAuthState } from '../../store/auth/dto';

const { Header } = Layout;

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
    const authState = useSelector<RootState, IAuthState>((state) => state.auth);

    const logout = () => {
        document.cookie = 're-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.reload();
    };
    return (
        <Header className="header">
            <div className="float-left h-full grid place-items-center mr-4">
                <NavbarLogoIcons />
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                {!authState.isLogin ? (
                    <React.Fragment>
                        <Menu.Item key="1">
                            <Link to="/login">Login</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/register">Register</Link>
                        </Menu.Item>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Menu.Item key="3">{`Hello ${authState.name}`}</Menu.Item>
                        <Menu.Item key="4">
                            <div onClick={() => logout()}>Logout</div>
                        </Menu.Item>
                    </React.Fragment>
                )}
            </Menu>
        </Header>
    );
};

export default Navbar;
