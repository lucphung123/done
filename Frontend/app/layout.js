"use client";
// import "antd/dist/antd.css";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  MenuFoldOutlined,
  UnorderedListOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, theme } from "antd";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getCookie } from "@/api/cookies";
import Link from "next/link";
import Head from "next/head";

const { Header, Content } = Layout;
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, user_name }) {
  // console.log(user_name, "user_name");
  // let user_name;
  // if (typeof window !== "undefined") {
  // 	user_name = getCookie("user_name");
  // }
  const [username, setUsername] = useState("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      label: <Link href="/account">Account</Link>,
      key: "0",
    },
    {
      label: <Link href="/todo">My Todo List</Link>,
      key: "1",
    },
    // {
    // 	type: 'divider',
    // },
    {
      label: <Link href="/message">Messages</Link>,
      key: "3",
    },
  ];

  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <Head>
          <title>QuacQuac App</title>
        </Head>
        <Layout className="h-full">
          <Header
            theme="light"
            // className="bg-gradient-to-r from-[#50a3a2] to-[#53e3a6]"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              background:
                "linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)",
              // backgroundImage:
              // "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
            }}
          >
            <Row className="w-full">
              <Col flex="100px">
                <div className="h-[64px]">
                  <Image
                    src="/duck.svg"
                    alt="QuacQuac Logo"
                    // className="dark:invert"
                    width={100}
                    height={64}
                    priority
                  />
                </div>
              </Col>
              <Col flex="auto" className="text-end">
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomLeft"
                  arrow
                  trigger={["click"]}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Avatar icon={<UserOutlined />} /> {username}
                  </a>
                </Dropdown>
              </Col>
            </Row>
          </Header>
          <Content
            className="site-layout"
            style={{
              padding: "0 50px",
            }}
          >
            <div
              className="h-full"
              style={{
                padding: 24,
                // minHeight: 380,
                background: colorBgContainer,
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </body>
    </html>
  );
}
