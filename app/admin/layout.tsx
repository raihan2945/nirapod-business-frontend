"use client";

import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Link from "next/link";
import { APIResponseHandlerProvider } from "@/contexts/ApiResponseHandlerContext";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";


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
    key: "4",
    label: <Link href="/admin/investors">Investors Req</Link>,
    icon: <UserOutlined />,
  },
];

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();



  return (
    <Layout style={{ minHeight: "100vh" }}>
      <APIResponseHandlerProvider>
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
          <div className="p-8">
            <Link href={"/"}>
              <img
                src={"/images/logoLight.png"}
                alt="Team holding frames"
                //  object-cover"
              />
            </Link>
          </div>
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
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Nirapod Business ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </APIResponseHandlerProvider>
    </Layout>
  );
}
