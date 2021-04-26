import * as React from 'react';
import { Layout, Menu } from 'antd';
import { ReactComponent as NavbarLogoIcons } from '../../asset/icons/navbar-logo-md.svg';
import { Link } from 'react-router-dom';

const { Header } = Layout;

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
    return (
        <Header className="header">
            <div className="float-left h-full grid place-items-center mr-4">
                <NavbarLogoIcons />
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">
                    <Link to="/login">Login</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/register">Register</Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default Navbar;
