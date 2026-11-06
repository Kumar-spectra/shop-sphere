const QUERIES = [
  'Tea strainer',
  'Stone for tea',
  'iPhone',
  'Laptop',
  'Shoes',
  'Water bottle',
  'Wireless headphones',
];

async function main() {
  console.log('========================================================================');
  console.log('SHOPSPHERE MULTI-MARKETPLACE SEARCH ENGINE: ACCEPTANCE TEST SUITE');
  console.log('========================================================================\n');

  for (const q of QUERIES) {
    const t0 = performance.now();
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/search?q=${encodeURIComponent(q)}`);
      const totalTimeMs = Math.round(performance.now() - t0);
      const json = await res.json();
      const data = json.data;

      console.log(`QUERY: "${q}"`);
      console.log(`  Normalized: "${data.processed.normalized}"`);
      if (data.processed.corrected) {
        console.log(`  Spelling Correction: "${data.processed.corrected}"`);
      }
      if (data.processed.synonyms?.length) {
        console.log(`  Synonyms / Related: [${data.processed.synonyms.join(', ')}]`);
      }
      console.log(`  Total Products Found: ${data.total}`);
      console.log(`  Roundtrip Latency: ${totalTimeMs}ms (Server execution: ${data.executionTimeMs}ms)`);
      console.log(`  Providers Contacted:`);

      data.providers.forEach((p) => {
        const modeLabel = p.providerId === 'shopsphere' ? 'LOCAL CATALOG' : p.isLive ? 'LIVE API' : p.liveSearchUrl ? 'EXTERNAL SEARCH LINK' : 'UNAVAILABLE';
        const configLabel = p.isConfigured ? 'Configured' : `Unconfigured (Missing: ${p.missingCredentials.join(', ') || 'keys'})`;
        console.log(`    - ${p.providerName} [${p.providerId.toUpperCase()}]:`);
        console.log(`        Mode: ${modeLabel}`);
        console.log(`        Status: ${configLabel}`);
        console.log(`        In-ShopSphere Product Count: ${p.totalFound}`);
        console.log(`        Response Time: ${p.responseTimeMs}ms`);
        if (p.error) console.log(`        Error: ${p.error}`);
        if (p.liveSearchUrl) console.log(`        External Marketplace Search Link: ${p.liveSearchUrl}`);
      });

      console.log(`  Top 3 Results:`);
      data.products.slice(0, 3).forEach((item, idx) => {
        const price = item.discount_price ? `₹${item.discount_price} (was ₹${item.price})` : `₹${item.price}`;
        console.log(`    ${idx + 1}. [${item.source.toUpperCase()}] ${item.name} | ${price} | Seller: ${item.seller_name}`);
      });
      console.log('------------------------------------------------------------------------\n');
    } catch (err) {
      console.error(`Error querying "${q}":`, err.message);
    }
  }
}

main();

