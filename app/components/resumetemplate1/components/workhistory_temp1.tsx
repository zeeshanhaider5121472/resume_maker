import { WorkExp } from "../../forms/types";
import { Dividergrey } from "./aboutmyself_temp1";

interface WorkHistoryTemp1Props {
  workhistory: WorkExp[];
}

export default function WorkerHistoryTemp1({
  workhistory,
}: WorkHistoryTemp1Props) {
  if (!workhistory) return null;
  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t text-[14px] border-gray-500 flex flex-col md:flex-row w-full min-h-36">
        <p className="md:w-1/4 px-6 flex uppercase font-bold">
          Work Experience
        </p>
        <span className="md:w-2/3 flex flex-col space-y-4">
          {workhistory.map((work, index) => (
            <ExperienceCard key={index} workhistory={work} />
          ))}
        </span>
      </div>
    </div>
  );
}

function ExperienceCard({
  workhistory,
}: {
  workhistory: {
    company: string;
    role: string;
    duration: string;
    location: string;
    responsibilities: string[];
  };
}) {
  return (
    <div className="">
      <span className="flex flex-row items-center">
        <p className="font-bold pr-2">{workhistory.role}</p>
        <p className="font-light font-sans text-xs">{workhistory.duration}</p>
      </span>
      <span className="flex flex-row">
        <p className="font-bold pr-2">{workhistory.company}</p>
        <p className="font-light font-sans">{workhistory.location}</p>
      </span>
      <span className="flex flex-row">
        <ul className="list-disc pl-5 font-normal font-sans marker:font-bold marker:text-[17px] space-y-0 leading-tight">
          {workhistory.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </span>
    </div>
  );
}
