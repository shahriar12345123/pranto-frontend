import React from 'react';

export const ProductSpecsTable = ({ specifications = [] }) => {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-slate-100">
          {specifications.map((spec, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}
            >
              <td className="py-3 px-4 font-semibold text-slate-700 w-1/3 sm:w-1/4">
                {spec.key}
              </td>
              <td className="py-3 px-4 text-slate-600">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
