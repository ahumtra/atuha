import _get from "lodash.get";
import { GetServerSidePropsContext } from "next";
import isClickFromFacebook from "../../core/isClickFromFacebook";
import { config } from "../../core/config";
import isFacebookCrawler from "../../core/isFacebookCrawler";

export default function Post({ header, isClickFromFacebook, isFacebookCrawler, isClickMessenger }) {
    return (
        <>
            <div className="max-w-3xl p-8 mx-auto ">
                <div>{JSON.stringify(header)}</div>
                <div className="space-y-4">
                    <div>hello</div>
                    <div className="p-8 bg-green-500">
                        <div>Is Click From Message: {isClickMessenger ? "true" : "false"}</div>
                    </div>
                    <div className="p-8 bg-red-500">
                        <div>Is Facebook crawler: {isFacebookCrawler ? "true" : "false"}</div>
                    </div>
                    <div className="p-8 bg-blue-500">
                        <div>Is click from Facebook: {isClickFromFacebook ? "true" : "false"}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const header = _get(context, "req.headers", {});
    return {
        props: {
            header,
            revalidate: 10,
            isClickFromFacebook: isClickFromFacebook(context, config),
            isFacebookCrawler: isFacebookCrawler(context, config),
            isClickMessenger: isClickFromFacebook(context, config),
        },
    };
}
