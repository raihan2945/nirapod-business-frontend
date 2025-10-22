"use client";
import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "1",
    label: <Link href="/admin/projects">Projects</Link>,
    icon: <UploadOutlined />,
  },
  {
    key: "2",
    label: <Link href="/admin/blogs">Blogs</Link>,
    icon: <VideoCameraOutlined />,
  },
  {
    key: "3",
    label: <Link href="/admin/users">Users</Link>,
    icon: <UserOutlined />,
  },
  {
    key: "3",
    label: <Link href="/admin/users">Investors</Link>,
    icon: <UserOutlined />,
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <img
          src={"/images/logoLight.png"}
          alt="Team holding frames"
          className="w-36 h-full object-cover"
        />
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            content
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Nirapod Business ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
