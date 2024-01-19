import {
  createRoom,
  getListUsers,
  listBox,
  listMessageByRoom,
} from "@/api/address";
import { removeVietnameseTones } from "@/common/util";
import {
  LeftCircleFilled,
  LikeOutlined,
  LoadingOutlined,
  MenuOutlined,
  MessageOutlined,
  MoreOutlined,
  SendOutlined,
  StarOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Empty,
  Input,
  List,
  Popover,
  Row,
  Skeleton,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

export default function Messages({ userId, socket }) {
  const logo = require("../../../public/bgMess.jpg");
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [pagination, setPagination] = useState(null);
  const [loadMore, setLoadMore] = useState(false);

  const [listRoom, setListRoom] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listSearch, setListSearch] = useState([]);
  const [recallList, setRecallList] = useState(false);
  const [listMessages, setListMessages] = useState([]);
  const [callMessage, setCallMessage] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [roomSelected, setRoomSelected] = useState();
  const [valueMess, setValueMess] = useState("");

  function checkTimestamp(timestamp) {
    const currentDate = dayjs();
    const inputDate = dayjs(timestamp);

    if (inputDate.isSame(currentDate, "day")) {
      // Nếu timestamp là ngày hiện tại, trả về giờ của timestamp
      const time = inputDate.format("h:mm A");
      return time;
    } else {
      // Nếu timestamp không phải là ngày hiện tại, trả về ngày tháng
      const date = inputDate.format("DD/MM/YYYY");
      return date;
    }
  }

  const handleSearchUser = (e) => {
    setTextSearch(e.target.value);
    setLoading(true);
  };

  const handleClickIcon = (text, userIdSend) => {
    if (text == "Send Messages") {
      const params = {
        uid_send: userId,
        uid_receive: userIdSend,
      };
      createRoom(params).then((res) => {
        if (res?.data?.status && res?.data?.data?.id) {
          setTextSearch("");
          setListSearch([]);
          setRecallList(!recallList);
        }
      });
    } else {
      console.log(text, "textt");
    }
  };
  const IconText = ({ icon, text, userId }) => (
    <div
      className="cursor-pointer hover:font-bold"
      onClick={() => handleClickIcon(text, userId)}
    >
      {React.createElement(icon, {
        style: {
          marginRight: 8,
        },
      })}
      {text}
    </div>
  );

  // call messsages when scroll up to top
  // const loadMoreMessages = (option) => {
  // 	console.log(pagination, "pagination load more");
  // 	setListMessages([]);
  // 	setLoadMore(true);
  // 	// Gọi API để lấy thêm tin nhắn
  // 	const params = {
  // 		page: +pagination.page_number,
  // 		limit: +pagination.page_size,
  // 	};
  // 	if (option == 1) {
  // 		params.page = +pagination.page_number + 1;
  // 	} else {
  // 		pagination.page_number = +pagination.page_number - 1;
  // 	}
  // 	socket.emit("scroll-message", params);
  // 	socket
  // 		.off("scroll-message")
  // 		.on("scroll-message", (msg) => {
  // 			const { data, meta } = msg;
  // 			setListMessages([...data]);
  // 			// setCallMessage(true);
  // 			setPagination(meta);
  // 			setTimeout(() => {
  // 				setLoadMore(false);
  // 			}, 2000);
  // 		});
  // };

  // const handleScroll = () => {
  // 	// console.log(pagination, "pagination ham scroll");

  // 	const { scrollTop, clientHeight, scrollHeight } =
  // 		formRef.current;
  // 	if (
  // 		scrollTop === 0 &&
  // 		!loadMore &&
  // 		pagination.next_page &&
  // 		pagination.page_number < pagination.total_pages
  // 	) {
  // 		// Khi kéo lên đầu đoạn chat và không có tải thêm tin nhắn đang xảy ra
  // 		// và số lượng tin nhắn đã tải chưa đạt giới hạn
  // 		loadMoreMessages(1); // Gọi hàm để tải thêm tin nhắn
  // 	}
  // 	if (
  // 		scrollTop + clientHeight >= scrollHeight &&
  // 		!loadMore &&
  // 		pagination.previous_page &&
  // 		pagination.page_number > 1
  // 	) {
  // 		// Khi kéo xuống cuối đoạn chat và không có tải thêm tin nhắn đang xảy ra
  // 		// và số lượng tin nhắn đã tải chưa đạt giới hạn
  // 		loadMoreMessages(2); // Gọi hàm để tải thêm tin nhắn
  // 	}
  // };

  const selectRoom = async (room) => {
    if (roomSelected) await socket.emit("leave-box", roomSelected.id);
    setLoadingMessage(true);
    setListMessages([]);
    setPagination(null);
    // setRecallList(!recallList);
    setRoomSelected(room);
    socket.emit("join-box", room.id);
    socket.off("join-box").on("join-box", (msg) => {
      setListMessages(msg.data);
      setCallMessage(true);
      setPagination(msg.meta);
      setTimeout(() => {
        setLoadingMessage(false);
        setRecallList(!recallList);
      }, 2000);
    });
  };

  const closeRoom = () => {
    socket.emit("leave-box", roomSelected.id);
    setCallMessage(false);
    setListMessages([]);
    setPagination(null);
    setRoomSelected();
    setLoadingMessage(true);
    // socket.disconnect();
  };
  const getNameUser = (id) => {
    return listUsers?.find((user) => user.id === id)?.fullname;
  };

  if (socket) {
    socket.off("new-message").on("new-message", (v) => {
      const { data, meta } = v;
      // setListMessages(data);
      // setPagination(meta);
      setRecallList(!recallList);
    });
    socket.off("load-box").on("load-box", (v) => {
      if (v) setRecallList(!recallList);
    });
  }

  const handleChangeInput = (e) => {
    setValueMess(e.target.value);
  };

  const sendMessage = (e) => {
    // e.preventDefault();
    const content = valueMess;
    socket.emit("new-message", content);
    socket.off("new-message").on("new-message", (v) => {
      const { data, meta } = v;
      setListMessages(data);
      setPagination(meta);
      setRecallList(!recallList);
      setValueMess("");
    });
    // inputRef.current.value = "";
  };
  // console.log(listMessages, "listMessages");
  // Cuộn chuột xuống cuối
  useEffect(() => {
    if (formRef.current) {
      const scrollHeight = formRef.current.scrollHeight;
      formRef.current.scrollTop = scrollHeight;
      // formRef.current.addEventListener(
      // 	"scroll",
      // 	handleScroll
      // );
      // console.log(pagination, "pagi uef");
    }
    // return () => {
    // 	if (formRef.current) {
    // 		formRef.current.removeEventListener(
    // 			"scroll",
    // 			handleScroll
    // 		);
    // 	}
    // };
  }, [listMessages]);

  useEffect(() => {
    let result;
    if (textSearch.length > 0) {
      setLoading(true);
      result = listUsers.filter(
        (user) =>
          user.id !== userId &&
          removeVietnameseTones(user?.fullname?.toLowerCase()).includes(
            removeVietnameseTones(textSearch.toLowerCase())
          )
      );
    } else setListSearch([]);
    setListSearch(result);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [textSearch]);

  useEffect(() => {
    listBox()
      .then((res) => {
        setListRoom(res?.data?.data);
      })
      .catch((err) => message.error(err));

    getListUsers()
      .then((res) => {
        setListUsers(res?.data?.data);
      })
      .catch((err) => message.error(err));
  }, [recallList]);

  return (
    <div className="2xl:w-[80%] m-auto">
      <h1 className="uppercase font-semibold text-lg">My Messages</h1>
      <Row className={`h-full mt-5 }`}>
        <Col
          xs={24}
          lg={10}
          xl={8}
          className={`sm:max-h-[700px] lg:max-h-[500px] shadow-lg lg:block sm:${
            callMessage ? "hidden" : ""
          }
				 `}
        >
          <Input.Search
            placeholder="Search Friend"
            className="lg:p-4 p-2"
            onChange={handleSearchUser}
          />
          {textSearch.trim().length > 0 ? (
            <>
              <p className="px-2 mx-2 font-bold italic">
                Matching {loading ? "..." : listSearch?.length} result
              </p>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={listSearch}
                renderItem={(item) => (
                  <List.Item
                    className="shadow-md p-2 m-2 rounded-md"
                    key={item.id}
                    actions={
                      !loading
                        ? [
                            // <IconText
                            // 	icon={StarOutlined}
                            // 	text="156"
                            // 	key="list-vertical-star-o"
                            // />,
                            <IconText
                              userId={item.id}
                              icon={MessageOutlined}
                              text="Send Messages"
                              key="list-vertical-message"
                            />,
                            <IconText
                              userId={item.id}
                              icon={UserAddOutlined}
                              text="Add Friend"
                              key="list-vertical-add-o"
                            />,
                          ]
                        : undefined
                    }
                  >
                    <Skeleton loading={loading} active avatar>
                      <List.Item.Meta
                        avatar={<Avatar size="large" icon={<UserOutlined />} />}
                        title={<p className="font-bold">{item.fullname}</p>}
                        // description={item.description}
                      />
                    </Skeleton>
                  </List.Item>
                )}
              />
            </>
          ) : (
            listRoom?.map((room) => (
              <Row
                className={`px-2 py-6 m-2 justify-center items-center cursor-pointer rounded-md ${
                  room?.id !== roomSelected?.id
                    ? room?.message && !room?.message?.status_read
                      ? "shadow-lg flashing-background "
                      : "shadow-sm"
                    : "bg-blue-300"
                }`}
                key={room.id}
                onClick={() => selectRoom(room)}
              >
                <Col span={4} className="mr-2">
                  <Avatar size={48} icon={<UserOutlined />} />
                </Col>
                <Col span={19}>
                  <h1
                    className={`text-lg font-custom ${
                      room?.message && !room?.message?.status_read
                        ? " font-bold"
                        : ""
                    }`}
                  >
                    {room?.users?.find((user) => user.id !== userId)?.fullname}
                  </h1>
                  <Row>
                    <Col span={18} className="">
                      <p
                        className={`opacity-50 truncate font-custom ${
                          room?.message && !room?.message?.status_read
                            ? " font-bold"
                            : ""
                        }`}
                      >
                        {room?.message?.message}
                      </p>
                    </Col>
                    <Col span={6}>
                      <p
                        className={`opacity-50 font-custom ${
                          room?.message && !room?.message?.status_read
                            ? " font-bold"
                            : ""
                        }`}
                      >
                        {room?.message?.created_at &&
                          checkTimestamp(room?.message?.created_at)}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))
          )}
        </Col>
        <Col
          xs={24}
          lg={14}
          xl={16}
          className="relative sm:max-h-[700px] lg:max-h-[500px] overflow-hidden"
        >
          {callMessage ? (
            <>
              <div className="absolute w-full border-b-2 shadow-lg p-2 z-50 top-0 left-0">
                {/* <div className="flex items-center"> */}
                <Row className="items-center">
                  <Col span={2}>
                    <Avatar size="large" icon={<UserOutlined />} />
                  </Col>
                  <Col span={17}>
                    <p className="text-xl font-semibold font-dacing">
                      {
                        roomSelected?.users?.find((user) => user?.id !== userId)
                          ?.fullname
                      }
                    </p>
                  </Col>
                  <Col span={4}>
                    <div
                      className="text-end text-xl cursor-pointer hover:text-3xl"
                      onClick={closeRoom}
                    >
                      <Tooltip title="Close Room Chat">
                        <LeftCircleFilled />
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="h-full overflow-hidden">
                <div className="p-2 h-full w-full flex flex-col justify-end bg-[url('/R.jpg')] bg-center bg-no-repeat bg-cover bg-fixed shadow-lg">
                  {loadMore ? (
                    <div className="h-full mb-12 mt-14 text-lg italic text-white mx-auto">
                      <LoadingOutlined /> Loadinggg
                    </div>
                  ) : listMessages.length > 0 ? (
                    <>
                      <div
                        className="mb-12 mt-14 flex flex-col overflow-y-scroll"
                        ref={formRef}
                      >
                        {listMessages?.map((mess) => (
                          <Skeleton
                            loading={loadingMessage}
                            active
                            avatar
                            key={mess.id}
                          >
                            <div
                              className={`mt-2 flex ${
                                mess?.from === userId ? " flex-row-reverse" : ""
                              }`}
                            >
                              <Avatar size="default" icon={<UserOutlined />} />
                              <div
                                className={`w-[40%] ${
                                  mess?.from === userId
                                    ? "mr-2 text-end"
                                    : "ml-2"
                                }`}
                              >
                                <p className="italic text-xs text-white font-medium">
                                  {mess?.from !== userId
                                    ? `${getNameUser(
                                        mess?.from
                                      )}, ${checkTimestamp(mess.created_at)}`
                                    : checkTimestamp(mess.created_at)}
                                </p>
                                <p
                                  className={`p-4 rounded-lg font-dacing ${
                                    mess?.from !== userId
                                      ? "rounded-tl-none"
                                      : "rounded-tr-none"
                                  } text-white ${
                                    mess?.from === userId
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                  }`}
                                >
                                  {mess.message}
                                </p>
                              </div>
                            </div>
                          </Skeleton>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full shadow-lg flex justify-center items-start mt-14">
                      <Empty description="Let's send some messages!!!! (' > o < ')" />
                    </div>
                  )}
                </div>
                <footer className="absolute w-full z-50 bottom-0 left-0 p-2">
                  <Row gutter={8}>
                    <Col span={3}></Col>
                    <Col span={18}>
                      <Input
                        className="bg-white"
                        placeholder="Enter messages..."
                        addonAfter={<SendOutlined />}
                        onPressEnter={sendMessage}
                        ref={inputRef}
                        value={valueMess}
                        onChange={handleChangeInput}
                      />
                    </Col>
                    <Col
                      span={3}
                      className="flex justify-center items-center"
                    ></Col>
                  </Row>
                </footer>
              </div>
            </>
          ) : (
            <div className="sm:hidden lg:block">Select a Room! =))</div>
          )}
        </Col>
      </Row>
    </div>
  );
}
