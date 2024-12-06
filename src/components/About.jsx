import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function About() {
  return (
    <>
      <div className="flex justify-center items-start bg-black text-white px-10">
        <p className="text-left">
          Hi! I'm an undergrad CS student
          at the University of Alberta. Right now, I'm really into reinforcement
          learning and BCI devices! Research-wise, I want to see if we can make
          automatically make "good" abstractions of problems. Take a peak below for some of my projects I've made (so far)!
        </p>
      </div>
      <div></div>
    </>
  );
}
