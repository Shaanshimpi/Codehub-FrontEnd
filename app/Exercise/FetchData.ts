// Common headers to avoid repetition
const headers = {
  Authorization: `Bearer 3ba2ba597a98422664409dd367a9893caaf9aaaf6ed2e68ddf502e4caeb52ce0e23a425fc9fa753a7c091f06f91c509ab87dfb25afd26d19145f347eb5127302c5243166f05af738597bbc5704fd6a73f7f9446d70598d876fe974176602d960d7a8c22453c3fbb4e743d684bf48699f1ca93ed3ee350e8e41f1ed7b33594f2b`,
  "Content-Type": "application/json",
}
const apiURL = `https://codehub-exercise-2-production.up.railway.app/`
export const fetchTopic = async () => {
  try {
    const response = await fetch(`${apiURL}topics?populate=*`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch data:`, response.status, errorText)
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const json = await response.json()
    return json?.data
  } catch (error: any) {
    console.error(`Fetch error:`, error.message)
    return null
  }
}

export const fetchLang = async () => {
  try {
    const response = await fetch(`${apiURL}programming-languages?populate=*`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch data:`, response.status, errorText)
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const json = await response.json()
    return json?.data
  } catch (error: any) {
    console.error(`Fetch error:`, error.message)
    return null
  }
}

export const fetchAllPosts = async () => {
  try {
    const response = await fetch(`${apiURL}posts?populate=*`, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch data:`, response.status, errorText)
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const json = await response.json()
    return json?.data
  } catch (error: any) {
    console.error(`Fetch error:`, error.message)
    return null
  }
}

export const fetchSinglePost = async (id: string) => {
  try {
    const response = await fetch(`${apiURL}posts/${id}?populate=*`, {
      headers: {
        ...headers,
        Authorization: `Bearer YOUR_TOKEN_HERE`, // You might want to fix this token
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch data:`, response.status, errorText)
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const json = await response.json()
    return json?.data
  } catch (error: any) {
    console.error("Fetch error:", error.message)
    return null
  }
}
