"use client";

import React, { useEffect } from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ProjectOutlined 
} from "@ant-design/icons";
import { Button, Layout, Menu, Popconfirm, theme } from "antd";
import Link from "next/link";
import { APIResponseHandlerProvider } from "@/contexts/ApiResponseHandlerContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { AppDispatch } from "@/state/store";
import { userLoggedOut } from "@/state/features/auth/authSlice";
import { useRouter } from "next/navigation";

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "0",
    label: <Link href="/admin/projects">Projects</Link>,
    icon: <UploadOutlined />,
  },
  {
    key: "1",
    label: <Link href="/admin/project-investments">Project Investments</Link>,
    icon: <ProjectOutlined />,
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

  const router = useRouter();

  const userId = useSelector((state: RootState) => state?.auth?.id);
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
  const userProfile = useSelector((state: RootState) => state?.user?.data);

  const dispatch: AppDispatch = useDispatch();

  const logout = () => {
    console.log("logged Out!!!");
    dispatch(userLoggedOut());
    window.location.reload();
    router.push("/");
  };

  useEffect(() => {
    if (userProfile?.role !== "admin") {
      router.push("/");
    }
  }, [isLoading, userProfile, router, isError]);

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
            defaultSelectedKeys={["0"]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyItems: "center",
                justifyContent: "flex-end",
                padding: "10px 20px",
              }}
            >
              <Popconfirm
                title="Logout"
                description="Are you sure to logout?"
                onConfirm={() => logout()}
                okText="Yes"
                cancelText="No"
              >
                <Button style={{ margin: 0 }}>Logout</Button>
              </Popconfirm>
            </div>
          </Header>
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
