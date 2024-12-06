import React from "react";

export default function ProjectChatbot() {
  return (
    <>
      <div className="flex flex-col justify-left items-start bg-black text-white px-10 pt-5">
        <div className="w-full border-t-2 border-white mb-4"></div>

        <ul className="marker:text-white list-disc text-left pl-4">
          <li>A web app for a custom chatbot specialized in the biomedical field!</li>
          <li>Uses retrieval augmented generation based on a knowledge graph.</li>
          <li>Data extracted from PubMed papers.</li>
          <li>Made with: Chainlit, Neo4j, Ollama, Docker.</li>
        </ul>
      </div>
      <div className="flex items-start bg-white text-black pt-10 px-5">
        <a
          href="https://github.com/TonyinBio/bio-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <h1 className="text-3xl font-bold relative z-10">
            Biomedical Chatbot
          </h1>
          {/* https://birdeatsbug.com/blog/creating-hover-effects-with-tailwind-css */}
          <span className="absolute -bottom-1 left-0 w-7 h-2 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
      </div>
    </>
  );
}
