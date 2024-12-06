import React from "react";

export default function ProjectProsthetic() {
  return (
    <>
      <div className="flex flex-col justify-left items-start bg-black text-white px-10 pt-5">
        <div className="w-full border-t-2 border-white mb-4"></div>

        <ul className="marker:text-white list-disc text-left pl-4">
          <li>
            <strong>
              A system for controlling a prosthetic (leg) based on EMG data!
            </strong>
          </li>
          <li>Made for the Bionix club at the UofA.</li>
          <li>
            Based off{" "}
            <a
              href="https://doi.org/10.1038/s41591-024-02994-9"
              className="text-blue-400"
            >
              this paper
            </a>
            .
          </li>
        </ul>
      </div>
      <div className="flex items-start bg-white text-black pt-10 px-5">
        <a
          href="https://github.com/albertabionix/newMemberMNEproject"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <h1 className="text-3xl font-bold relative z-10">
            EMG Prosthetic Leg
          </h1>
          {/* https://birdeatsbug.com/blog/creating-hover-effects-with-tailwind-css */}
          <span className="absolute -bottom-1 left-0 w-7 h-2 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
      </div>
    </>
  );
}
