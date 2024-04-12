import encodeUrl from "encodeurl";
import _get from "lodash.get";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { getPostAndMorePosts } from "../core/api";
import { config } from "../core/config";
import isFacebookCrawler from "../core/isFacebookCrawler";
import isClickFromFacebook from "../core/isClickFromFacebook";
import isClickMessenger from "../core/isClickMessenger";
import Head from "next/head";

export default function Post({ post, isRedirect = false }) {
    return (
        <>
            <NextSeo
                title={_get(post, "title", "")}
                description="hello world"
                openGraph={{
                    article: {
                        publishedTime: new Date(_get(post, "date", "")).toISOString(),
                        section: "gist",
                    },
                    siteName: "My Blog",
                    locale: "en_US",
                    type: "article",
                    defaultImageHeight: 1200,
                    defaultImageWidth: 1200,
                    url: encodeUrl(`${config.WORDPRESS_API_URL}/${_get(post, "slug", "")}`),
                    audio: [],

                    images: [
                        {
                            alt: _get(post, "title", ""),
                            url: _get(post, "featuredImage.node.sourceUrl", ""),
                        },
                    ],
                }}
                twitter={{}}
            />
            <Head>
                <meta name="ia:markup_url" content="" />
                <meta name="ia:markup_url_dev" content="" />
                <meta name="ia:rules_url" content="" />
                <meta name="ia:rules_url_dev" content="" />
            </Head>
            {isRedirect ? (
                <div>
                    <h1 className="text-6xl font-bold">{post.title}</h1>
                    <div>You are being redirected to the post, please wait 1-2 seconds...</div>
                </div>
            ) : (
                <div className="max-w-3xl p-8 mx-auto">
                    <div className="mb-6 text-4xl font-bold">{_get(post, "title", "")}</div>
                    <div className="mb-8 text-lg font-semibold">{_get(post, "author.node.name", "")}</div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: _get(post, "content", ""),
                        }}
                    ></div>
                </div>
            )}
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const slug = decodeURI(_get(context.params, "slug")).replace(/\s/g, "");

    if (isClickMessenger(context, config)) {
        console.log("Click from facebook");
        return {
            redirect: {
                permanent: false,
                destination: encodeUrl(`${config.WORDPRESS_API_URL}/${slug}`),
            },
            props: { isRedirect: false },
        };
    }

    if (isFacebookCrawler(context, config)) {
        console.log("Facebook crawler");
        console.log("data", slug);
        const data = await getPostAndMorePosts(slug, false, undefined);

        return {
            props: {
                post: data.post,
                revalidate: 10,
                isRedirect: true,
            },
        };
    }

    if (isClickFromFacebook(context, config)) {
        console.log("Click from Facebook");
        return {
            redirect: {
                permanent: false,
                destination: encodeUrl(`${config.WORDPRESS_API_URL}/${slug}`),
            },
            props: {
                isRedirect: false,
            },
        };
    }

    const data = await getPostAndMorePosts(slug, false, undefined);

    return {
        props: {
            post: data.post,
            revalidate: 10,
            isRedirect: true,
        },
    };
}
