import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { shopifyFetch, storeBaseUrl } from "./lib/shopify";

type ImageNode = { url: string; altText?: string | null };
type Product = {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    productType: string;
    images: { edges: { node: ImageNode }[] };
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};
type Collection = { id: string; handle: string; title: string };

type CollectionsResp = { collections: { edges: Array<{ node: Collection }> } };

type ProductsResp = {
    collection: {
        title: string;
        products: {
            edges: Array<{ cursor: string; node: Product }>;
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
    } | null;
};

type AllProductsResp = {
    products: {
        edges: Array<{ cursor: string; node: Product }>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
};

type SortValue = "price-asc" | "price-desc";
type ProductFilterInput = { productVendor?: string; productType?: string };

type AppProps = { initialHandle?: string; lockHandle?: boolean; perPage?: number };

const COLLECTIONS = `
  query Collections($first:Int!) {
    collections(first:$first) {
      edges { node { id handle title } }
    }
  }
`;

const COLLECTION_PRODUCTS = `
  query CollectionProducts(
    $handle:String!, $first:Int!, $after:String,
    $sortKey:ProductCollectionSortKeys, $reverse:Boolean,
    $filters:[ProductFilter!]
  ) {
    collection(handle:$handle) {
      title
      products(
        first:$first, after:$after,
        sortKey:$sortKey, reverse:$reverse,
        filters:$filters
      ) {
        edges {
          cursor
          node {
            id title handle vendor productType
            images(first:1){ edges{ node{ url altText } } }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

const ALL_PRODUCTS = `
  query AllProducts(
    $first:Int!, $after:String,
    $sortKey:ProductSortKeys, $reverse:Boolean,
    $query:String
  ) {
    products(first:$first, after:$after, sortKey:$sortKey, reverse:$reverse, query:$query) {
      edges {
        cursor
        node {
          id title handle vendor productType
          images(first:1){ edges{ node{ url altText } } }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export default function App({ initialHandle = "", lockHandle = false, perPage = 12 }: AppProps) {
    // selected === ""  ->  ALL PRODUCTS
    const [selected, setSelected] = useState<string>(initialHandle);
    const [collections, setCollections] = useState<Collection[]>([]);

    const [title, setTitle] = useState<string>(initialHandle ? "Collection" : "All Products");
    const [items, setItems] = useState<Product[]>([]);
    const [after, setAfter] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState<boolean>(false);

    const [sort, setSort] = useState<SortValue>("price-asc");
    const [vendor, setVendor] = useState<string>("");
    const [ptype, setPtype] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const isAll = selected === ""; // ALL products si handle vacío
    const reverse = sort === "price-desc";
    const sortKeyCollection = useMemo(() => "PRICE" as const, []);
    const sortKeyProducts = useMemo(() => "PRICE" as const, []);

    const filtersVar = useMemo<ProductFilterInput[]>(() => {
        const f: ProductFilterInput[] = [];
        if (!isAll && vendor) f.push({ productVendor: vendor });
        if (!isAll && ptype) f.push({ productType: ptype });
        return f;
    }, [vendor, ptype, isAll]);

    // Opciones de filtros (a partir de lo que está cargado)
    const vendorOptions = useMemo(
        () => Array.from(new Set(items.map(i => i.vendor).filter(Boolean))).sort(),
        [items]
    );
    const typeOptions = useMemo(
        () => Array.from(new Set(items.map(i => i.productType).filter(Boolean))).sort(),
        [items]
    );

    // Colecciones para el selector
    useEffect(() => {
        (async () => {
            try {
                const data = await shopifyFetch<CollectionsResp>(COLLECTIONS, { first: 50 });
                setCollections(data.collections.edges.map(e => e.node));
            } catch (err) {
                console.error("Collections error:", err);
            }
        })();
    }, []);

    // Query para ALL PRODUCTS (vendor/product_type)
    const buildQuery = useCallback(() => {
        const esc = (s: string) => s.replace(/"/g, '\\"');
        const parts: string[] = [];
        if (vendor) parts.push(`vendor:"${esc(vendor)}"`);
        if (ptype) parts.push(`product_type:"${esc(ptype)}"`);
        return parts.join(" ");
    }, [vendor, ptype]);

    // Carga de productos (ALL o Collection)
    const loadProducts = useCallback(
        async (reset: boolean) => {
            setLoading(true);
            setError(null);
            try {
                if (isAll) {
                    const query = buildQuery();
                    const data = await shopifyFetch<AllProductsResp>(ALL_PRODUCTS, {
                        first: perPage,
                        after: reset ? null : after,
                        sortKey: sortKeyProducts,
                        reverse,
                        query: query || undefined,
                    });
                    const newItems = data.products.edges.map(e => e.node);
                    setTitle("All Products");
                    setItems(prev => (reset ? newItems : [...prev, ...newItems]));
                    setAfter(data.products.pageInfo.endCursor);
                    setHasNext(data.products.pageInfo.hasNextPage);
                } else {
                    const data = await shopifyFetch<ProductsResp>(COLLECTION_PRODUCTS, {
                        handle: selected,
                        first: perPage,
                        after: reset ? null : after,
                        sortKey: sortKeyCollection,
                        reverse,
                        filters: filtersVar.length ? filtersVar : undefined,
                    });

                    if (!data.collection) {
                        setTitle("Collection not found");
                        setItems([]);
                        setAfter(null);
                        setHasNext(false);
                        setError("Collection not found");
                        return;
                    }

                    let newItems = data.collection.products.edges.map(e => e.node);

                    // Fallback client por si la tienda ignora los filters en collection.products
                    if (vendor || ptype) {
                        newItems = newItems.filter(p => {
                            const byVendor = vendor ? p.vendor === vendor : true;
                            const byType = ptype ? p.productType === ptype : true;
                            return byVendor && byType;
                        });
                    }

                    setTitle(data.collection.title);
                    setItems(prev => (reset ? newItems : [...prev, ...newItems]));
                    setAfter(data.collection.products.pageInfo.endCursor);
                    setHasNext(data.collection.products.pageInfo.hasNextPage);
                }
            } catch (err) {
                console.error("Products error:", err);
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        [isAll, selected, perPage, after, sortKeyProducts, sortKeyCollection, reverse, buildQuery, filtersVar, vendor, ptype]
    );

    // Dispara carga cuando cambian selección/filtros/sort
    useEffect(() => { void loadProducts(true); },
        [selected, sort, vendor, ptype, loadProducts]);

    // Infinite scroll
    const loaderRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const el = loaderRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNext && !loading) { void loadProducts(false); }
            },
            { rootMargin: "200px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [hasNext, loading, loadProducts]);

    if (error) {
        return (
            <div className="min-h-dvh p-4 md:p-6 max-w-7xl mx-auto">
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => { setError(null); void loadProducts(true); }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const productsCount = items.length;

    return (
        <div className="min-h-dvh p-4 md:p-6 w-full">
            {/* Toolbar en fila */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                {!lockHandle && (
                    <select
                        value={selected}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelected(e.target.value)}
                        className="border rounded-lg px-3 py-2 min-w-[180px]"
                    >
                        <option value="">All products</option>
                        {collections.map((c) => (
                            <option key={c.id} value={c.handle}>{c.title}</option>
                        ))}
                    </select>
                )}

                <select
                    value={vendor}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setVendor(e.target.value)}
                    className="border rounded-lg px-3 py-2 min-w-[180px]"
                >
                    <option value="">All brands</option>
                    {vendorOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                <select
                    value={ptype}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPtype(e.target.value)}
                    className="border rounded-lg px-3 py-2 min-w-[180px]"
                >
                    <option value="">All product types</option>
                    {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                    value={sort}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as SortValue)}
                    className="border rounded-lg px-3 py-2"
                >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>

                {(vendor || ptype) && (
                    <button onClick={() => { setVendor(""); setPtype(""); }} className="text-sm underline opacity-80">
                        Clear filters
                    </button>
                )}

                <div className="ml-auto text-sm opacity-70">{productsCount} {isAll ? "results" : "products"}</div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold mb-4">{title}</h1>

            {items.length === 0 && !loading ? (
                <div className="p-12 text-center border rounded-xl">No products found.</div>
            ) : (
                <>
                    <div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        style={{ display: "grid", gap: "24px" }} /* fallback por si Tailwind no está */
                    >
                        {items.map((p) => {
                            const img = p.images.edges[0]?.node?.url;
                            const price = p.priceRange.minVariantPrice;
                            return (
                                <a
                                    key={p.id}
                                    href={`${storeBaseUrl()}/products/${p.handle}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl border p-4 hover:shadow transition"
                                >
                                    <div className="aspect-[4/5] bg-gray-50 rounded-lg mb-3 overflow-hidden">
                                        {img && <img src={img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />}
                                    </div>
                                    <div className="text-sm opacity-70 mb-1 truncate">{p.vendor}</div>
                                    <div className="font-medium mb-1 truncate">{p.title}</div>
                                    <div className="text-sm opacity-80">
                                        {price.amount} {price.currencyCode}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                    <div ref={loaderRef} className="h-10" />
                </>
            )}
        </div>
    );
}
