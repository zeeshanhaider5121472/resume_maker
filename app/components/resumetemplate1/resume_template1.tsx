"use client";

import { useEffect, useState } from "react";
import SummaryTemp1 from "./components/aboutmyself_temp1";
import EducationTemp1 from "./components/education_temp1";
import HeaderTemp1 from "./components/header_temp1";
import LanguagesTemp1 from "./components/languages_temp1";
import PortfolioTemp1 from "./components/Portfolio_temp1";
import SkillsTemp1 from "./components/skills_temp1";
import StrengthsTemp1 from "./components/strengths_temp1";
import WorkerHistoryTemp1 from "./components/workhistory_temp1";

export default function ResumePage({ userData }: { userData?: any }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Calculate zoom level to force desktop view on mobile
  useEffect(() => {
    const calculateZoom = () => {
      const screenWidth = window.innerWidth;
      const targetDesktopWidth = 896; // Tailwind's max-w-4xl in pixels

      // If screen is smaller than the desktop width, scale it down
      if (screenWidth < targetDesktopWidth) {
        // Subtract 32px (16px padding on each side) so it doesn't touch screen edges
        setZoomLevel((screenWidth - 32) / targetDesktopWidth);
      } else {
        setZoomLevel(1);
      }
    };

    calculateZoom();
    window.addEventListener("resize", calculateZoom);
    return () => window.removeEventListener("resize", calculateZoom);
  }, []);

  const handlePrint = () => {
    // TRICK: Temporarily change the document title to the custom filename
    // The browser uses the title as the default PDF filename.
    const originalTitle = document.title;
    if (userData?.filename) {
      document.title = userData.filename;
    }

    window.print();

    // Restore the original title shortly after print dialog opens
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  // Safety check: if userData doesn't exist yet, don't render the template
  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 print:bg-white print:p-0">
      {/* Print Button Section (Moved to top so it's easily clickable on mobile zoom) */}
      <div className="mb-6 print:hidden z-10">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-200"
        >
          Print to PDF
        </button>
      </div>

      <div className="w-full flex justify-center">
        <div
          className="w-[896px] max-w-4xl shadow-lg flex flex-col bg-white print:shadow-none origin-top resume-print-container"
          style={{ zoom: zoomLevel }}
        >
          {/* Pass userData down to your child components safely */}
          <HeaderTemp1 personalinformation={userData.personalinformation} />
          <SummaryTemp1 aboutmyself={userData.aboutmyself} />
          <WorkerHistoryTemp1 workhistory={userData.workexperience} />
          <EducationTemp1 educationhistory={userData.educationhistory} />
          <SkillsTemp1 skillCategories={userData.skillCategories} />
          <LanguagesTemp1 languages={userData.languages} />
          <StrengthsTemp1 strengthCategories={userData.strengths} />
          <PortfolioTemp1 portfoliolink={userData.portfoliolink} />
        </div>
      </div>
    </div>
  );
}
