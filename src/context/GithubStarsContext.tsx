import React, { createContext, useState, useEffect, useContext } from "react";

const GithubStarsContext = createContext<string>("1.2K");

export const GithubStarsProvider = ({ children }: { children: React.ReactNode }) => {
  const [stars, setStars] = useState<string>("1.2K");

  useEffect(() => {
    fetch("https://api.github.com/repos/GramosoftAI/GcrawlAI")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          const count = data.stargazers_count;
          if (count >= 1000) {
            setStars((count / 1000).toFixed(1) + "K");
          } else {
            setStars(count.toString());
          }
        }
      })
      .catch((err) => console.error("Error fetching github stars:", err));
  }, [stars]);

  return (
    <GithubStarsContext.Provider value={stars}>
      {children}
    </GithubStarsContext.Provider>
  );
};

export const useGithubStars = () => useContext(GithubStarsContext);
