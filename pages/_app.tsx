import { AppProps } from "next/app";
import "../styles/index.css";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}
export async function getServerSideProps(context) {
    // set HTTP header
    context.res.setHeader("Content-Type", "application/json");
    context.res.setHeader("Cache-Control", "public, s-maxage=10000, stale-while-revalidate=590000");
    console.log("context", context);
    return {
        props: {}, // will be passed to the page component as props
    };
}

export default MyApp;
