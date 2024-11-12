import { Banknote, User, UsersRound } from "lucide-react";
import React from "react";

const Info = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
      <div className="h-28 rounded-sm bg-white flex justify-evenly items-center gap-4 cursor-pointer">
        <div className="border-r-2 px-5 flex flex-col gap-4 justify-center items-center ">
          <UsersRound className="text-green-600 h-10 w-10" />
          <p className="text-black uppercase font-bold text-sm "> Students</p>
        </div>
        <div className="p-5">
          <h1 className="font-semibold  text-lg text-black">50,000</h1>
        </div>
      </div>
      <div className="h-28 rounded-sm bg-white flex justify-evenly items-center gap-4 cursor-pointer">
        <div className="border-r-2 px-5 flex flex-col gap-4 justify-center items-center ">
          <UsersRound className="text-blue-600 h-10 w-10" />
          <p className="text-black uppercase font-bold text-sm "> Teachers</p>
        </div>
        <div className="p-5">
          <h1 className="font-semibold  text-lg text-black">50,000</h1>
        </div>
      </div>
      <div className="h-28 rounded-sm bg-white flex justify-evenly items-center gap-4 cursor-pointer">
        <div className="border-r-2 px-5 flex flex-col gap-4 justify-center items-center ">
          <UsersRound className="text-yellow-400 h-10 w-10" />
          <p className="text-black uppercase font-bold text-sm "> Parents</p>
        </div>
        <div className="p-5">
          <h1 className="font-semibold  text-lg text-black">50,000</h1>
        </div>
      </div>
      <div className="h-28 rounded-sm bg-white flex justify-evenly items-center gap-4 cursor-pointer">
        <div className="border-r-2 px-5 flex flex-col gap-4 justify-center items-center ">
          <Banknote className="text-green-600 h-10 w-10" />
          <p className="text-black uppercase font-bold text-sm "> Earnings</p>
        </div>
        <div className="p-5">
          <h1 className="font-semibold  text-lg text-black">50,000</h1>
        </div>
      </div>
    </div>
  );
};

export default Info;
