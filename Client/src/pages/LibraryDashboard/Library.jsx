import { Users } from "lucide-react";
import React from "react";

const Library = () => {
  return (
    <section className="w-full mx-auto p-1">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-8">
        <div className="lg:col-span-3 grid grid-cols-2 gap-4 lg:row-span-2">
          <div className="rounded-lg bg-white h-48 flex gap-4 justify-center items-center cursor-pointer group">
            <div className="flex flex-col space-y-5">
              <h1 className="text-black font-bold text-lg">12345</h1>
              <p>Toatal Visistors</p>
            </div>
            <div className="bg-[#17A1FA] rounded-full flex justify-center  items-center p-4">
              {" "}
              <Users size={48} strokeWidth={3} className="text-green-800 group-hover:animate-bounce" />
            </div>
          </div>
          <div className="rounded-lg bg-white h-48"></div>
          <div className="rounded-lg bg-white h-48"></div>
          <div className="rounded-lg bg-white h-48"></div>
        </div>
        <div className="rounded-lg bg-white lg:col-span-4 lg:row-span-2">
          helllo
        </div>
      </div>
    </section>
  );
};

export default Library;
