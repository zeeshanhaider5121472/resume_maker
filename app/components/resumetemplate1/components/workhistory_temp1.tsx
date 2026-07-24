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
      <div className="py-4 border-t text-[16px] border-gray-400 flex flex-col md:flex-row w-full min-h-36">
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
        <p className="font-light font-sans text-[16px] pt-0.5">
          {workhistory.duration}
        </p>
      </span>
      <span className="flex flex-row">
        <p className="font-bold pr-2">{workhistory.company}</p>
        <p className="font-light font-sans">{workhistory.location}</p>
      </span>
      <span className="flex flex-row">
        <ul className="list-disc pl-5 text-md marker:font-bold marker:text-lg space-y-1 leading-snug">
          {workhistory.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </span>
    </div>
  );
}
