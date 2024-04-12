export default function isClickMessenger(context, config) {
    const userAgent = context?.req?.headers?.["user-agent"] || "";

    return (userAgent && userAgent.toLowerCase().includes("messenger")) || (userAgent && userAgent.toLowerCase().includes("fb"));
}
