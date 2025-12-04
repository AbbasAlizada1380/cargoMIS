import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit3, Trash2, PlusCircle, CheckCircle, XCircle, List } from "lucide-react";

export default function TransitWayManager() {
  const [transitWays, setTransitWays] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch All TransitWays
  const fetchTransitWays = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/transitWay`);
      setTransitWays(res.data);
    } catch (err) {
      console.error("Error fetching TransitWays:", err);
      Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'در دریافت اطلاعات مشکل پیش آمد',
        confirmButtonText: 'باشه',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransitWays();
  }, []);

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'نام طریق ترانزیت نمی‌تواند خالی باشد',
        confirmButtonText: 'باشه',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editId) {
        await axios.patch(`${BASE_URL}/transitWay/${editId}`, { name });
        Swal.fire({
          icon: 'success',
          title: 'موفقیت',
          text: 'طریق ترانزیت با موفقیت بروزرسانی شد',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#10b981',
        });
      } else {
        await axios.post(`${BASE_URL}/transitWay`, { name });
        Swal.fire({
          icon: 'success',
          title: 'موفقیت',
          text: 'طریق ترانزیت جدید اضافه شد',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#10b981',
        });
      }

      setName("");
      setEditId(null);
      fetchTransitWays();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: err.response?.data?.message || 'مشکلی پیش آمد',
        confirmButtonText: 'باشه',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit button
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    // Smooth scroll to form
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: "این عمل قابل بازگشت نیست!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف شود',
      cancelButtonText: 'لغو',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      background: '#f8fafc',
      customClass: {
        title: 'font-bold text-lg',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/transitWay/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'حذف شد!',
          text: 'طریق ترانزیت با موفقیت حذف شد',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#10b981',
        });
        fetchTransitWays();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'خطا',
          text: 'حذف انجام نشد',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <List className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            مدیریت طریق‌های ترانزیت
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            در این بخش می‌توانید طریق‌های ترانزیت را مدیریت، اضافه، ویرایش و حذف نمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <div id="form-section" className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="flex items-center mb-6">
                <div className={`p-2 rounded-lg ${editId ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                  {editId ? <Edit3 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mr-3">
                  {editId ? 'ویرایش طریق ترانزیت' : 'اضافه کردن طریق ترانزیت'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl 
                    focus:outline-none focus:border-blue-500 focus:bg-white 
                    transition-all duration-300 text-gray-800 placeholder-transparent
                    hover:border-gray-300 peer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="نام طریق ترانزیت"
                    id="transit-name"
                  />
                  <label
                    htmlFor="transit-name"
                    className="absolute right-3 top-3 px-2 bg-white text-gray-500 
                    transition-all duration-300 transform -translate-y-6 scale-90 
                    origin-top-right peer-placeholder-shown:translate-y-0 
                    peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 
                    peer-focus:scale-90 peer-focus:text-blue-600 pointer-events-none"
                  >
                    نام طریق ترانزیت
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 
                    ${editId 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    } 
                    text-white py-3 px-4 rounded-xl font-semibold 
                    transition-all duration-300 transform hover:-translate-y-0.5 
                    active:translate-y-0 shadow-lg hover:shadow-xl 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : editId ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        بروزرسانی
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        ایجاد جدید
                      </>
                    )}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-4 py-3 
                      bg-gradient-to-r from-gray-500 to-gray-600 text-white 
                      rounded-xl font-semibold transition-all duration-300 
                      hover:from-gray-600 hover:to-gray-700 
                      transform hover:-translate-y-0.5 active:translate-y-0 
                      shadow-lg hover:shadow-xl disabled:opacity-50 
                      disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <XCircle className="w-5 h-5" />
                      لغو
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <List className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        طریق‌های ترانزیت
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        مجموع: {transitWays.length} مورد
                      </p>
                    </div>
                  </div>
                  {isLoading && (
                    <div className="flex items-center text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm font-medium">در حال بارگذاری...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-right font-semibold text-gray-700 border-b border-gray-200 min-w-[120px]">
                        آی‌دی
                      </th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700 border-b border-gray-200 min-w-[200px]">
                        نام طریق ترانزیت
                      </th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700 border-b border-gray-200 min-w-[180px]">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transitWays.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`transition-all duration-300 hover:bg-gray-50
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="py-4 px-6 border-b border-gray-200">
                          <span className="inline-flex items-center justify-center w-10 h-10 
                          bg-gradient-to-r from-blue-100 to-indigo-100 
                          text-blue-700 font-bold rounded-lg">
                            {item.id}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-3"></div>
                            <span className="text-gray-800 font-medium">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 
                              text-white rounded-lg font-medium transition-all duration-300 
                              transform hover:-translate-y-0.5 active:translate-y-0 
                              shadow-md hover:shadow-lg hover:from-yellow-600 hover:to-amber-600"
                            >
                              <Edit3 className="w-4 h-4" />
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 
                              text-white rounded-lg font-medium transition-all duration-300 
                              transform hover:-translate-y-0.5 active:translate-y-0 
                              shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {transitWays.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center 
                    bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                      <List className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      موردی یافت نشد
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      هنوز طریق ترانزیتی اضافه نکرده‌اید. برای شروع، فرم سمت چپ را پر کنید.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تعداد کل</p>
                <p className="text-2xl font-bold text-gray-800">{transitWays.length}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <List className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در حال ویرایش</p>
                <p className="text-2xl font-bold text-gray-800">{editId ? '1' : '0'}</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg">
                <Edit3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">وضعیت</p>
                <p className="text-lg font-bold text-gray-800">
                  {isLoading ? 'در حال بارگذاری...' : 'آماده'}
                </p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}