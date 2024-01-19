"use client";

import { createTodo, getListTodos, updateTodo } from "@/api/address";
import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Tag,
  Tooltip,
  message,
  Space,
  Table,
  Divider,
  Badge,
  Popconfirm,
} from "antd";
import {
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  HddTwoTone,
  SafetyCertificateTwoTone,
  PieChartTwoTone,
  WarningTwoTone,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { isExpired } from "@/common/util";
import LayoutPages from "@/components/LayoutPages";

export default function Todo() {
  const contentStatus = (item) => (
    <div>
      {[1, 2, 3]
        .filter((i) => i != item?.status)
        .map((itemTag, index) => (
          <Tag
            key={index}
            color={itemTag == 1 ? "green" : itemTag == 2 ? "red" : "#ccc"}
            className="cursor-pointer"
            onClick={() => changeStatus(itemTag, item._id)}
          >
            {itemTag == 1 ? "Done" : itemTag == 2 ? "Doing" : "Pending"}
          </Tag>
        ))}
    </div>
  );

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (_, { status, deadline }) => {
        return (
          <p
            className={`${
              status == 1
                ? "line-through italic opacity-50 "
                : isExpired(deadline)
                ? "text-red-600 uppercase font-bold"
                : ""
            }`}
          >
            {isExpired(deadline) && status != 1 ? (
              <>
                <Tooltip title="Expired">{deadline}</Tooltip>
              </>
            ) : (
              deadline
            )}
          </p>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { name, status, deadline }) => {
        return (
          <p
            className={`${
              status == 1
                ? "line-through italic text-green-600 opacity-50 "
                : isExpired(deadline)
                ? "text-red-600 uppercase font-bold"
                : ""
            }`}
          >
            {isExpired(deadline) && status != 1 ? (
              <>
                <Tooltip title="Expired">{name}</Tooltip>
              </>
            ) : (
              name
            )}
          </p>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        let color =
          record?.status == 1 ? "green" : record?.status == 2 ? "red" : "#ccc";
        return (
          <>
            <Popover
              placement="top"
              title="Want to change status??"
              content={() => contentStatus(record)}
              trigger="click"
            >
              <Tag color={color} className="cursor-pointer">
                {record?.status == 1
                  ? "Done"
                  : record?.status == 2
                  ? "Doing"
                  : "Pending"}
              </Tag>
            </Popover>
          </>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (_, { priority }) => {
        let color =
          priority == 1 ? "error" : priority == 2 ? "warning" : "default";
        return (
          <>
            <Badge
              status={color}
              text={priority == 1 ? "High" : priority == 2 ? "Normal" : "Low"}
            />
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => openModal("2", record)} type="link">
            Update
          </Button>
          <Popconfirm title="Delete this task??" okText="Confirm">
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();
  const [recall, setRecall] = useState(false);
  const [dataTodos, setDataTodos] = useState({});
  const [modal, setModal] = useState({
    open: false,
    mode: 1,
  });

  const openModal = (option, record) => {
    setModal({
      open: true,
      mode: +option,
    });
    if (+option == 2) {
      form.setFieldsValue({
        deadline: dayjs(record?.deadline),
        name: record?.name,
        status: +record?.status,
        priority: +record?.priority,
      });
    }
  };

  const submitForm = (values) => {
    values.deadline = dayjs(values.deadline).format("YYYY-MM-DD");

    createTodo(values)
      .then((res) => {
        if (res?.data?.code === 0) {
          message.success(res?.data?.message);
          setRecall(!recall);
          setModal({
            open: false,
            mode: 1,
          });
          form.resetFields();
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => message.error(err));
  };

  const changeStatus = (option, id) => {
    updateTodo(id, { status: +option })
      .then((res) => {
        if (res?.data?.code === 0) {
          message.success(res?.data?.message);
          setRecall(!recall);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => message.error(err));
  };

  const changePriority = (option, id) => {
    updateTodo(id, { priority: +option })
      .then((res) => {
        if (res?.data?.code === 0) {
          message.success(res?.data?.message);
          setRecall(!recall);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => message.error(err));
  };

  const contentPriority = (item) => (
    <Row gutter={[16, 16]} justify="center">
      {[1, 2, 3]
        .filter((i) => i != item?.priority)
        .map((itemTag, index) => (
          <Col key={index}>
            <Tooltip
              title={itemTag == 1 ? "High" : itemTag == 2 ? "Normal" : "Low"}
            >
              {itemTag == 1 ? (
                <p>
                  <ClockCircleOutlined
                    className="text-base"
                    style={{
                      color: "red",
                    }}
                    onClick={() => changePriority(itemTag, item?._id)}
                  />{" "}
                  &nbsp; : High Priority
                </p>
              ) : itemTag == 2 ? (
                <p>
                  <WarningOutlined
                    className="text-base"
                    style={{
                      color: "blue",
                    }}
                    onClick={() => changePriority(itemTag, item?._id)}
                  />{" "}
                  &nbsp; : Normal Priority
                </p>
              ) : (
                <p>
                  <ExclamationCircleOutlined
                    className="text-base"
                    style={{
                      color: "gray",
                    }}
                    onClick={() => changePriority(itemTag, item?._id)}
                  />{" "}
                  &nbsp; : Low Priority
                </p>
              )}
            </Tooltip>
          </Col>
        ))}
    </Row>
  );
  useEffect(() => {
    getListTodos()
      .then((res) => {
        if (res?.data?.code === 0) {
          setDataTodos(res?.data?.data);
        } else {
          message.error("Có lỗi xảy ra!" + res?.data?.message);
        }
      })
      .catch((err) => message.error("err! " + err));
  }, [recall]);
  return (
    <main className="min-h-screen items-center">
      <Modal
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, mode: 1 });
          form.resetFields();
        }}
        title={
          modal.mode === 1 ? "LET'S ADD SOME WORK!" : "UPDATE INFORMATION!!!!"
        }
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          labelAlign="left"
          onFinish={submitForm}
        >
          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[
              {
                required: true,
                message: "This field is required!",
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input placeholder="Type something here..." />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Radio.Group defaultValue={1}>
              <Radio value={1}>
                <p className="text-red-600"> High </p>
              </Radio>
              <Radio value={2}>
                <p className="text-blue-600"> Normal </p>
              </Radio>
              <Radio value={3}>
                <p className="text-gray-600"> Low </p>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Radio.Group defaultValue={3}>
              <Radio value={1}>
                <p className="text-green-600"> Done </p>
              </Radio>
              <Radio value={2}>
                <p className="text-red-600"> Doing </p>
              </Radio>
              <Radio value={3}>
                <p className="text-gray-600"> Pending </p>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                styles={{
                  backgroundColor: "#5fc84c !important",
                }}
              >
                {modal.mode === 1 ? "Save" : "Update"}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setModal({ open: false, mode: 1 });
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={6}>
          <div className="flex bg-white text-black p-[20px]">
            <div className="w-1/3 flex justify-start items-center">
              <p className="w-[50px] h-[50px] border-[1px] border-solid rounded-full flex justify-center items-center bg-[#98abb4]">
                <HddTwoTone className="text-[20px]" />
              </p>
            </div>
            <div className="w-2/3">
              <p className="font-bold text-[18px]">{dataTodos?.total || 0}</p>
              <p className="italic">Total Tasks</p>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <div className="flex bg-white text-black p-[20px]">
            <div className="w-1/3 flex justify-start items-center">
              <p className="w-[50px] h-[50px] border-[1px] border-solid rounded-full flex justify-center items-center bg-[#5fc84c]">
                <SafetyCertificateTwoTone className="text-[20px]" />
              </p>
            </div>
            <div className="w-2/3">
              <p className="font-bold text-[18px]">{dataTodos?.done || 0}</p>
              <p className="italic">Done Tasks</p>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <div className="flex bg-white text-black p-[20px]">
            <div className="w-1/3 flex justify-start items-center">
              <p className="w-[50px] h-[50px] border-[1px] border-solid rounded-full flex justify-center items-center bg-[#ffb22b]">
                <PieChartTwoTone className="text-[20px]" />
              </p>
            </div>
            <div className="w-2/3">
              <p className="font-bold text-[18px]">
                {dataTodos?.highPriority || 0}
              </p>
              <p className="italic">High Priority Tasks</p>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <div className="flex bg-white text-black p-[20px]">
            <div className="w-1/3 flex justify-start items-center">
              <p className="w-[50px] h-[50px] border-[1px] border-solid rounded-full flex justify-center items-center bg-[#fc4a6c]">
                <WarningTwoTone className="text-[20px]" />
              </p>
            </div>
            <div className="w-2/3">
              <p className="font-bold text-[18px]">{dataTodos?.expired || 0}</p>
              <p className="italic">Expired Tasks</p>
            </div>
          </div>
        </Col>
      </Row>
      <div>
        <Divider orientation="left" className="uppercase">
          Do your best!!
        </Divider>
        <div className="bg-white">
          <Table
            title={() => (
              <Row gutter={8}>
                <Col xs={12}>
                  <h2 className="font-bold text-[18px]">Todo List Task</h2>
                </Col>
                <Col xs={12} className="flex justify-end">
                  <Button type="link" onClick={() => openModal("1")}>
                    Add Todo
                  </Button>
                </Col>
              </Row>
            )}
            columns={columns}
            dataSource={dataTodos?.data?.map((x) => ({
              ...x,
              key: x._id,
            }))}
          />
        </div>
      </div>
    </main>
  );
}

Todo.getLayout = ({ page, pageProps }) => (
  <LayoutPages {...pageProps}>{page}</LayoutPages>
);
