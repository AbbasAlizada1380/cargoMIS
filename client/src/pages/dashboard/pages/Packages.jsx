import React, { useEffect, useState } from "react";
import { packageService, zoneService } from "../services/packageService";
import PackageList from "./PackageList";

const PackageCrud = () => {
  const [packages, setPackages] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [priceList, setPriceList] = useState(null);

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
    totalWeight: 0,
    piece: 0,
    value: 0,
    perKgCash: 0,
    OPerKgCash: 0,
    OTotalCash: 0,
    transitWay: "",
    totalCash: 0,
    remain: 0,
    received: 0,
  });

  // Fetch initial data
  useEffect(() => {
    fetchPackages();
    fetchZones();
  }, []);

  // Fetch price list when receiver country and weight are available
  useEffect(() => {
    const fetchPriceList = async () => {
      if (form.receiverCountry && form.totalWeight > 0) {
        try {
          const priceData = await zoneService.getPriceListByCountryAndWeight(
            form.totalWeight,
            form.receiverCountry
          );
          setPriceList(priceData);

          // Auto-fill the form with the cheapest price
          if (priceData && priceData.length > 0) {
            const cheapestOption = priceData.reduce((min, current) =>
              current.price < min.price ? current : min
            );

            setForm((prevForm) => ({
              ...prevForm,
              perKgCash: cheapestOption.price,
              transitWay: cheapestOption.name || cheapestOption.transitWay,
              OTotalCash: form.totalWeight * cheapestOption.price,
            }));
          }
        } catch (err) {
          console.error("Fetching price list error: ", err);
        }
      }
    };

    fetchPriceList();
  }, [form.receiverCountry, form.totalWeight]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (err) {
      console.error("Fetch packages error:", err);
      alert("Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchZones = async () => {
    try {
      const data = await zoneService.getAllZones();
      setZones(data.countries);
      console.log(data.countries);
      
    } catch (err) {
      console.error("Fetch zones error:", err);
      alert("Error fetching zones data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // Recalculate OTotalCash when totalWeight or perKgCash changes
    if (name === "totalWeight" || name === "perKgCash") {
      const weight =
        name === "totalWeight" ? parseFloat(value) || 0 : form.totalWeight;
      const price =
        name === "perKgCash" ? parseFloat(value) || 0 : form.perKgCash;
      updatedForm.OTotalCash = weight * price;
    }

    setForm(updatedForm);
  };

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
      console.error("Submit error:", err);
      alert("Error saving package");
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
      totalWeight: 0,
      piece: 0,
      value: 0,
      perKgCash: 0,
      OPerKgCash: 0,
      OTotalCash: 0,
      transitWay: "",
      totalCash: 0,
      remain: 0,
      received: 0,
    });
    setPriceList(null);
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
      value: pkg.value || 0,
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
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await packageService.deletePackage(id);
      fetchPackages();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting package");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Update Package" : "Create Package"}
      </h2>

      {/* Price List Information */}
      {priceList && priceList.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800">
            Available Transit Options:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {priceList.map((option, index) => (
              <div key={index} className="p-2 bg-white rounded border">
                <div className="font-medium">
                  {option.name || option.transitWay}
                </div>
                <div className="text-sm text-gray-600">${option.price}/kg</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        {/* Sender Section */}
        <div className="col-span-2">
          <h3 className="font-semibold text-lg mb-2">Sender Info</h3>
        </div>

        <FormInput
          label="Sender Name"
          name="senderName"
          value={form.senderName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Sender Address"
          name="senderAddress"
          value={form.senderAddress}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Sender Email"
          name="senderEmail"
          type="email"
          value={form.senderEmail}
          onChange={handleChange}
        />

        <FormInput
          label="Sender Phone"
          name="senderPhoneNumber"
          value={form.senderPhoneNumber}
          onChange={handleChange}
          required
        />

        <FormSelect
          label="Sender Country"
          name="senderCountry"
          value={form.senderCountry}
          onChange={handleChange}
          options={zones}
          required
        />

        {/* Receiver Section */}
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-lg mb-2">Receiver Info</h3>
        </div>

        <FormInput
          label="Receiver Name"
          name="receiverName"
          value={form.receiverName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Receiver Address"
          name="receiverAddress"
          value={form.receiverAddress}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Receiver Email"
          name="receiverEmail"
          type="email"
          value={form.receiverEmail}
          onChange={handleChange}
        />

        <FormInput
          label="Receiver Phone"
          name="receiverPhoneNumber"
          value={form.receiverPhoneNumber}
          onChange={handleChange}
          required
        />

        <FormSelect
          label="Receiver Country"
          name="receiverCountry"
          value={form.receiverCountry}
          onChange={handleChange}
          options={zones}
          required
        />

        {/* Package Section */}
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-lg mb-2">Package Info</h3>
        </div>

        <FormInput
          label="Total Weight (KG)"
          name="totalWeight"
          type="number"
          value={form.totalWeight}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
        />

        <FormInput
          label="Piece"
          name="piece"
          type="number"
          value={form.piece}
          onChange={handleChange}
          required
          min="0"
        />

        <FormInput
          label="Value"
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
          step="0.01"
          min="0"
        />

        <FormInput
          label="Per Kg Cash"
          name="perKgCash"
          type="number"
          value={form.perKgCash}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
        />

        <FormInput
          label="Office Per Kg Cash"
          name="OPerKgCash"
          type="number"
          value={form.OPerKgCash}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
        />

        <FormInput
          label="Office Total Cash"
          name="OTotalCash"
          type="number"
          value={form.OTotalCash}
          onChange={handleChange}
          required
          disabled
          step="0.01"
        />

        <FormInput
          label="Transit Way"
          name="transitWay"
          value={form.transitWay}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Total Cash"
          name="totalCash"
          type="number"
          value={form.totalCash}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
        />

        <FormInput
          label="Remain"
          name="remain"
          type="number"
          value={form.remain}
          onChange={handleChange}
          required
          step="0.01"
        />

        <FormInput
          label="Received"
          name="received"
          type="number"
          value={form.received}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
        />

        <div className="col-span-2 flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex-1"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingId
              ? "Update Package"
              : "Create Package"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center p-4">Loading packages...</div>
      ) : (
        <PackageList
          packages={packages}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// Reusable form input component
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  step,
  min,
}) => (
  <label className="flex flex-col">
    <span className="mb-1 font-medium">{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`border p-2 rounded ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      required={required}
      disabled={disabled}
      step={step}
      min={min}
    />
  </label>
);

// Reusable form select component
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <label className="flex flex-col">
    <span className="mb-1 font-medium">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 rounded"
      required={required}
    >
      <option value="">Select {label}</option>

      {options &&
        Array.isArray(options) &&
        options.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
    </select>
  </label>
);

export default PackageCrud;
