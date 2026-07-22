import Dashboard from "./components/dashboard";

// export const revalidate = 0;
export default async function Home() {
  return (
    <main className="min-h-screen">
      {/*<main className="bg-white"> */}
      {/* <div className="max-w-5xl mx-auto mt-4 pl-5 pr-5"> */}
      <Dashboard />
      {/* </div> */}
    </main>
  );
}
