import { fetchCollection } from "@/lib/FetchDataPayload"

export default async function Page() {
  const languages = await fetchCollection("programming-languages", {
    sort: "index",
  })
  const tutorials = await fetchCollection("tutorials")
  //   const exercises = await fetchCollection('exercises');
  //   const media = await fetchCollection('media');
  //   const users = await fetchCollection('users');

  return (
    <div>
      <h1>Fetched Data</h1>
      <h2>Languages</h2>
      <ul>
        {languages.map((l: any) => (
          <li key={l.id}>{l.title}</li>
        ))}
      </ul>

      <h2>Tutorials</h2>
      <ul>
        {tutorials.map((t: any) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  )
}
