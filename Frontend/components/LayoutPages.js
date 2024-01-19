"use client";
// import "antd/dist/antd.css";
import "../styles/globalPages.css";
import { Inter } from "next/font/google";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Dropdown, Layout, Row, theme } from "antd";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { deleteCookie } from "@/api/cookies";
import Router from "next/router";

const { Header, Content } = Layout;
const inter = Inter({ subsets: ["latin"] });

export default function LayoutPages({ children, user_name }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logout = () => {
    localStorage.clear();
    deleteCookie("user_id");
    deleteCookie("user_name");
    deleteCookie("token");
    deleteCookie("rf_token");
    Router.push("/login");
  };
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
      label: <Link href="/messages">Messages</Link>,
      key: "3",
    },
    {
      label: <div onClick={logout}>Log out</div>,
      key: "4",
    },
  ];

  return (
    <div className={`${inter.className} min-h-screen`}>
      <Layout className="min-h-screen">
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
            background: "linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)",
            // backgroundImage:
            // "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
          }}
        >
          <Row className="w-full">
            <Col flex="100px">
              <div className="h-[64px] flex justify-center items-center">
                <Link href="/home">
                  <Image
                    src="/duck.svg"
                    alt="QuacQuac Logo"
                    width={70}
                    height={64}
                    priority
                  />
                </Link>
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
                  <Avatar icon={<UserOutlined />} /> {user_name}
                </a>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content
          className="site-layout h-full"
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
    </div>
  );
}
