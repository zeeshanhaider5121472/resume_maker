interface AboutMyself {
  summary: string;
}

interface SummaryTemp1Props {
  aboutmyself: AboutMyself;
}

export default function SummaryTemp1({ aboutmyself }: SummaryTemp1Props) {
  if (!aboutmyself) return null;
  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t border-gray-400 flex flex-col md:flex-row w-full min-h-36">
        <p className="md:w-1/4 px-6 flex uppercase text-[16px] font-bold">
          About Myself
        </p>
        <p className="md:w-2/3 flex text-[16px] font-light">
          {aboutmyself.summary}
        </p>
      </div>
    </div>
  );
}

export function Dividergrey() {
  return (
    <div className="border-gray-500 flex flex-col md:flex-row w-full min-h-2 mt-4">
      <p className="md:w-1/4 flex uppercase font-bold bg-gray-200"></p>
      <p className="md:w-2/3 flex"></p>
    </div>
  );
}
