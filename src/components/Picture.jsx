import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Picture() {
  return (
    <>
      <div className="flex justify-center items-center bg-black text-white">
        <img src="src/assets/headshot.jpg" alt="Tony Sun" className="px-10 pb-5 pt-10" />
      </div>
      <div className="flex flex-col items-start justify-center bg-white text-black px-5">
        <h1 className="text-3xl font-bold">Tony Sun</h1>
        <p>BSc Computing Science Student</p>
        <p>University of Alberta</p>
        <div className="flex mt-1 space-x-4">
          <a
            href="https://github.com/tonyinbio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={24} className="text-black hover:text-gray-600" />
          </a>
          <a
            href="mailto:ruotong5+website@ualberta.ca"
            className="text-black hover:text-gray-600"
          >
            <MdEmail size={24} />
          </a>
          <a
            href="https://linkedin.com/in/rtsun1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </>
  );
}

