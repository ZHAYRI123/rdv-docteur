import React from 'react';

export default function TableCard(props) {
  return (
    <tr className='hover:bg-purple-100 transition-colors duration-200'>
      <td className='w-[10%] px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {props.sr}
      </td>
      <td className='w-[30%] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
        {props.name}
      </td>
      <td className='w-[30%] px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {props.specialisation}
      </td>
      <td className='w-[30%] px-6 py-4 break-words text-sm text-gray-900'>
        {props.symptoms}
      </td>
    </tr>
  );
}