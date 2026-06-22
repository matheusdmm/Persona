// Self-hosted Umami analytics. No-ops if the env vars aren't set, so local
// dev and any deploy without an analytics instance configured stay silent.
export function initAnalytics() {
  const url = import.meta.env.VITE_UMAMI_URL
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  if (!url || !websiteId) return

  const script = document.createElement('script')
  script.defer = true
  script.src = `${url}/script.js`
  script.setAttribute('data-website-id', websiteId)
  document.head.appendChild(script)
}
