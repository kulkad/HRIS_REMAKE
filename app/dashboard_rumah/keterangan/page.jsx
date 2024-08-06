import React from "react";

const Card = ({ photo, name, status }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={photo} alt={name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">{status}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const data = [
    {
      photo: "https://via.placeholder.com/150",
      name: "John Doe",
      status: "Hadir",
    },
    {
      photo: "https://via.placeholder.com/150",
      name: "Jane Smith",
      status: "Tidak Hadir",
    },
  ];

  return (
    <div className="flex flex-wrap">
      {data.map((item, index) => (
        <Card
          key={index}
          photo={item.photo}
          name={item.name}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default Dashboard;
