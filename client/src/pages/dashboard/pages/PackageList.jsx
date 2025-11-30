import React from "react";

const PackageList = ({ packages, onEdit, onDelete }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Packages List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Sender</th>
              <th className="border p-2">Receiver</th>
              <th className="border p-2">Total Weight</th>
              <th className="border p-2">Piece</th>
              <th className="border p-2">Total Cash</th>
              <th className="border p-2">Transit Way</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="border p-2">{pkg.id}</td>
                <td className="border p-2">{pkg.Sender.name}</td>
                <td className="border p-2">{pkg.Receiver.name}</td>
                <td className="border p-2">{pkg.totalWeight}</td>
                <td className="border p-2">{pkg.piece}</td>
                <td className="border p-2">{pkg.totalCash}</td>
                <td className="border p-2">{pkg.transitWay}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(pkg)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(pkg.id)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {packages.length === 0 && (
          <div className="text-center p-4 text-gray-500">No packages found</div>
        )}
      </div>
    </div>
  );
};

export default PackageList;
