import React from "react";
export default function ProjectImageegine() {
  return (
    <>
      <div className="flex flex-col justify-left items-start bg-black text-white px-10 py-5">
        <div className="w-full border-t-2 border-white mb-4"></div>

        <ul className="marker:text-white list-disc text-left pl-4">
          <li>
            <strong>
              An ML model for predicting what someone is looking at based off
              their brain waves!
            </strong>
          </li>
          <li>3rd place at the 2023 natHacks hackathon.</li>
        </ul>
      </div>
      <div className="flex items-start bg-white text-black pt-10 px-5">
        <a
          href="https://devpost.com/software/the-see-it"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <h1 className="text-3xl font-bold relative z-10">
            EEG Vision Predictor
          </h1>
          {/* https://birdeatsbug.com/blog/creating-hover-effects-with-tailwind-css */}
          <span className="absolute -bottom-1 left-0 w-7 h-2 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
      </div>
    </>
  );
}
