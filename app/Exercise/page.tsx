"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTopic, fetchAllPosts, fetchLang } from "./FetchData";
import FilterLang from "./components/FilterLang";
import FilterTopic from "./components/FilterTopic";
import PostCard from "./components/PostCard";

function Exercise() {
  const [topics, setTopics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [lang, setLang] = useState([]);

  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const topicParam = searchParams.get("topic");

  useEffect(() => {
    async function fetchData() {
      const fetchedTopics = await fetchTopic();
      const fetchedPosts = await fetchAllPosts();
      const fetchedLang = await fetchLang();

      setTopics(fetchedTopics);
      setPosts(fetchedPosts);
      setLang(fetchedLang);
    }
    fetchData();
  }, []);

  // **Filter posts based on search params**
  useEffect(() => {
    let filtered = posts;

    // Filter by Language if langParam exists
    if (langParam) {
      filtered = filtered.filter((post: any) => 
        post.programming_languages?.some((lang: any) => lang.documentId === langParam)
      );
    }
    
    // Filter by Topic if topicParam exists
    if (topicParam) {
      filtered = filtered.filter((post: any) => 
        post.topics?.some((topic: any) => topic.documentId === topicParam)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, langParam, topicParam]); // **Runs when posts or search params change**
  console.log(posts);
  

  return (
    <div className="exercise bg-black text-white min-h-[100vh] flex items-stretch pb-20">
      <div className="ex-page flex pt-[12vh] items-stretch flex-grow">
        <FilterLang lang={lang} />
        <div className="flex flex-col  flex-grow p-3 gap-4 pl-7 md:grid md:grid-cols-2">
          {filteredPosts?.map((post: object, i) => (
            <PostCard key={i} post={{ ...post, index: i }} />
          ))}
        </div>
        <FilterTopic topics={topics} />
      </div>
    </div>
  );
}

export default Exercise;
