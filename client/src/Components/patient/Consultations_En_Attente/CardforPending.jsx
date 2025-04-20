import React from "react";

export default function TableCard(props) {
  return (
    <>
      <tr className="border-b hover:bg-gray-100">
        <td className="whitespace-nowrap px-6 py-4 font-medium ">{props.sr}</td>
        <td className="whitespace-nowrap px-6 py-4 font-normal">{props.name}</td>
        <td className="whitespace-nowrap px-6 py-4 font-normal">{props.specialisation}</td>
        <td className="whitespace-nowrap px-6 py-4 font-normal">{props.clinic}</td>
        <td className="whitespace-nowrap px-6 py-4 font-normal">{props.location}</td>
        <td className="whitespace-nowrap px-6 py-4 font-normal">{props.symptoms}</td>
      </tr>
    </>
  );
}