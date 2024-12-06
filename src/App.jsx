import { useState } from "react";
import About from "./components/About";
import Picture from "./components/Picture";
import ProjectChatbot from "./components/ProjectChatbot";
import ProjectProsthetic from "./components/ProjectProsthetic";
import ProjectCourseGraph from "./components/ProjectCourseGraph";
import ProjectImageegine from "./components/ProjectImageegine";
import ProjectNeuroNavScore from "./components/ProjectNeuroNavScore";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/course-graph"
          element={
            <iframe
              src="courseGraph.html"
              title="Course Graph"
              style={{
                width: "100%",
                height: "100vh",
                border: "none",
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="flex justify-center min-w-screen">
      <div className="grid grid-cols-[1fr,1fr] h-screen text-white max-w-5xl">
        {/* <CourseGraph /> */}
        <Picture />
        <About />
        <ProjectProsthetic />
        <ProjectNeuroNavScore />
        <ProjectChatbot />
        <ProjectCourseGraph />
        <ProjectImageegine />
      </div>
    </div>
  );
}

export default App;
