import { User } from "../../forms/types";
import { Dividergrey } from "./aboutmyself_temp1";

interface PortfolioTemp1Props {
  portfoliolink: User["portfoliolink"];
}

export default function PortfolioTemp1({ portfoliolink }: PortfolioTemp1Props) {
  if (!portfoliolink) return null;

  return (
    <div className="flex flex-col">
      <Dividergrey />
      <div className="py-4 border-t text-[16px] border-gray-400  flex flex-col md:flex-row w-full min-h-18">
        <p className="md:w-1/4 px-6 flex uppercase font-bold ">Portfolio</p>
        <span className="md:w-2/3 flex flex-row w-full justify-between items-start ">
          <a
            href={portfoliolink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {portfoliolink}
          </a>
          {/* <img
            src="/images/portfolio.png"
            alt="Portfolio"
            className="h-auto rounded-lg shadow-md"
            width={100}
            height={100}
          /> */}
        </span>
      </div>
    </div>
  );
}
