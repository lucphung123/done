// import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import "../styles/globalPages.css";
import Head from "next/head";
import { getCookie, hasCookie } from "@/api/cookies";
import { setToken } from "@/api/address";
// import { getCookie } from "@/api/cookies";
// import App from "next/app";
export default function MyApp({ Component, pageProps }) {
  if (typeof window !== "undefined") {
    if (hasCookie("token")) {
      pageProps.token = getCookie("token");
    } else {
      delete pageProps.user_id;
      delete pageProps.user_name;
    }
  }
  if (pageProps?.token) {
    setToken(pageProps?.token);
  }

  const getLayout = Component.getLayout || (({ page, pageProps }) => page);
  // return <Component {...pageProps} />;
  return getLayout({
    page: (
      <>
        <Head>
          <title>QuacQuac App</title>
        </Head>
        <Component {...pageProps} />
      </>
    ),
    pageProps,
  });
}
// console.log("page props");

MyApp.getInitialProps = async ({ Component, ctx }) => {
  // App.getInitialProps(appContext);
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  if (typeof window !== "undefined") {
    pageProps.user_id = getCookie("user_id");
    pageProps.user_name = getCookie("user_name");
    pageProps.token = getCookie("token");
  } else {
    pageProps.user_id = ctx?.req?.cookies?.user_id;
    pageProps.user_name = ctx?.req?.cookies?.user_name;
    pageProps.token = ctx?.req?.cookies?.token;
  }
  //Anything returned here can be access by the client
  return { pageProps };
};
