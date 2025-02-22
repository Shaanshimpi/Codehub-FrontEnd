// Common headers to avoid repetition
const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_AUTH}`,
  "Content-Type": "application/json",
};
const apiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export const fetchTopic = async () => {
  try {
    console.log("fetching topic...");
    console.log(apiURL);
    const response = await fetch(`${apiURL}topics?populate=*`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data:`, response.status, errorText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    return json?.data;
  } catch (error: any) {
    console.error(`Fetch error:`, error.message);
    return null;
  }
};

export const fetchLang = async () => {
  try {
    const response = await fetch(`${apiURL}programming-languages?populate=*`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data:`, response.status, errorText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    return json?.data;
  } catch (error: any) {
    console.error(`Fetch error:`, error.message);
    return null;
  }
};

export const fetchAllPosts = async () => {
  try {
    const response = await fetch(`${apiURL}posts?populate=*`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data:`, response.status, errorText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    return json?.data;
  } catch (error: any) {
    console.error(`Fetch error:`, error.message);
    return null;
  }
};

export const fetchSinglePost = async (id: string) => {
  try {
    const response = await fetch(`${apiURL}posts/${id}?populate=*`, {
      headers: {
        ...headers,
        Authorization: `Bearer YOUR_TOKEN_HERE`, // You might want to fix this token
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data:`, response.status, errorText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    return json?.data;
  } catch (error: any) {
    console.error("Fetch error:", error.message);
    return null;
  }
};
