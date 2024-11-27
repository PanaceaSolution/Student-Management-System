import { Separator } from "@/components/ui/separator";
import { UsersRound } from "lucide-react";
import React from "react";

const info = [
  {
    id: 1,
    name: "Students",
    icon: UsersRound,
    color: "text-green-600",
    count: 50,
  },
  {
    id: 2,
    name: "Teachers",
    icon: UsersRound,
    color: "text-blue-600",
    count: 50,
  },
  {
    id: 3,
    name: "Parents",
    icon: UsersRound,
    color: "text-yellow-600",
    count: 50,
  },
  {
    id: 4,
    name: "Staffs",
    icon: UsersRound,
    color: "text-red-600",
    count: 50,
  }
]

const Info = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {info.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="h-28 rounded-sm bg-white flex justify-center items-center gap-4 cursor-pointer shadow-md py-4"
          >
            <div className="px-5 flex flex-col gap-4 justify-center items-center">
              <Icon className={`${item.color} h-10 w-10`} />
              <p className="text-black uppercase font-bold text-sm">{item.name}</p>
            </div>
            <Separator orientation="vertical" />
            <div className="p-5">
              <h1 className="font-semibold text-lg text-black">{item.count}</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Info;
