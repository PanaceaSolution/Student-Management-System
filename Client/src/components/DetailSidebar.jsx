import React from "react";

const DetailSidebar = () => {
  const infoClasses = "flex flex-col gap-[5px] my-5";
  const infoParaClasses =
    "font-[400] text-[10px] leading-[12.1px] text-[#233255CC] uppercase";
  const headingClasses = "font-[500] text-[15px] leading-[18.1px]";
  return (
    <div className="absolute top-[9.125rem] right-[1.5rem] bg-white ps-[1rem] py-[2rem] pe-[2rem]">
      <h2 className="text-start text-xl leading-6 font-[900] text-[#233255CC]">
        Student Details
      </h2>
      <div className="my-6">
        <div className={`${infoClasses} `}>
          <p className={`${infoParaClasses}`}>REF ID</p>
          <h3 className={`${headingClasses}`}>STU432101F</h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>first name</p>
          <h3 className={`${headingClasses} uppercase text-[#233255CC]`}>
            michelle
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>lastname</p>
          <h3 className={`${headingClasses} uppercase text-[#233255CC]`}>
            livingston
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>gender</p>
          <h3 className={`${headingClasses} uppercase text-[#233255CC]`}>
            female
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>Email</p>
          <h3 className={`${headingClasses} text-[#7FBDE4]`}>
            michellelivingston@gmail.com
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>Address</p>
          <h3 className={`${headingClasses} text-[#7FBDE4]`}>
            No.11 tony ave shomolu lagos nigeria
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>department</p>
          <h3 className={`${headingClasses} uppercase text-[#233255CC]`}>
            technology
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>class</p>
          <h3 className={`${headingClasses} uppercase text-[#233255CC]`}>
            SS2
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>date created</p>
          <h3 className={`${headingClasses} uppercase text-[#233255CC]`}>
            25<sup>th</sup> september 2015
          </h3>
        </div>
        <div className={`${infoClasses}`}>
          <p className={`${infoParaClasses}`}>student status</p>
          <h3 className={`${headingClasses} uppercase text-[#84DE88]`}>
            Current
          </h3>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="px-[20px] py-[10px] border-[0.5px] uppercase font-[400] text-[16px] text-[#233255CC] hover:bg-[#233255CC] hover:text-white">
          Edit
        </button>
        <button className="px-[20px] py-[10px] border-[0.5px] border-[#FF0000] uppercase font-[400] text-[16px] text-[#FF0000] hover:bg-[#FF0000] hover:text-white">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DetailSidebar;
