import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function TransitWayManager() {
  const [transitWays, setTransitWays] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);


const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Fetch All TransitWays
  const fetchTransitWays = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/transitWay`);
      setTransitWays(res.data);
    } catch (err) {
      console.error("Error fetching TransitWays:", err);
    }
  };

  useEffect(() => {
    fetchTransitWays();
  }, []);

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire("Error", "Name field cannot be empty", "error");
      return;
    }

    try {
      if (editId) {
        await axios.patch(`${BASE_URL}/transitWay/${editId}`, { name });
        Swal.fire("Updated!", "Transit Way updated successfully", "success");
      } else {
        await axios.post(`${BASE_URL}/transitWay`, { name });
        Swal.fire("Created!", "New Transit Way added", "success");
      }

      setName("");
      setEditId(null);
      fetchTransitWays();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // Edit button
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/transitWay${id}`);
        Swal.fire("Deleted!", "Transit Way removed successfully", "success");
        fetchTransitWays();
      } catch (err) {
        Swal.fire("Error", "Could not delete the record", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        مدیریت طریق ترانزیت
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-5 rounded-2xl mb-6 space-y-5"
      >
        <div className="relative">
          <input
            type="text"
            className="peer w-full border border-gray-400 rounded-xl px-3 py-3 
        focus:outline-none focus:border-blue-500 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
          />

          <label
            className="absolute text-gray-700 left-3 top-3 transition-all 
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
        peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 
        bg-white px-1"
          >
            نام طریق ترانزیت
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
      text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {editId ? "بروزرسانی طریق ترانزیت" : "اضافه کردن طریق ترانزیت"}
        </button>
      </form>

      {/* List */}
      <div className="bg-white shadow-lg rounded-2xl p-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          لست طریق‌های ترانزیت
        </h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="py-2 px-3">آی‌دی</th>
              <th className="py-2 px-3">نام</th>
              <th className="py-2 px-3">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {transitWays.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-2 px-3">{item.id}</td>
                <td className="py-2 px-3">{item.name}</td>

                <td className="py-2 px-3 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 px-4 py-1.5 rounded-lg text-white 
                shadow hover:bg-yellow-600 transition"
                  >
                    ویرایش
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 px-4 py-1.5 rounded-lg text-white 
                shadow hover:bg-red-700 transition"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transitWays.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            هیچ ریکاردی موجود نیست.
          </p>
        )}
      </div>
    </div>
  );
}
