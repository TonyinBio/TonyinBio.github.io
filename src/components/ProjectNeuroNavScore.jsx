import React from "react";

export default function ProjectNeuroNavScore() {
  return (
    <>
      <div className="flex flex-col justify-left items-start bg-black text-white px-10 pt-5">
        <div className="w-full border-t-2 border-white mb-4"></div>

        <ul className="marker:text-white list-disc text-left pl-4">
          <li>
            <strong>
              A desktop app for screening Alzheimer's disease using EEG data
              while navigating a maze.
            </strong>
          </li>
          <li>
            Components are a VR maze game and a desktop app for clinicians
          </li>
          <li>1st place at the 2024 natHacks hackathon!!!</li>
        </ul>
      </div>
      <div className="flex items-start bg-white text-black pt-10 px-5">
        <a
          href="https://devpost.com/software/neuronavscore"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <h1 className="text-3xl font-bold relative z-10">
            Alzheimer's Screening
          </h1>
          {/* https://birdeatsbug.com/blog/creating-hover-effects-with-tailwind-css */}
          <span className="absolute -bottom-1 left-0 w-7 h-2 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
      </div>
    </>
  );
}
