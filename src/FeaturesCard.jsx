import React from "react";

const FeaturesCard = ({ message, title }) => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 text-center to-blue-500 h-40 flex items-center justify-center flex-col gap-4 rounded-lg shadow-md">
      <p className="font-semibold text-stone-50">{message}</p>
      <h1 className="text-xl font-black text-stone-50">{title}</h1>
    </div>
  );
};

export default FeaturesCard;
