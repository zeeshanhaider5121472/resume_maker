import { Education } from "../../forms/types";
import { Dividergrey } from "./aboutmyself_temp1";

interface EducationTemp1Props {
  educationhistory: Education[];
}
export default function EducationTemp1({
  educationhistory,
}: EducationTemp1Props) {
  if (!educationhistory) return null;
  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t text-[16px] border-gray-400 flex flex-col md:flex-row w-full min-h-36">
        <p className="md:w-1/4 px-6 flex uppercase font-bold">
          Education History
        </p>
        <span className="md:w-2/3 flex flex-col space-y-4">
          {educationhistory.map((education, index) => (
            <EducationCard key={index} education={education} />
          ))}
        </span>
      </div>
    </div>
  );
}

function EducationCard({
  education,
}: {
  education: { name: string; location: string; degree: string; cgpa: string };
}) {
  return (
    <div className="">
      <span className="flex flex-row">
        <p className="font-bold pr-2">{education.name} </p>
        <p className="font-light font-sans">{education.location}</p>
      </span>
      <span className="flex flex-row">
        <p className="font pr-2">{education.degree}</p>
        <p className="font-light font-sans">{education.cgpa}</p>
      </span>
    </div>
  );
}
