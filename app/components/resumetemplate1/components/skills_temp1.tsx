import { SkillCategory } from "../../forms/types";
import { Dividergrey } from "./aboutmyself_temp1";

interface SkillCardProps {
  skillCategories: SkillCategory[];
}

export default function SkillsTemp1({ skillCategories }: SkillCardProps) {
  if (skillCategories[0].skills.length === 0) return null;

  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t text-[16px] border-gray-400 flex flex-col md:flex-row w-full min-h-36">
        <p className="md:w-1/4 px-6 flex uppercase font-bold">
          Skills & Certifications
        </p>
        <span className="md:w-2/3 flex flex-col space-y-0">
          {skillCategories.map((category, index) => (
            <SkillCard key={index} category={category} />
          ))}
        </span>
      </div>
    </div>
  );
}

function SkillCard({
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
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-[16px]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
