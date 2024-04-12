export default function isClickFromFacebook(context, config) {
    const referer = context?.req?.headers?.referer || "";
    const userAgent = context?.req?.headers?.["user-agent"] || "";

    return (referer && referer.includes("facebook")) || (userAgent && userAgent.toLowerCase().includes("messenger"));
}
