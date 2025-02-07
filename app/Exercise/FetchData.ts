// Common headers to avoid repetition
const headers = {
    Authorization: `Bearer 0aec2b2fad042f23909e52f0d6f37e5d52e00aeed2797b550576a360d8b0cc8a6ca8f9de267f4f8758a8e5957fb6ad7696b0f7c6f38805e6b12c126247a0ef7808d43513737bf8d9ef34910f0fd18ed79d43a2a908e95dcc13cfa6247211b7e3dd4e8f3c1c199b05c342df84eaba72992eeaff07bf56e9c4a1e82461b8d6281f`,
    "Content-Type": "application/json",
};

export const fetchTopic = async () => {
    try {
        const response = await fetch("https://codehub-exercise-2.onrender.com/api/topics?populate=*", {
            headers,
            next: { revalidate: 60 }  // Cache for 60 seconds
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch data:", response.status, errorText);
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();
        return json?.data;
    } catch (error: any) {
        console.error("Fetch error:", error.message);
        return null;
    }
};

export const fetchLang = async () => {
    try {
        const response = await fetch("https://codehub-exercise-2.onrender.com/api/programming-languages?populate=*", {
            headers,
            next: { revalidate: 60 }  // Cache for 60 seconds
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch data:", response.status, errorText);
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();
        return json?.data;
    } catch (error: any) {
        console.error("Fetch error:", error.message);
        return null;
    }
};

export const fetchAllPosts = async () => {
    try {
        const response = await fetch("https://codehub-exercise-2.onrender.com/api/posts?populate=*", {
            headers,
            next: { revalidate: 60 }  // Cache for 60 seconds
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch data:", response.status, errorText);
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();
        return json?.data;
    } catch (error: any) {
        console.error("Fetch error:", error.message);
        return null;
    }
};

export const fetchSinglePost = async (id: string) => {
    try {
        const response = await fetch(`https://codehub-exercise-2.onrender.com/api/posts/${id}?populate=*`, {
            headers: {
                ...headers,
                Authorization: `Bearer YOUR_TOKEN_HERE`,  // You might want to fix this token
            },
            next: { revalidate: 60 }  // Cache for 60 seconds
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch data:", response.status, errorText);
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const json = await response.json();
        return json?.data;
    } catch (error: any) {
        console.error("Fetch error:", error.message);
        return null;
    }
};