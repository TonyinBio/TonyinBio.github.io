import React from "react";

export default function ProjectCourseGraph() {
  return (
    <>
      <div className="flex flex-col justify-left items-start bg-black text-white px-10 pt-5">
        <div className="w-full border-t-2 border-white mb-4"></div>

        <ul className="marker:text-white list-disc text-left pl-4">
          <li>
            <strong>
              A web app for visualizing course relationships at the UofA!
            </strong>
          </li>
          <li>
            Great for answering the question: "what can I do with x course?"
          </li>
          <li>
            Data webscraped using BeautifulSoup4.{" "}
            <a
              href="https://github.com/TonyinBio/Course-Webscraper"
              className="text-blue-400"
            >
              (source)
            </a>
          </li>
          <li>Made with: vanilla JS, HTML, CSS.</li>
        </ul>
      </div>
      <div className="flex items-start bg-white text-black pt-10 px-5">
        <a
          href="/#/course-graph"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <h1 className="text-3xl font-bold relative z-10">Course Graph</h1>
          {/* https://birdeatsbug.com/blog/creating-hover-effects-with-tailwind-css */}
          <span className="absolute -bottom-1 left-0 w-7 h-2 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
      </div>
    </>
  );
}
