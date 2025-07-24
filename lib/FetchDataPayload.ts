// import qs from "qs";

// export async function fetchCollection(
//   collectionSlug: string,
//   {
//     depth = 1,
//     sort,
//     limit = 100,
//     where,
//   }: {
//     depth?: number;
//     sort?: string;
//     limit?: number;
//     where?: Record<string, any>;
//   } = {},
// ) {
//   const queryObject: Record<string, any> = {
//     depth,
//     limit,
//   };

//   if (sort) queryObject.sort = sort;
//   if (where) queryObject.where = where; // ⬅️ Proper nesting for Payload

//   const queryString = qs.stringify(queryObject, {
//     addQueryPrefix: true,
//     encode: false,
//   });

//   const url = `${process.env.PAYLOAD_API_URL}/${collectionSlug}${queryString.replace(`where=`, `where`)}`;
//   try {
//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//     const data = await res.json();
//     return data.docs;
//   } catch (error) {
//     console.error(`❌ Failed to fetch ${collectionSlug}:`, error);
//     return [];
//   }
// }

import qs from "qs";

export async function fetchCollection(
  collectionSlug: string,
  {
    depth = 1,
    sort,
    limit = 100,
    where,
  }: {
    depth?: number;
    sort?: string;
    limit?: number;
    where?: Record<string, any>;
  } = {},
) {
  const queryObject: Record<string, any> = {};

  if (depth) queryObject.depth = depth;
  if (sort) queryObject.sort = sort;
  if (limit) queryObject.limit = limit;
  if (where) queryObject.where = JSON.stringify(where);

  const queryString = qs.stringify(queryObject, {
    addQueryPrefix: true,
    encode: false,
  });

  // Use absolute URL in the browser
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const url = `${baseUrl}/api/payload/${collectionSlug}${queryString}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const languages = await res.json();
    return languages;
  } catch (error) {
    console.error(`❌ Failed to fetch ${collectionSlug}:`, error);
    return [];
  }
}
