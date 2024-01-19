import LayoutPages from "@/components/LayoutPages";
import Messages from "./components/message";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { getCookie } from "@/api/cookies";

export default function Mess({ user_id }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const CHAT_GATEWAY = "ws://localhost:3333";
    const TOKEN = getCookie("token");
    // console.log(TOKEN, 'token');
    const socket = io(CHAT_GATEWAY, {
      transports: ["websocket", "polling"],
      auth: {
        token: TOKEN,
      },
    });
    socket.on("connect", () => {
      console.log("Connected chat services");
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Messages userId={user_id} socket={socket} />
    </>
  );
}

Mess.getLayout = ({ page, pageProps }) => (
  <LayoutPages {...pageProps}>{page}</LayoutPages>
);
