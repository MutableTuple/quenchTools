import React from "react";

const FeaturesCard = ({ message, title }) => {
  return (
    <div className=" text-center border text-stone-50 bg-blue-500 h-40 flex items-center justify-center flex-col gap-4 rounded-lg shadow-sm">
      <p className="font-semibold ">{message}</p>
      <h1 className="text-xl font-black ">{title}</h1>
    </div>
  );
};

export default FeaturesCard;
