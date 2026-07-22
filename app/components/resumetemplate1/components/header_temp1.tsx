import { PersonalInfo } from "../../forms/types";

interface HeaderTemp1Props {
  personalinformation: PersonalInfo;
}

export default function HeaderTemp1({ personalinformation }: HeaderTemp1Props) {
  if (!personalinformation) return null;

  return (
    <div className="flex flex-col">
      <header className="flex flex-col md:flex-row w-full min-h-20 pt-6">
        <span className="md:w-1/4"></span>
        <span className="md:w-2/3 flex flex-col">
          <p className="text-3xl uppercase tracking-[3px]">
            {personalinformation.name}
          </p>
          <span className="flex flex-row text-[12px]">
            <p>{personalinformation.contact}</p>
            <p className="mx-3">|</p>
            <p>{personalinformation.email}</p>
            <p className="mx-3">|</p>
            <p>{personalinformation.address}</p>
          </span>
        </span>
      </header>
    </div>
  );
}

// import dbData from "../../../../data/db.json";
// export default function HeaderTemp1() {
//   const personalinformation = dbData.personalinformation;
//   if (!personalinformation) return null;
//   return (
//     <div className="flex flex-col">
//       <header className="flex flex-col md:flex-row w-full min-h-20">
//         <span className="md:w-1/4"></span>
//         <span className="md:w-2/3 flex flex-col">
//           <p className="text-3xl uppercase tracking-[3px]">
//             {personalinformation.name}
//           </p>
//           <span className="flex flex-row text-[12px]">
//             <p>{personalinformation.contact}</p>
//             <p className="mx-3">|</p>
//             <p>{personalinformation.email}</p>
//             <p className="mx-3">|</p>
//             <p>{personalinformation.address}</p>
//           </span>
//         </span>
//       </header>
//     </div>
//   );
// }

{
  /* <div className="mb-6">
  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
    <img
      src="/images//profile.jpg"
      alt="Profile"
      className="w-full h-full object-cover"
    />
  </div>
</div> */
}
