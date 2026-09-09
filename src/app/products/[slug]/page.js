import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug } from "@/lib/server-api";
import ProductCartAction from "@/components/product-cart-action";
import { productDetailStyles as styles } from "@/lib/tailwind-styles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    const title = product.seoTitle || product.name;
    const description = product.seoDescription || product.description || "Product details";
    const keywords = Array.isArray(product.seoKeywords) && product.seoKeywords.length > 0
      ? product.seoKeywords.join(", ")
      : [product.category, product.name].filter(Boolean).join(", ");
    const canonicalUrl = `${siteUrl}/products/${product.slug || slug}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "Cartify",
        type: "website",
        images: product.image ? [{ url: product.image, width: 1200, height: 800, alt: product.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.image ? [product.image] : [],
      },
    };
  } catch {
    return {
      title: "Product not found",
      description: "Product could not be found.",
    };
  }
}

const getStockBadge = (stock) => {
  const quantity = Number(stock);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { label: "Out of stock", className: styles.outStock };
  }

  if (quantity < 10) {
    return { label: "Low stock", className: styles.lowStock };
  }

  return { label: "Good stock", className: styles.goodStock };
};

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const stockBadge = getStockBadge(product.stock);
  const canonicalUrl = `${siteUrl}/products/${product.slug || slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "No description available.",
    image: product.image || undefined,
    category: product.category || "General",
    sku: product.slug || product._id || slug,
    brand: {
      "@type": "Brand",
      name: "Cartify",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(product.price ?? 0),
      availability: Number(product.stock) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: canonicalUrl,
    },
    url: canonicalUrl,
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <div className={styles.shell}>
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">&larr;</span>
          Back to catalog
        </Link>

        <article className={styles.card}>
          <div className={styles.hero}>
            <div className={`${styles.imagePlaceholder} relative`}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.fallbackLetterLarge}>
                  {product.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className={styles.content}>
              <p className={styles.category}>{product.category}</p>
              <h1 className={styles.title}>{product.name}</h1>
              <p className={styles.price}>Rs. {product.price}</p>
              <p className={styles.description}>
                {product.description || "No description available."}
              </p>
              <div className={styles.meta}>
                <span>Stock: {product.stock}</span>
                <span
                  className={`${styles.stockBadge} ${stockBadge.className}`}
                >
                  {stockBadge.label}
                </span>
              </div>

              <ProductCartAction
                product={product}
                className={styles.detailCartAction}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}