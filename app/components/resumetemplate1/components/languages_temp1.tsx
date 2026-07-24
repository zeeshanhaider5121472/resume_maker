import { UserLanguage } from "../../forms/types";
import { Dividergrey } from "./aboutmyself_temp1";

interface Language {
  languages: UserLanguage[];
}

export default function LanguagesTemp1({ languages }: Language) {
  if (!languages) return null;
  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t text-[16px] border-gray-400 flex flex-col md:flex-row w-full min-h">
        <p className="md:w-1/4 px-6 flex uppercase font-bold">Languages</p>
        <span className="md:w-2/3 flex flex-col space-y-4">
          {languages.map((langage, index) => (
            <LanguagesCard
              key={index}
              name={langage.name}
              level={langage.level}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function LanguagesCard({ name, level }: { name: string; level: string }) {
  return (
    <div className="flex">
      <p className="font-bold pr-2">{name}: </p>
      <p className="font-light font-sans">{level}</p>
    </div>
  );
}
