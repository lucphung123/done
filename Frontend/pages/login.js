import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import Image from "next/image";
import { Josefin_Sans } from "next/font/google";
import Head from "next/head";
import { useState } from "react";
import dayjs from "dayjs";
import { createUser, login } from "@/api/address";
import { setCookie } from "@/api/cookies";
import Router from "next/router";

const jose = Josefin_Sans({ subsets: ["latin"] });
export default function Login() {
  const [form] = Form.useForm();

  const [checkRegister, setCheckRegister] = useState(false);

  const clickRegister = () => {
    setCheckRegister(!checkRegister);
    form.resetFields();
  };

  const handleSubmitForm = (values) => {
    values.dob = dayjs(values.dob).format("YYYY-MM-DD");
    values.gender = +values.gender;
    if (checkRegister) {
      createUser(values)
        .then((res) => {
          if (res?.data?.status) {
            message.success("Register successfully!");
            setCheckRegister(!checkRegister);
            form.resetFields();
          } else {
            message.error("Have an error! Please contact to dev!");
          }
        })
        .catch((err) =>
          message.error(err.response.data.message || err.response.data.errors)
        );
    } else {
      login(values)
        .then((res) => {
          if (res?.data?.status) {
            console.log(res, "resss");
            message.success(
              "Login success! Welcome " + res?.data?.data?.user?.fullname
            );
            setCookie(
              "user_id",
              res?.data?.data?.user?.id,
              res?.data?.data?.access_token?.expires_in
            );
            setCookie(
              "user_name",
              res?.data?.data?.user?.fullname,
              res?.data?.data?.access_token?.expires_in
            );
            setCookie(
              "token",
              res?.data?.data?.access_token?.value,
              res?.data?.data?.access_token?.expires_in
            );
            setCookie(
              "rf_token",
              res?.data?.data?.refresh_token?.value,
              res?.data?.data?.refresh_token?.expires_in
            );
            Router.push("/home");
          } else {
            message.error("Have an error! Please contact to dev!");
          }
        })
        .catch((err) => {
          message.error(
            err?.response?.data?.message || err?.response?.data?.errors
          );
        });
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div
        style={{
          backgroundImage: "url(http://bit.ly/2gPLxZ4)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "top",
          height: "100vh",
          width: "100%",
        }}
        className={`${jose.className} flex justify-center items-center `}
      >
        <div
          className=" w-[550px] min-h-[450px] rounded-sm bg-inherit"
          style={{
            boxShadow: "inset 0 0 0 300px rgba(255,255,255,0.05)",
          }}
        >
          <div className="h-[100px] flex justify-center">
            <Image
              src="/duck.svg"
              alt="QuacQuac Logo"
              // className="dark:invert"
              width={100}
              height={64}
              priority
            />
          </div>
          <div className="px-6">
            <h1 className="text-[50px] uppercase text-blue-400 flex justify-center font-bold">
              {checkRegister ? "Register" : "Login"}
            </h1>
            <Form
              form={form}
              className="mt-4"
              labelCol={{ span: 6 }}
              labelAlign="left"
              labelWrap="wrap"
              onFinish={handleSubmitForm}
            >
              {checkRegister ? (
                <>
                  <Form.Item
                    label="Full name"
                    name="fullname"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                  <Form.Item
                    label="Date of birdth"
                    name="dob"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Select placeholder="Choose your gender">
                      <Select.Option value="0">Male</Select.Option>
                      <Select.Option value="1">Fe Male</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                      {
                        type: "email",
                        message: "Email is not valid format!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    className="mb-2"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Press your password" />
                  </Form.Item>
                  <Row justify="end">
                    <Col className="text-white">
                      Have an account?
                      <Button type="link" onClick={clickRegister}>
                        Login now!
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Input placeholder="Press your username" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    className="mb-2"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "This is required field!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Press your password" />
                  </Form.Item>
                  <Row justify="end">
                    <Col className="text-white">
                      Have not an account?
                      <Button type="link" onClick={clickRegister}>
                        Register now!
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              <Row justify="center" className="mt-4">
                <Col className="text-white">
                  <Button type="primary" className="w-20" htmlType="submit">
                    {checkRegister ? "Register" : "Login"}
                  </Button>{" "}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
