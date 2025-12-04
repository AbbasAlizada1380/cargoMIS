import React, { useEffect, useState, useCallback } from "react";
import { packageService, zoneService } from "../services/packageService";
import PackageList from "./PackageList";
import { 
  FaUser, 
  FaBox, 
  FaTruck, 
  FaMoneyBillWave, 
  FaShoppingCart, 
  FaWeight,
  FaGlobeAmericas,
  FaCheck,
  FaChevronRight,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import { GiWeight } from "react-icons/gi";

const PackageCrud = () => {
  const [packages, setPackages] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [priceList, setPriceList] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const [form, setForm] = useState({
    // Sender fields
    senderName: "",
    senderAddress: "",
    senderEmail: "",
    senderPhoneNumber: "",
    senderCountry: "",
    // Receiver fields
    receiverName: "",
    receiverAddress: "",
    receiverEmail: "",
    receiverPhoneNumber: "",
    receiverCountry: "",
    // Package fields
    totalWeight: "",
    piece: "",
    value: "",
    perKgCash: "",
    OPerKgCash: "",
    OTotalCash: "",
    transitWay: "",
    totalCash: "",
    remain: "",
    received: "",
  });

  // Fetch initial data
  useEffect(() => {
    fetchPackages();
    fetchZones();
  }, []);

  // Fetch price list when receiver country or weight changes
  useEffect(() => {
    const fetchPriceList = async () => {
      if (form.receiverCountry && form.totalWeight) {
        const weight = parseFloat(form.totalWeight);
        if (weight > 0) {
          try {
            setPriceList(null);
            setLoading(true);
            const priceData = await zoneService.getPriceListByCountryAndWeight(
              weight,
              form.receiverCountry
            );
            setPriceList(priceData);

            // Auto-fill with the cheapest option
            if (priceData && priceData.data && priceData.data.length > 0) {
              const options = priceData.data;
              const cheapestOption = options.reduce((min, current) =>
                parseFloat(current.price) < parseFloat(min.price) ? current : min
              );

              const price = parseFloat(cheapestOption.price);
              const totalWeight = parseFloat(form.totalWeight) || 0;
              
              setForm((prevForm) => ({
                ...prevForm,
                OPerKgCash: cheapestOption.price,
                transitWay: cheapestOption.Transit.name,
                OTotalCash: (totalWeight * price).toFixed(2),
                // Calculate totalCash based on perKgCash * totalWeight
                totalCash: (totalWeight * parseFloat(prevForm.perKgCash || 0)).toFixed(2),
              }));
              
              setSelectedOptionId(cheapestOption.id);
            }
          } catch (err) {
            console.error("خطا در دریافت لیست قیمت: ", err);
            setPriceList(null);
            setSelectedOptionId(null);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setPriceList(null);
        setSelectedOptionId(null);
      }
    };

    const debounceTimer = setTimeout(fetchPriceList, 300);
    return () => clearTimeout(debounceTimer);
  }, [form.receiverCountry, form.totalWeight]);

  // Auto-calculate remain and totalCash
  useEffect(() => {
    const weight = parseFloat(form.totalWeight) || 0;
    const perKg = parseFloat(form.perKgCash) || 0;
    const received = parseFloat(form.received) || 0;
    const OPerKg = parseFloat(form.OPerKgCash) || 0;
    
    // Calculate totalCash (perKgCash * totalWeight)
    const totalCash = (weight * perKg).toFixed(2);
    
    // Calculate remain (totalCash - received)
    const remain = (parseFloat(totalCash) - received).toFixed(2);
    
    // Calculate OTotalCash (OPerKgCash * totalWeight)
    const OTotalCash = (weight * OPerKg).toFixed(2);
    
    setForm(prev => ({
      ...prev,
      totalCash,
      remain,
      OTotalCash
    }));
  }, [form.totalWeight, form.perKgCash, form.received, form.OPerKgCash]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (err) {
      console.error("خطا در دریافت بسته‌ها:", err);
      alert("خطا در دریافت بسته‌ها");
    } finally {
      setLoading(false);
    }
  };

  const fetchZones = async () => {
    try {
      const data = await zoneService.getAllZones();
      setZones(data.countries);
    } catch (err) {
      console.error("خطا در دریافت مناطق:", err);
      alert("خطا در دریافت اطلاعات مناطق");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectPriceOption = useCallback((option) => {
    const price = parseFloat(option.price);
    const weight = parseFloat(form.totalWeight) || 0;
    
    setForm((prevForm) => ({
      ...prevForm,
      OPerKgCash: option.price,
      transitWay: option.Transit.name,
      OTotalCash: (weight * price).toFixed(2),
      // Don't update perKgCash - user will enter manually
    }));
    setSelectedOptionId(option.id);
  }, [form.totalWeight]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sender = {
      name: form.senderName,
      address: form.senderAddress,
      email: form.senderEmail,
      phoneNumber: form.senderPhoneNumber,
      country: form.senderCountry,
    };

    const receiver = {
      name: form.receiverName,
      address: form.receiverAddress,
      email: form.receiverEmail,
      phoneNumber: form.receiverPhoneNumber,
      country: form.receiverCountry,
    };

    const packageData = {
      totalWeight: parseFloat(form.totalWeight) || 0,
      piece: parseInt(form.piece) || 0,
      value: parseFloat(form.value) || 0,
      perKgCash: parseFloat(form.perKgCash) || 0,
      OPerKgCash: parseFloat(form.OPerKgCash) || 0,
      OTotalCash: parseFloat(form.OTotalCash) || 0,
      transitWay: form.transitWay,
      totalCash: parseFloat(form.totalCash) || 0,
      remain: parseFloat(form.remain) || 0,
      received: parseFloat(form.received) || 0,
    };

    try {
      if (editingId) {
        await packageService.updatePackage(editingId, {
          sender,
          receiver,
          packageData,
        });
        setEditingId(null);
      } else {
        await packageService.createPackage({
          sender,
          receiver,
          packageData,
        });
      }

      resetForm();
      fetchPackages();
    } catch (err) {
      console.error("خطا در ذخیره:", err);
      alert("خطا در ذخیره بسته");
    }
  };

  const resetForm = () => {
    setForm({
      senderName: "",
      senderAddress: "",
      senderEmail: "",
      senderPhoneNumber: "",
      senderCountry: "",
      receiverName: "",
      receiverAddress: "",
      receiverEmail: "",
      receiverPhoneNumber: "",
      receiverCountry: "",
      totalWeight: "",
      piece: "",
      value: "",
      perKgCash: "",
      OPerKgCash: "",
      OTotalCash: "",
      transitWay: "",
      totalCash: "",
      remain: "",
      received: "",
    });
    setPriceList(null);
    setSelectedOptionId(null);
  };

  const handleEdit = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      senderName: pkg.Sender.name,
      senderAddress: pkg.Sender.address,
      senderEmail: pkg.Sender.email || "",
      senderPhoneNumber: pkg.Sender.phoneNumber,
      senderCountry: pkg.Sender.country,
      receiverName: pkg.Receiver.name,
      receiverAddress: pkg.Receiver.address,
      receiverEmail: pkg.Receiver.email || "",
      receiverPhoneNumber: pkg.Receiver.phoneNumber,
      receiverCountry: pkg.Receiver.country,
      totalWeight: pkg.totalWeight,
      piece: pkg.piece,
      value: pkg.value || "",
      perKgCash: pkg.perKgCash,
      OPerKgCash: pkg.OPerKgCash,
      OTotalCash: pkg.OTotalCash,
      transitWay: pkg.transitWay,
      totalCash: pkg.totalCash,
      remain: pkg.remain,
      received: pkg.received,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این بسته اطمینان دارید؟")) return;

    try {
      await packageService.deletePackage(id);
      fetchPackages();
    } catch (err) {
      console.error("خطا در حذف:", err);
      alert("خطا در حذف بسته");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaBox className="text-4xl" />
                {editingId ? "ویرایش بسته" : "ایجاد بسته جدید"}
              </h1>
              <p className="text-blue-100 mt-2">
                مدیریت ارسال بسته‌ها با محاسبات قیمت خودکار
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                <GiWeight className="text-2xl" />
                <div>
                  <div className="text-sm">مجموع بسته‌ها</div>
                  <div className="text-xl font-bold">{packages.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            {/* Transit Options Section */}
            {priceList && priceList.data && priceList.data.length > 0 && (
              <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <FaTruck />
                    گزینه‌های حمل و نقل موجود برای {form.receiverCountry}
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    وزن: {form.totalWeight} کیلوگرم • برای انتخاب روی هر گزینه کلیک کنید
                  </p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {priceList.data.map((option) => {
                      const isCheapest = priceList.data.reduce((min, current) =>
                        parseFloat(current.price) < parseFloat(min.price) ? current : min
                      ).id === option.id;
                      
                      const isSelected = selectedOptionId === option.id;
                      const totalPrice = (parseFloat(form.totalWeight || 0) * parseFloat(option.price)).toFixed(2);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => selectPriceOption(option)}
                          className={`p-4 rounded-lg border-2 transition-all transform hover:scale-[1.02] ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <span className="font-semibold text-gray-900">
                                  {option.Transit.name}
                                </span>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FaGlobeAmericas className="text-xs" />
                                  منطقه: {option.zoneId}
                                </div>
                                {isCheapest && (
                                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    <FaCheck className="text-xs" />
                                    ارزانترین گزینه
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                ${option.price}
                                <span className="text-sm font-normal text-gray-500">/کیلو</span>
                              </div>
                              {form.totalWeight && (
                                <div className="text-sm text-gray-500 mt-1">
                                  مجموع: <span className="font-semibold">${totalPrice}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <div className="flex items-center justify-center text-blue-600 font-medium">
                                <FaCheck className="mr-2" />
                                انتخاب شده
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Selection Summary */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-blue-800 font-medium">گزینه انتخاب شده</div>
                        <div className="text-lg font-semibold text-gray-900">{form.transitWay}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">${form.OPerKgCash}/کیلو</div>
                        {form.totalWeight && (
                          <div className="text-sm text-gray-600">
                            مجموع دفتری: <span className="font-bold">${(parseFloat(form.totalWeight || 0) * parseFloat(form.OPerKgCash || 0)).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Package Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
              {/* Form Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Section */}
                <div className="md:col-span-1 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="text-purple-600" />
                    اطلاعات فرستنده
                  </h4>
                  <div className="space-y-4">
                    <FormInput
                      icon={<FaUser />}
                      label="نام فرستنده"
                      name="senderName"
                      value={form.senderName}
                      onChange={handleChange}
                      required
                      placeholder="نام کامل"
                    />

                    <FormInput
                      icon={<FaGlobeAmericas />}
                      label="آدرس فرستنده"
                      name="senderAddress"
                      value={form.senderAddress}
                      onChange={handleChange}
                      required
                      placeholder="آدرس کامل"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        icon={<FaUser />}
                        label="ایمیل"
                        name="senderEmail"
                        type="email"
                        value={form.senderEmail}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />

                      <FormInput
                        icon={<FaUser />}
                        label="شماره تماس"
                        name="senderPhoneNumber"
                        value={form.senderPhoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="+1234567890"
                      />
                    </div>

                    <FormInput
                      icon={<FaGlobeAmericas />}
                      label="کشور فرستنده"
                      name="senderCountry"
                      value={form.senderCountry}
                      onChange={handleChange}
                      required
                      placeholder="نام کشور"
                    />
                  </div>
                </div>

                {/* Receiver Section */}
                <div className="md:col-span-1 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="text-green-600" />
                    اطلاعات گیرنده
                  </h4>
                  <div className="space-y-4">
                    <FormInput
                      icon={<FaUser />}
                      label="نام گیرنده"
                      name="receiverName"
                      value={form.receiverName}
                      onChange={handleChange}
                      required
                      placeholder="نام کامل"
                    />

                    <FormInput
                      icon={<FaGlobeAmericas />}
                      label="آدرس گیرنده"
                      name="receiverAddress"
                      value={form.receiverAddress}
                      onChange={handleChange}
                      required
                      placeholder="آدرس کامل"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        icon={<FaUser />}
                        label="ایمیل"
                        name="receiverEmail"
                        type="email"
                        value={form.receiverEmail}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />

                      <FormInput
                        icon={<FaUser />}
                        label="شماره تماس"
                        name="receiverPhoneNumber"
                        value={form.receiverPhoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="+1234567890"
                      />
                    </div>

                    <FormSelect
                      icon={<FaGlobeAmericas />}
                      label="کشور گیرنده"
                      name="receiverCountry"
                      value={form.receiverCountry}
                      onChange={handleChange}
                      options={zones}
                      required
                    />
                  </div>
                </div>

                {/* Weight and Dimensions Section */}
                <div className="md:col-span-2 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaWeight className="text-blue-600" />
                    وزن و ابعاد
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      icon={<GiWeight />}
                      label="وزن کل (کیلوگرم)"
                      name="totalWeight"
                      type="number"
                      value={form.totalWeight}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />

                    <FormInput
                      icon={<FaBox />}
                      label="تعداد قطعات"
                      name="piece"
                      type="number"
                      value={form.piece}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="0"
                    />

                    <FormInput
                      icon={<FaMoneyBillWave />}
                      label="ارزش"
                      name="value"
                      type="number"
                      value={form.value}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600" />
                    اطلاعات قیمت‌گذاری
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      icon={<FaMoneyBillWave />}
                      label="نرخ هر کیلو (دستی)"
                      name="perKgCash"
                      type="number"
                      value={form.perKgCash}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />

                    <FormSelect
                      icon={<FaTruck />}
                      label="روش حمل و نقل"
                      name="transitWay"
                      value={form.transitWay}
                      onChange={handleChange}
                      options={
                        priceList && priceList.data 
                          ? priceList.data.map(opt => ({
                              value: opt.Transit.name,
                              label: `${opt.Transit.name} ($${opt.price}/کیلو)`
                            }))
                          : []
                      }
                      required
                    />

                    <FormInput
                      icon={<FaShoppingCart />}
                      label="نرخ دفتری هر کیلو"
                      name="OPerKgCash"
                      type="number"
                      value={form.OPerKgCash}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  
                  {/* Total Calculations */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="text-sm text-gray-500">مجموع دفتری</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${form.OTotalCash || "0.00"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">(وزن × نرخ دفتری)</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="text-sm text-gray-500">مجموع کل</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${form.totalCash || "0.00"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">(وزن × نرخ دستی)</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        icon={<FaMoneyBillWave />}
                        label="دریافتی"
                        name="received"
                        type="number"
                        value={form.received}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                      />

                      <div className="p-3 bg-white rounded-lg border">
                        <div className="text-sm text-gray-500">مانده</div>
                        <div className="text-2xl font-bold text-orange-600">
                          ${form.remain || "0.00"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">(مجموع کل - دریافتی)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        در حال پردازش...
                      </>
                    ) : editingId ? (
                      <>
                        <FaEdit />
                        ویرایش بسته
                      </>
                    ) : (
                      <>
                        <FaBox />
                        ایجاد بسته جدید
                      </>
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        resetForm();
                      }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      لغو
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    بازنشانی فرم
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Package List Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FaBox />
                    بسته‌های اخیر
                  </h3>
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">در حال بارگذاری بسته‌ها...</p>
                    </div>
                  ) : packages.length === 0 ? (
                    <div className="text-center py-8">
                      <FaBox className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">هنوز بسته‌ای وجود ندارد</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {packages.slice(0, 5).map((pkg) => (
                        <div
                          key={pkg.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {pkg.Receiver.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {pkg.Receiver.country} • {pkg.totalWeight}کیلو
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">
                                ${pkg.OTotalCash}
                              </div>
                              <div className="text-xs text-gray-500">
                                {pkg.transitWay}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleEdit(pkg)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                            >
                              <FaEdit className="text-xs" />
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDelete(pkg.id)}
                              className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                            >
                              <FaTrash className="text-xs" />
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {packages.length > 5 && (
                    <button
                      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                      className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
                    >
                      مشاهده همه بسته‌ها
                      <FaChevronRight className="text-sm" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {form.totalWeight && form.perKgCash && (
                <div className="mt-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FaMoneyBillWave />
                    محاسبه سریع
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>وزن:</span>
                      <span className="font-bold">{form.totalWeight} کیلو</span>
                    </div>
                    <div className="flex justify-between">
                      <span>نرخ دستی:</span>
                      <span className="font-bold">${form.perKgCash}/کیلو</span>
                    </div>
                    <div className="pt-2 border-t border-white/20 mt-2">
                      <div className="flex justify-between text-lg">
                        <span>مجموع:</span>
                        <span className="font-bold">${(parseFloat(form.totalWeight || 0) * parseFloat(form.perKgCash || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Package List */}
        <div className="mt-8">
          <PackageList
            packages={packages}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced FormInput Component
const FormInput = ({ icon, label, ...props }) => (
  <label className="flex flex-col">
    <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
      {icon}
      {label}
      {props.required && <span className="text-red-500">*</span>}
    </span>
    <div className="relative">
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
      {props.type === "number" && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {label.includes("وزن") ? "کیلو" : label.includes("نرخ") ? "$" : ""}
        </div>
      )}
    </div>
  </label>
);

// Enhanced FormSelect Component
const FormSelect = ({ icon, label, options, ...props }) => (
  <label className="flex flex-col">
    <span className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
      {icon}
      {label}
      {props.required && <span className="text-red-500">*</span>}
    </span>
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all bg-white"
      >
        <option value="">انتخاب {label}</option>
        {options &&
          Array.isArray(options) &&
          options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const labelText = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </label>
);

export default PackageCrud;