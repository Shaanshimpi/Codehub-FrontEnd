// Common headers to avoid repetition
const headers = {
  Authorization: `Bearer 4157da6744daedf6f854e78b19fc256ef6c3ce21ebc919544609075fc63560d51d496960c593273d8c059eda187d2ae9c3d5f3a5246be560d836d0a6fa9e6ca6ebadeade1caca4c7ce9906f074215a6c4feed350172958a2d590c4bf0cd0c2090574ab76b2d8842afa0e3486e0978c7776584ee003fabe3b8bb049ab5e246cc6`,
  "Content-Type": "application/json",
}
const apiURL = `https://codehub-exercise-2-production.up.railway.app/api/`
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
