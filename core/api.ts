import { config } from "./config";

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
    const headers = { "Content-Type": "application/json" };

    if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
    }

    // WPGraphQL Plugin must be enabled
    const res = await fetch(`${config.WORDPRESS_API_URL}/graphql`, {
        headers,
        method: "POST",
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const json = await res.json();
    if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
    }
    return json.data;
}

export async function getPostAndMorePosts(slug, preview, previewData) {
    const postPreview = preview && previewData?.post;
    const isId = Number.isInteger(Number(slug));
    const isSamePost = isId ? Number(slug) === postPreview.id : slug === postPreview.slug;
    const isDraft = isSamePost && postPreview?.status === "draft";
    const isRevision = isSamePost && postPreview?.status === "publish";
    const query = `fragment AuthorFields on User {name firstName lastName avatar {url}} fragment PostFields on Post {title excerpt slug date featuredImage {node {sourceUrl}} author {node {...AuthorFields}} categories {edges {node {name}}} tags {edges {node {name}}}} query PostBySlug($id:ID!,$idType:PostIdType!){post(id:$id,idType:$idType){...PostFields content${
        isRevision
            ? `revisions(first:1,where:{orderby:{field:MODIFIED,order:DESC}}){edges{node{title excerpt content author{node{...AuthorFields}}}}}`
            : ``
    }} posts(first:1,where:{orderby:{field:DATE,order:DESC}}){edges{node{...PostFields}}}}`;

    const variables = {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
    };

    const data = await fetchAPI(query, { variables });

    if (isDraft) {
        data.post.slug = postPreview.id;
    }

    if (isRevision && data.post.revisions) {
        const revision = data.post.revisions.edges[0]?.node;
        if (revision) {
            Object.assign(data.post, revision);
        }
        delete data.post.revisions;
    }

    const filteredPosts = data.posts.edges.filter(({ node }) => node.slug !== slug);
    const slicedPosts = filteredPosts.slice(0, 2);

    data.posts.edges = slicedPosts;

    return data;
}
