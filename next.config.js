if (!process.env.WORDPRESS_API_URL) {
        throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `);
}

/** @type {import('next').NextConfig} */
module.exports = {
        env: {
                WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
        },
        typescript: {
                // !! WARN !!
                // Dangerously allow production builds to successfully complete even if
                // your project has type errors.
                // !! WARN !!
                ignoreBuildErrors: true,
        },
        images: {
                domains: [
                        process.env.WORDPRESS_API_URL.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/)[0], // Valid WP Image domain.
                        "0.gravatar.com",
                        "1.gravatar.com",
                        "2.gravatar.com",
                        "secure.gravatar.com",
                ],
        },
        async headers() {
                return [
                        {
                                source: "/example/:id",
                                headers: [
                                        {
                                                key: "cache-control",
                                                value: "s-maxage=600, stale-while-revalidate=30",
                                        },
                                ],
                        },
                ];
        },
};
