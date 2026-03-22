export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url)

  if (res.status === 401 || res.status === 403) {
    // Session expired or unauthorized - redirect to login
    window.location.href = "/login"
    throw new Error("No autorizado")
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Error en la solicitud")
  }

  return res.json()
}
