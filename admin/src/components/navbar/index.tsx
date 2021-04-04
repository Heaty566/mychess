import * as React from "react";
import { Layout, Menu } from "antd";
import { ReactComponent as NavbarLogoIcons } from "../../asset/icons/navbar-logo-md.svg";

const { Header } = Layout;

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
        return (
                <Header className="header">
                        {/* <div>
                                <NavbarLogoIcons />
                        </div> */}
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                                <Menu.Item key="1">nav 1</Menu.Item>
                                <Menu.Item key="2">nav 2</Menu.Item>
                                <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                </Header>
        );
};

export default Navbar;
