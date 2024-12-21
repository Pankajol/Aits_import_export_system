import React from 'react';

const Table = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available.</p>;

  // Dynamically extract column headers from the first row of data
  const columns = Object.keys(data[0]);
   console.log(columns)
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className="py-2 px-4 border-b bg-blue-500 text-teal-50 capitalize">
              {column.replace(/([A-Z])/g, ' $1')} {/* Add space between camelCase */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row._id || index}>
            {columns.map((column) => (
              <td key={column} className="py-2 px-4 border-b">
                {row[column]}
                
              </td>
              
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
};

export default Table;
// import React, { useState } from "react";

// const FilterableTable = ({ columns, data }) => {
//   const [filter, setFilter] = useState(""); // State for the filter

//   // Filtered data based on the input value
//   const filteredData = data.filter((row) =>
//     columns.some((column) =>
//       String(row[column]) // Convert to string in case of non-string values
//         .toLowerCase()
//         .includes(filter.toLowerCase())
//     )
//   );

//   return (
//     <div className="p-4">
//       {/* Filter Input */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Filter..."
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
//         />
//       </div>

//       {/* Responsive Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-300">
//           <thead>
//             <tr>
//               {columns.map((column) => (
//                 <th key={column} className="py-2 px-4 border-b capitalize">
//                   {column.replace(/([A-Z])/g, " $1")}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((row, index) => (
//                 <tr key={row._id || index}>
//                   {columns.map((column) => (
//                     <td key={column} className="py-2 px-4 border-b">
//                       {row[column]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="py-4 text-center text-gray-500"
//                 >
//                   No matching results.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FilterableTable;
