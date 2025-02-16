import HomeFeature from "@/components/page components/home page/HomeFeature";
import HomeHero from "@/components/page components/home page/HomeHero";
import TeamCollaboration from "@/components/page components/home page/TeamCollaboration";
import React from "react";

const page = () => {
  return (
    <div>
      <HomeHero />
      <HomeFeature />
      <TeamCollaboration />
    </div>
  );
};

export default page;
