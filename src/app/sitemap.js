import { getSitemapProducts } from "@/lib/server-api";

export const dynamic = "force-dynamic";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap() {
  const products = await getSitemapProducts();
  const productEntries = products
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productEntries,
  ];
}
