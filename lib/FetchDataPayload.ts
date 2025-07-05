export async function fetchCollection(
  collectionSlug: string,
  {
    depth = 1,
    sort = "",
    limit = 100,
    where = "",
  }: {
    depth?: number;
    sort?: string;
    limit?: number;
    where?: string;
  } = {},
) {
  const params = new URLSearchParams();
  if (depth) params.append("depth", depth.toString());
  if (sort) params.append("sort", sort);
  if (limit) params.append("limit", limit.toString());

  // Build URL manually to preserve square brackets in where clause
  let url = `${process.env.PAYLOAD_API_URL}/${collectionSlug}`;
  const paramString = params.toString();

  if (paramString || where) {
    url += "?";
    if (paramString) url += paramString;
    if (where) {
      url += paramString ? "&" : "";
      url += `where${where}`; // Don't encode this
    }
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.docs;
  } catch (error) {
    console.error(`❌ Failed to fetch ${collectionSlug}:`, error);
    return [];
  }
}
