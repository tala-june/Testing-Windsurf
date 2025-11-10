export default {
  async fetch(request, env, ctx) {
    // Serve static assets from the Vite build via the ASSETS binding
    const url = new URL(request.url)

    // Always try to serve from assets first
    const assetResponse = await env.ASSETS.fetch(request)
    // If asset exists, Cloudflare serves 200. If not found, it returns 404, so fall through to index.html for SPA routing
    if (assetResponse.status !== 404) {
      return assetResponse
    }

    // SPA fallback: serve index.html
    // Ensure cache bypass for HTML to avoid stale routing responses
    const indexUrl = new URL('/', url.origin)
    const indexRequest = new Request(indexUrl.toString(), {
      headers: { 'cache-control': 'no-cache' },
    })
    return env.ASSETS.fetch(indexRequest)
  },
}
