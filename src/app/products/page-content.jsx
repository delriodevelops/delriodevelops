'use client';

import GridbreakArchive from '../../components/gridbreak-archive';

// `products` comes from the server (page.jsx); each one opens its case study
export default function ProductsPageContent({ products = [] }) {
  const items = products.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.images?.[0],
    tags: product.tags || [],
    href: product.href,
    wip: product.wip,
    external: false,
  }));

  return <GridbreakArchive kind="product" items={items} />;
}
