/**
 * Server-side API helper for Next.js server components
 * Uses native fetch and runs only on the Node.js server
 * 
 * Key differences from client/src/lib/api.js:
 * - No Axios (uses native fetch)
 * - No browser proxies (uses API_SERVER_BASE_URL directly)
 * - Can be imported in server components (no "use client")
 * - Optimized for server-to-server communication
 */

const API_SERVER_BASE_URL = process.env.API_SERVER_BASE_URL || 'http://localhost:5000';

/**  
 * Fetch a single product by its URL slug
 * Used by the product detail page to render SEO content
 * 
 * @param {string} slug - The URL-friendly product slug (e.g., 'macbook-laptop')
 * @returns {Promise<Object>} Product object with name, description, price, image, etc.
 * @throws {Error} If product not found or backend error
 */
async function getProductBySlug(slug) {
  const url = `${API_SERVER_BASE_URL}/api/products/slug/${slug}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product not found: ${slug}`);
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error(`[server-api] getProductBySlug(${slug}) failed:`, error.message);
    throw error;
  }
}

/**
 * Fetch all products for sitemap generation
 * Returns minimal data (slug, updatedAt) needed for sitemap URLs
 * 
 * @returns {Promise<Array>} Array of products with slug and updatedAt
 * @throws {Error} If backend error
 */
async function getSitemapProducts() {
  const url = `${API_SERVER_BASE_URL}/api/products/sitemap`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    // Backend returns { products: [...] }, so unwrap it
    return data.products || data;
  } catch (error) {
    console.error('[server-api] getSitemapProducts() failed:', error.message);
    throw error;
  }
}

module.exports = {
  getProductBySlug,
  getSitemapProducts,
};