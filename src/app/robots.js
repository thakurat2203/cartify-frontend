const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/account/",
        "/cart/",
        "/checkout/",
        "/orders/",
        "/login/",
        "/register/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
