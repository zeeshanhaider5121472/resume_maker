"use client";

import SummaryTemp1 from "./components/aboutmyself_temp1";
import EducationTemp1 from "./components/education_temp1";
import HeaderTemp1 from "./components/header_temp1";
import LanguagesTemp1 from "./components/languages_temp1";
import PortfolioTemp1 from "./components/Portfolio_temp1";
import SkillsTemp1 from "./components/skills_temp1";
import StrengthsTemp1 from "./components/strengths_temp1";
import WorkerHistoryTemp1 from "./components/workhistory_temp1";

export default function ResumePage({ userData }: { userData?: any }) {
  const handlePrint = () => {
    window.print();
  };

  // Safety check: if userData doesn't exist yet, don't render the template
  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col items-center overflow-x-auto p-4 bg-gray-50 print:bg-white print:p-0">
      <div className="w-200 shadow-lg flex flex-col bg-white print:shadow-none">
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

      {/* Print Button Section (Hidden during print) */}
      <div className="mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-200"
        >
          Print to PDF
        </button>
      </div>
    </div>
  );
}
