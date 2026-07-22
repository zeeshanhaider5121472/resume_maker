import { Strengths } from "../../forms/types";
import { Dividergrey } from "./aboutmyself_temp1";

interface StrengthTemp1Props {
  strengthCategories: Strengths[];
}

export default function StrengthsTemp1({
  strengthCategories,
}: StrengthTemp1Props) {
  if (!strengthCategories) return null;
  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t text-[14px] border-gray-500 flex flex-col md:flex-row w-full min-h-36">
        <p className="md:w-1/4 px-6 flex uppercase font-bold">Strengths</p>
        <span className="md:w-2/3 flex flex-col space-y-0">
          {strengthCategories.map((category, index) => (
            <StrengthsCard key={index} category={category} />
          ))}
        </span>
      </div>
    </div>
  );
}

function StrengthsCard({
  category,
}: {
  category: { category: string; skills: string[] };
}) {
  return (
    <div>
      <p className="font-bold pb-2">{category.category}:</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
