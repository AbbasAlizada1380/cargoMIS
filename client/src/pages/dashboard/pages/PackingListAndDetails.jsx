import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaBox,
  FaWeight,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaRuler,
  FaCheckSquare,
  FaSquare,
  FaCalculator,
} from "react-icons/fa";

const PackingListAndDetails = ({
  form,
  handleChange,
  setForm,
  resetTrigger,
  isEditing = false,
}) => {
  // Initial list - this should be static with value field added
  const initialPackList = [
    { description: "لباس زنانه", qty: "", weight: "", value: "" },
    { description: "مردانه لباس", qty: "", weight: "", value: "" },
    { description: "چادر", qty: "", weight: "", value: "" },
    { description: "پلون مردانه", qty: "", weight: "", value: "" },
    { description: "گزاره", qty: "", weight: "", value: "" },
    { description: "جاکت زنانه", qty: "", weight: "", value: "" },
    { description: "بلوز", qty: "", weight: "", value: "" },
    { description: "واسکت", qty: "", weight: "", value: "" },
    { description: "بوت", qty: "", weight: "", value: "" },
    { description: "گند افغانی", qty: "", weight: "", value: "" },
    { description: "گردن بند", qty: "", weight: "", value: "" },
    { description: "بیک", qty: "", weight: "", value: "" },
    { description: "کرتی", qty: "", weight: "", value: "" },
    { description: "پوش بالش", qty: "", weight: "", value: "" },
    { description: "پوش توشک", qty: "", weight: "", value: "" },
    { description: "زیرپوش بالش", qty: "", weight: "", value: "" },
    { description: "زیرپوش توشک", qty: "", weight: "", value: "" },
    { description: "قالین", qty: "", weight: "", value: "" },
    { description: "نمد", qty: "", weight: "", value: "" },
    { description: "پرده", qty: "", weight: "", value: "" },
    { description: "میوه خشک", qty: "", weight: "", value: "" },
    { description: "قروت", qty: "", weight: "", value: "" },
    { description: "گیاه یونانی", qty: "", weight: "", value: "" },
    { description: "ترموز", qty: "", weight: "", value: "" },
    { description: "ماهی تابه", qty: "", weight: "", value: "" },
    { description: "چاینک", qty: "", weight: "", value: "" },
    { description: "ملاقه", qty: "", weight: "", value: "" },
    { description: "پیاله", qty: "", weight: "", value: "" },
  ];

  const [packList, setPackList] = useState(initialPackList);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [pieceCards, setPieceCards] = useState([]);
  const [pieceInput, setPieceInput] = useState("");

  const isInitialMount = useRef(true);
  const lastPackListRef = useRef([]);
  const shouldUpdateParent = useRef(true);

  // Format date function - UPDATED to handle both formats
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Handle format: "2026-02-11 00:00:00" (from database)
      if (dateString.includes(' ')) {
        const [datePart] = dateString.split(' ');
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          return datePart;
        }
      }

      // Handle ISO format: "2026-02-09T00:00:00.000Z"
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setPackList(
        initialPackList.map((item) => ({
          description: item.description,
          qty: "",
          weight: "",
          value: "",
        }))
      );
      setNewItemDescription("");
      setPieceCards([]);
      setPieceInput("");
      shouldUpdateParent.current = true;
      lastPackListRef.current = [];
    }
  }, [resetTrigger]);

  // Initialize component when editing or form changes - UPDATED
  useEffect(() => {
    if (isEditing) {
      // Initialize packList from form.packList
      if (form.packList && form.packList.length > 0) {
        // Create a map of saved items for quick lookup
        const savedItemsMap = {};
        form.packList.forEach(item => {
          if (item.description) {
            savedItemsMap[item.description] = {
              qty: item.qty?.toString() || "",
              weight: item.weight?.toString() || "",
              value: item.value?.toString() || "",
            };
          }
        });

        // Update initial items with saved values
        const updatedPackList = initialPackList.map(item => {
          if (savedItemsMap[item.description]) {
            return {
              ...item,
              qty: savedItemsMap[item.description].qty,
              weight: savedItemsMap[item.description].weight,
              value: savedItemsMap[item.description].value,
            };
          }
          return item;
        });

        // Add custom items
        const customItems = form.packList.filter(item =>
          item.description && !initialPackList.some(initialItem => initialItem.description === item.description)
        );

        const finalPackList = [...updatedPackList];
        customItems.forEach(customItem => {
          finalPackList.push({
            description: customItem.description,
            qty: customItem.qty?.toString() || "",
            weight: customItem.weight?.toString() || "",
            value: customItem.value?.toString() || "",
          });
        });

        setPackList(finalPackList);
        lastPackListRef.current = form.packList;
      }

      // Initialize piece cards from form.pieceDetails
      if (form.pieceDetails && Object.keys(form.pieceDetails).length > 0) {
        const piecesArray = [];
        Object.keys(form.pieceDetails).forEach(key => {
          const piece = form.pieceDetails[key];
          piecesArray.push({
            id: parseInt(key),
            weight: piece.weight?.toString() || "",
            hasDimensions: !!(piece.height && piece.width && piece.length &&
              piece.height > 0 && piece.width > 0 && piece.length > 0),
            height: piece.height?.toString() || "",
            width: piece.width?.toString() || "",
            length: piece.length?.toString() || "",
            dimensionWeight: piece.dimensionWeight?.toString() || "",
            actualWeight: piece.actualWeight?.toString() || piece.weight?.toString() || "",
          });
        });

        if (piecesArray.length > 0) {
          setPieceCards(piecesArray);
          setPieceInput(piecesArray.length.toString());
        }
      }

      // Format date if needed - but don't update form if already formatted
      if (form.date && typeof form.date === 'string') {
        const formattedDate = formatDateForInput(form.date);
        if (formattedDate !== form.date) {
          // Use setTimeout to avoid updating during render
          setTimeout(() => {
            setForm(prev => ({
              ...prev,
              date: formattedDate
            }));
          }, 0);
        }
      }
    }
  }, [isEditing, form.packList, form.pieceDetails, form.date, setForm]);

  // Handle date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate total weight including dimension weight
  const calculateTotalWeightWithDimensions = useCallback(() => {
    let totalWeight = 0;
    let dimensionWeightTotal = 0;
    let actualWeightTotal = 0;

    pieceCards.forEach(card => {
      const actualWeight = parseFloat(card.weight) || 0;
      actualWeightTotal += actualWeight;

      if (card.hasDimensions) {
        const height = parseFloat(card.height) || 0;
        const width = parseFloat(card.width) || 0;
        const length = parseFloat(card.length) || 0;

        if (height > 0 && width > 0 && length > 0) {
          const dimensionWeight = (height * width * length) / 5000;
          dimensionWeightTotal += dimensionWeight;
          totalWeight += dimensionWeight;
        } else {
          totalWeight += actualWeight;
        }
      } else {
        totalWeight += actualWeight;
      }
    });

    return {
      totalWeight: totalWeight,
      dimensionWeightTotal: dimensionWeightTotal,
      actualWeightTotal: actualWeightTotal
    };
  }, [pieceCards]);

  // Update pieceDetails in form
  useEffect(() => {
    if (pieceCards.length > 0) {
      const { totalWeight } = calculateTotalWeightWithDimensions();

      // Update form if total weight changed
      if (parseFloat(form.totalWeight) !== totalWeight) {
        setForm(prev => ({
          ...prev,
          totalWeight: totalWeight.toString()
        }));
      }

      // Update pieceDetails in form
      const pieceDetailsObj = {};
      pieceCards.forEach(card => {
        const height = parseFloat(card.height) || 0;
        const width = parseFloat(card.width) || 0;
        const length = parseFloat(card.length) || 0;
        const actualWeight = parseFloat(card.weight) || 0;
        let dimensionWeight = 0;

        if (card.hasDimensions && height > 0 && width > 0 && length > 0) {
          dimensionWeight = (height * width * length) / 5000;
        }

        pieceDetailsObj[card.id] = {
          width: width,
          height: height,
          length: length,
          weight: actualWeight,
          actualWeight: actualWeight,
          dimensionWeight: dimensionWeight
        };
      });

      setForm(prev => ({
        ...prev,
        pieceDetails: pieceDetailsObj,
        piece: pieceCards.length.toString()
      }));
    } else if (form.pieceDetails && Object.keys(form.pieceDetails).length > 0) {
      setForm(prev => ({
        ...prev,
        pieceDetails: {},
        piece: "0"
      }));
    }
  }, [pieceCards, calculateTotalWeightWithDimensions]);

  // Handle editing mode for packList
  useEffect(() => {
    if (isEditing && form.packList && form.packList.length > 0) {
      const formPackListStr = JSON.stringify(form.packList);
      const lastPackListStr = JSON.stringify(lastPackListRef.current);

      if (formPackListStr !== lastPackListStr) {
        const savedItemsMap = {};
        form.packList.forEach(item => {
          if (item.description) {
            savedItemsMap[item.description] = {
              qty: item.qty?.toString() || "",
              weight: item.weight?.toString() || "",
              value: item.value?.toString() || "",
            };
          }
        });

        const updatedPackList = initialPackList.map(item => {
          if (savedItemsMap[item.description]) {
            return {
              ...item,
              qty: savedItemsMap[item.description].qty,
              weight: savedItemsMap[item.description].weight,
              value: savedItemsMap[item.description].value,
            };
          }
          return item;
        });

        const customItems = form.packList.filter(item =>
          item.description && !initialPackList.some(initialItem => initialItem.description === item.description)
        );

        const finalPackList = [...updatedPackList];
        customItems.forEach(customItem => {
          finalPackList.push({
            description: customItem.description,
            qty: customItem.qty?.toString() || "",
            weight: customItem.weight?.toString() || "",
            value: customItem.value?.toString() || "",
          });
        });

        setPackList(finalPackList);
        lastPackListRef.current = form.packList;

        shouldUpdateParent.current = false;
        setTimeout(() => {
          shouldUpdateParent.current = true;
        }, 100);
      }
    }
  }, [isEditing, form.packList]);

  // Update parent form when packList changes
  const updateParentForm = useCallback((currentPackList) => {
    if (!shouldUpdateParent.current) return;

    const filteredList = currentPackList.filter(
      (item) => {
        const qty = parseFloat(item.qty) || 0;
        const weight = parseFloat(item.weight) || 0;
        const value = parseFloat(item.value) || 0;
        const hasDescription = item.description && item.description.trim() !== "";

        return hasDescription && (qty > 0 || weight > 0 || value > 0);
      }
    );

    const formattedList = filteredList.map(item => ({
      description: item.description,
      qty: parseFloat(item.qty) || 0,
      weight: parseFloat(item.weight) || 0,
      value: parseFloat(item.value) || 0,
    }));

    const currentFormList = form.packList || [];
    const currentFormListStr = JSON.stringify(currentFormList);
    const newFormListStr = JSON.stringify(formattedList);

    if (currentFormListStr !== newFormListStr) {
      setForm((prev) => ({
        ...prev,
        packList: formattedList,
      }));
    }
  }, [form.packList, setForm]);

  // Debounced effect to update parent form
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      updateParentForm(packList);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [packList, updateParentForm]);

  // Handle pack list item changes
  const handlePackListChange = (index, field, value) => {
    let cleanValue = value;

    if (field === "qty" || field === "weight" || field === "value") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        cleanValue = value.replace(/^0+(?=\d)/, "");
      } else {
        return;
      }
    }

    const updatedPackList = [...packList];
    updatedPackList[index][field] = cleanValue;
    setPackList(updatedPackList);
  };

  // Handle piece card changes
  const handlePieceCardChange = (index, field, value) => {
    const updatedCards = [...pieceCards];

    if (field === "hasDimensions") {
      updatedCards[index][field] = !updatedCards[index][field];

      if (!updatedCards[index][field]) {
        updatedCards[index].height = "";
        updatedCards[index].width = "";
        updatedCards[index].length = "";
        updatedCards[index].dimensionWeight = "";
      }
    } else if (field === "weight" || field === "height" || field === "width" || field === "length") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        updatedCards[index][field] = value.replace(/^0+(?=\d)/, "");

        if (field === "height" || field === "width" || field === "length") {
          calculateDimensionWeight(index, updatedCards);
        }
      } else {
        return;
      }
    }

    setPieceCards(updatedCards);
  };

  // Calculate dimension weight for a specific card
  const calculateDimensionWeight = (index, cards) => {
    const card = cards[index];
    const height = parseFloat(card.height) || 0;
    const width = parseFloat(card.width) || 0;
    const length = parseFloat(card.length) || 0;

    if (height > 0 && width > 0 && length > 0) {
      const dimensionWeight = (height * width * length) / 5000;
      card.dimensionWeight = dimensionWeight.toFixed(2);
    } else {
      card.dimensionWeight = "";
    }
  };

  // Handle piece input change
  const handlePieceInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPieceInput(value);
      const count = parseInt(value) || 0;
      applyPieceCount(count);
    }
  };

  // Apply piece count
  const applyPieceCount = (count) => {
    count = count || parseInt(pieceInput) || 0;
    if (count > 0) {
      const newPieceCards = Array.from({ length: count }, (_, index) => {
        if (isEditing && form.pieceDetails && form.pieceDetails[index + 1]) {
          const piece = form.pieceDetails[index + 1];
          return {
            id: index + 1,
            weight: piece.weight?.toString() || "",
            hasDimensions: !!(piece.height && piece.width && piece.length &&
              piece.height > 0 && piece.width > 0 && piece.length > 0),
            height: piece.height?.toString() || "",
            width: piece.width?.toString() || "",
            length: piece.length?.toString() || "",
            dimensionWeight: piece.dimensionWeight?.toString() || "",
            actualWeight: piece.actualWeight?.toString() || piece.weight?.toString() || "",
          };
        }

        return {
          id: index + 1,
          weight: "",
          hasDimensions: false,
          height: "",
          width: "",
          length: "",
          dimensionWeight: "",
          actualWeight: "",
        };
      });

      setPieceCards(newPieceCards);
      setForm(prev => ({
        ...prev,
        piece: count.toString()
      }));
    } else if (pieceCards.length > 0) {
      setPieceCards([]);
      setForm(prev => ({
        ...prev,
        piece: "0",
        pieceDetails: {}
      }));
    }
  };

  // Clear piece cards
  const clearPieceCards = () => {
    setPieceCards([]);
    setPieceInput("");
    setForm(prev => ({
      ...prev,
      piece: "0",
      pieceDetails: {}
    }));
  };

  // Add new item to pack list
  const handleAddNewItem = () => {
    if (newItemDescription.trim() === "") return;

    const newItem = {
      description: newItemDescription.trim(),
      qty: "",
      weight: "",
      value: "",
    };

    setPackList(prev => [...prev, newItem]);
    setNewItemDescription("");
    shouldUpdateParent.current = true;
  };

  // Remove item from pack list
  const handleRemoveItem = (index) => {
    const updatedPackList = packList.filter((_, i) => i !== index);
    setPackList(updatedPackList);
  };

  // Calculate totals - only from items with values
  const calculateTotals = () => {
    const totals = packList.reduce(
      (acc, item) => {
        const qty = parseFloat(item.qty) || 0;
        const weight = parseFloat(item.weight) || 0;
        const value = parseFloat(item.value) || 0;

        if (qty > 0 || weight > 0 || value > 0) {
          return {
            totalQty: acc.totalQty + qty,
            totalWeight: acc.totalWeight + qty * weight,
            totalValue: acc.totalValue + qty * value,
          };
        }
        return acc;
      },
      { totalQty: 0, totalWeight: 0, totalValue: 0 }
    );

    return totals;
  };

  // Parse number safely for display
  const parseNumber = (value) => {
    return value === "" || value == null ? "" : value;
  };

  const { totalWeight: weightWithDimensions, dimensionWeightTotal, actualWeightTotal } = calculateTotalWeightWithDimensions();

  return (
    <div className="space-y-6">
      {/* Piece Cards Section */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-blue-900 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">
                  مدیریت قطعات بسته
                </h4>
                <p className="text-amber-100 text-sm mt-1">
                  تعداد قطعات را وارد کرده و مشخصات هر قطعه را پر کنید
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={pieceInput}
                onChange={handlePieceInputChange}
                placeholder="تعداد قطعات"
                className="bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 w-32 text-center"
              />
              {pieceCards.length > 0 && (
                <button
                  type="button"
                  onClick={clearPieceCards}
                  className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 transition-colors"
                >
                  پاک کردن
                </button>
              )}
            </div>
          </div>
        </div>

        {pieceCards.length > 0 && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pieceCards.map((card, index) => {
                const actualWeight = parseFloat(card.weight) || 0;
                const dimensionWeight = parseFloat(card.dimensionWeight) || 0;
                const finalWeight = card.hasDimensions && dimensionWeight > 0
                  ? Math.max(actualWeight, dimensionWeight)
                  : actualWeight;

                return (
                  <div key={card.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-800">قطعه #{card.id}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${card.hasDimensions && dimensionWeight > 0
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                        }`}>
                        وزن: {finalWeight.toFixed(2)} کیلوگرم
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">وزن (کیلوگرم)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={card.weight}
                          onChange={(e) => handlePieceCardChange(index, "weight", e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePieceCardChange(index, "hasDimensions")}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          {card.hasDimensions ? (
                            <FaCheckSquare className="text-green-600" />
                          ) : (
                            <FaSquare className="text-gray-400" />
                          )}
                          ابعاد دارد
                        </button>
                      </div>

                      {card.hasDimensions && (
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FaRuler className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">ابعاد</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">طول (سانتی‌متر)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={card.length}
                                onChange={(e) => handlePieceCardChange(index, "length", e.target.value)}
                                placeholder="0.0"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">عرض (سانتی‌متر)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={card.width}
                                onChange={(e) => handlePieceCardChange(index, "width", e.target.value)}
                                placeholder="0.0"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">ارتفاع (سانتی‌متر)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={card.height}
                                onChange={(e) => handlePieceCardChange(index, "height", e.target.value)}
                                placeholder="0.0"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          {card.dimensionWeight && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <FaCalculator className="text-green-600" />
                                <span className="text-sm text-green-800">
                                  وزن ابعادی: <strong>{card.dimensionWeight}</strong> کیلوگرم
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total weight from pieces */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaWeight className="text-blue-600 text-xl" />
                  <div>
                    <div className="text-sm text-blue-800">مجموع وزن قطعات</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {weightWithDimensions.toFixed(2)} کیلوگرم
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {pieceCards.length} قطعه
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date and Tracking Section */}
      <div className="bg-gray-200 rounded-md shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaCalendarAlt className="text-purple-600 text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">تاریخ ارسال</h4>
            <p className="text-gray-500 text-sm">
              تاریخ و اطلاعات رهگیری را وارد کنید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ ارسال
            </label>
            <input
              type="date"
              name="date"
              value={formatDateForInput(form.date)}
              onChange={handleDateChange}
              className="w-full px-4 py-3 bg-white rounded-md focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره رهگیری
            </label>
            <input
              type="text"
              name="track_number"
              value={form.track_number || ""}
              onChange={handleChange}
              placeholder="شماره رهگیری بسته"
              className="w-full px-4 py-3 bg-white rounded-md focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ارزش بسته
            </label>
            <input
              type="text"
              name="value"
              value={form.value || ""}
              onChange={handleChange}
              placeholder="ارزش بسته"
              className="w-full px-4 py-3 bg-white rounded-md focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره رن
            </label>
            <input
              type="number"
              name="run"
              value={form.run || ""}
              onChange={handleChange}
              placeholder="شماره رن"
              className="w-full px-4 py-3 bg-white rounded-md focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Original Packing List Section */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-blue-900 p-6">
          <div className="md:flex space-y-3 md:space-y-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">
                  لیست بسته‌بندی (کالاها)
                </h4>
                <p className="text-gray-300 text-sm mt-1">
                  {isEditing ? "ویرایش آیتم‌ها" : "افزودن آیتم‌های بسته"}
                </p>
              </div>
            </div>

            {/* Add New Item */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="نام کالای جدید"
                className="bg-white px-3 py-2 w-full focus:outline-none rounded-md focus:ring-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewItem();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddNewItem}
                className="px-4 py-2 bg-white text-[#0F3A76] rounded-lg cursor-pointer transition-colors flex items-center gap-2"
              >
                <FaPlus />
                افزودن
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  شماره
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  جزئیات
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  تعداد
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  وزن (کیلوگرم)
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  ارزش ($)
                </th>
                <th className="py-4 px-4 text-right text-sm font-semibold text-gray-700 border-b">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packList.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-4 text-center text-gray-600 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 text-right font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={parseNumber(item.qty)}
                      onChange={(e) =>
                        handlePackListChange(index, "qty", e.target.value)
                      }
                      min="0"
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={parseNumber(item.weight)}
                      onChange={(e) =>
                        handlePackListChange(index, "weight", e.target.value)
                      }
                      min="0"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={parseNumber(item.value)}
                        onChange={(e) =>
                          handlePackListChange(index, "value", e.target.value)
                        }
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                      />
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        $
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {index >= initialPackList.length && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1 text-sm"
                      >
                        <FaTrash className="text-xs" />
                        حذف
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackingListAndDetails;