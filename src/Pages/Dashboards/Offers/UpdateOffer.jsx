/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import CommonModal from "../../../components/Common/CommonModal";
import useUserOffer from "../../../hook/userUserOffer";

const UpdateOffer = ({ isOpen, onClose, selectedToken }) => {
  const { loading, error, updateOffer } = useUserOffer();
  console.log("Selected Token for Edit:", selectedToken);

  // Initialize newOffer with selectedToken data or defaults
  const [newOffer, setNewOffer] = useState({
    type: "cask",
    status: "active",
    title: "",
    description: "",
    currentValue: "",
    deadline: "",
    category: "",
    distillery: "",
    caskType: "",
    vintageYear: "",
    abv: "",
    volume: "",
    image: null,
    images: [],
    packaging: "",
    quantity: "",
    certificate: "",
    duration: "",
    testing: "",
    participants: "",
    includes: "",
    storageLocation: "",
    purchaseValue: "",
  });

  useEffect(() => {
    if (selectedToken) {
      setNewOffer({
        id: selectedToken.id,
        type: selectedToken.type || "cask",
        status: selectedToken.status === "Active" ? "active" : "inactive",
        title: selectedToken.offerName || selectedToken.title || "",
        description: selectedToken.description || "",
        currentValue: selectedToken.price || selectedToken.currentValue || "",
        deadline: selectedToken.Deadline || selectedToken.deadline || "",
        category:
          selectedToken.category === "experience"
            ? "experience"
            : selectedToken.category || "premium",
        distillery: selectedToken.details?.distillery || "",
        caskType: selectedToken.details?.caskType || "",
        vintageYear: selectedToken.details?.vintage || "",
        abv: selectedToken.details?.abv || "",
        volume: selectedToken.details?.volume || "",
        image:
          selectedToken.image instanceof File
            ? selectedToken.image
            : selectedToken.image || null,
        images:
          selectedToken.images instanceof FileList
            ? Array.from(selectedToken.images)
            : selectedToken.images || [],
        packaging: selectedToken.details?.packaging || "",
        quantity: selectedToken.details?.quantity || "",
        certificate: selectedToken.details?.certificate || "",
        duration: selectedToken.details?.duration || "",
        testing: selectedToken.details?.testing || "",
        participants: selectedToken.details?.participants || "",
        includes: selectedToken.details?.includes || "",
        storageLocation:
          selectedToken.location || selectedToken.storageLocation || "",
        purchaseValue:
          selectedToken.originalPrice || selectedToken.purchaseValue || "",
      });
    } else {
      setNewOffer({
        type: "cask",
        status: "active",
        title: "",
        description: "",
        currentValue: "",
        deadline: "",
        category: "",
        distillery: "",
        caskType: "",
        vintageYear: "",
        abv: "",
        volume: "",
        image: null,
        images: [],
        packaging: "",
        quantity: "",
        certificate: "",
        duration: "",
        testing: "",
        participants: "",
        includes: "",
        storageLocation: "",
        purchaseValue: "",
      });
    }
  }, [selectedToken]);

  const handleUpdateOffer = async () => {
    try {
      const offerData = {
        id: newOffer.id, // Include ID for update
        title: newOffer.title,
        type: newOffer.type,
        currentValue: newOffer.currentValue,
        deadline: newOffer.deadline,
        status: newOffer.status === "active" ? "Active" : "Inactive",
        description: newOffer.description,
        category: newOffer.category,
        distillery: newOffer.distillery,
        caskType: newOffer.caskType,
        vintageYear: newOffer.vintageYear,
        abv: newOffer.abv,
        volume: newOffer.volume,
        image: newOffer.image,
        images: newOffer.images,
        packaging: newOffer.packaging,
        quantity: newOffer.quantity,
        certificate: newOffer.certificate,
        duration: newOffer.duration,
        testing: newOffer.testing,
        participants: newOffer.participants,
        includes: newOffer.includes,
        storageLocation: newOffer.storageLocation,
        purchaseValue: newOffer.purchaseValue,
      };

      await updateOffer(offerData.id, offerData); // Pass ID and data
      onClose();
    } catch (err) {
      console.error("Update offer failed", err);
    }
  };

  const handleTypeChange = (selectedType) => {
    setNewOffer({
      ...newOffer,
      type: selectedType,
      status: "active",
      title: newOffer.title || "",
      description: newOffer.description || "",
      image: newOffer.image || null,
      purchaseValue: newOffer.purchaseValue || "",
      currentValue: newOffer.currentValue || "",
      deadline: newOffer.deadline || "",
      distillery: selectedType === "bottle" ? newOffer.distillery || "" : "",
      caskType: selectedType === "cask" ? newOffer.caskType || "" : "",
      vintageYear: selectedType === "cask" ? newOffer.vintageYear || "" : "",
      abv: selectedType === "cask" ? newOffer.abv || "" : "",
      volume: selectedType === "cask" ? newOffer.volume || "" : "",
      packaging:
        selectedType === "bottle" || selectedType === "experience"
          ? newOffer.packaging || ""
          : "",
      quantity: selectedType === "bottle" ? newOffer.quantity || "" : "",
      certificate: selectedType === "bottle" ? newOffer.certificate || "" : "",
      duration: selectedType === "experience" ? newOffer.duration || "" : "",
      testing: selectedType === "experience" ? newOffer.testing || "" : "",
      participants:
        selectedType === "experience" ? newOffer.participants || "" : "",
      includes: selectedType === "experience" ? newOffer.includes || "" : "",
      storageLocation: newOffer.storageLocation || "",
      category: newOffer.category || "",
    });
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedToken ? `Edit Offer` : "Add Offer"}
      className="w-full overflow-hidden">
      <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div className="p-6 space-y-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Type - Always visible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors bg-white appearance-none"
                  value={newOffer.type || "cask"}
                  onChange={(e) => handleTypeChange(e.target.value)}>
                  <option value="cask">Cask</option>
                  <option value="bottle">Bottle</option>
                  <option value="experience">Experience</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Upload Image - Always visible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <div className="border border-gray-300 rounded-lg p-4 hover:border-[#B8860B] transition-colors">
                <input
                  type="file"
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                  onChange={(e) =>
                    setNewOffer({
                      ...newOffer,
                      image: e.target.files?.[0],
                    })
                  }
                />
                {!newOffer.image ? (
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center justify-between">
                    <span className="text-gray-500">Upload a photo</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </label>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {newOffer.image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(newOffer.image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-sm text-[#B8860B] hover:text-[#a0730b] font-medium">
                        Change
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setNewOffer({ ...newOffer, image: null })
                        }
                        className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {newOffer.image && (
                <div className="mt-3">
                  <img
                    src={
                      newOffer.image instanceof File
                        ? URL.createObjectURL(newOffer.image)
                        : newOffer.image
                    }
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Sliding Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sliding Images
              </label>
              <div className="border border-gray-300 rounded-lg p-4 hover:border-[#B8860B] transition-colors">
                <input
                  type="file"
                  id="sliding-images-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNewOffer({
                      ...newOffer,
                      images: [
                        ...(newOffer.images || []),
                        ...Array.from(e.target.files),
                      ],
                    })
                  }
                />
                <label
                  htmlFor="sliding-images-upload"
                  className="cursor-pointer flex items-center justify-between">
                  <span className="text-gray-500">Upload images</span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </label>
              </div>
              {newOffer.images && newOffer.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {newOffer.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={
                          img instanceof File ? URL.createObjectURL(img) : img
                        }
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewOffer({
                            ...newOffer,
                            images: newOffer.images.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CASK TYPE FIELDS */}
            {newOffer.type === "cask" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cask Type
                  </label>
                  <input
                    type="text"
                    placeholder="Sherry Hogshead"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.caskType || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, caskType: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Macallan"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.title || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      placeholder="Write here"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors resize-none"
                      value={newOffer.description || ""}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vintage Year
                  </label>
                  <input
                    type="number"
                    placeholder="1998"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.vintageYear || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, vintageYear: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ABV (%)
                    </label>
                    <input
                      type="text"
                      placeholder="63%"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.abv || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, abv: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume (L)
                    </label>
                    <input
                      type="text"
                      placeholder="500L"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.volume || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, volume: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    placeholder="Speyside Warehouse A"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.storageLocation || ""}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        storageLocation: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* BOTTLE TYPE FIELDS */}
            {newOffer.type === "bottle" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Macallan"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.title || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distillery
                    </label>
                    <input
                      type="text"
                      placeholder="Macallan"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.distillery || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, distillery: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      placeholder="Write here"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors resize-none"
                      value={newOffer.description || ""}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Packaging
                  </label>
                  <input
                    type="text"
                    placeholder="Premium Gift Box"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.packaging || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, packaging: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="6"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.quantity || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume (L)
                    </label>
                    <input
                      type="text"
                      placeholder="500ml"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.volume || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, volume: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate
                  </label>
                  <input
                    type="text"
                    placeholder="Authenticity Included"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.certificate || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, certificate: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* EXPERIENCE TYPE FIELDS */}
            {newOffer.type === "experience" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Macallan"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.title || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      placeholder="Write here"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors resize-none"
                      value={newOffer.description || ""}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Packaging
                  </label>
                  <input
                    type="text"
                    placeholder="Premium Gift Box"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.packaging || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, packaging: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="6"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.duration || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, duration: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testing
                    </label>
                    <input
                      type="text"
                      placeholder="12 Premium Whiskies"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.category || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, category: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants
                    </label>
                    <input
                      type="text"
                      placeholder="Authenticity Included"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.participants || ""}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          participants: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Includes
                    </label>
                    <input
                      type="text"
                      placeholder="Food Pairing"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                      value={newOffer.includes || ""}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, includes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {/* Valuation - Always visible */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Valuation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Value ($)
                  </label>
                  <input
                    type="text"
                    placeholder="12.00"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.purchaseValue || ""}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        purchaseValue: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value ($)
                  </label>
                  <input
                    type="text"
                    placeholder="10,000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                    value={newOffer.currentValue || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, currentValue: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Deadline - Always visible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                  value={newOffer.deadline || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, deadline: e.target.value })
                  }
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
            <button
              onClick={handleUpdateOffer}
              disabled={loading}
              className="px-8 py-3 bg-[#B8860B] flex gap-2 items-center text-white rounded-lg hover:bg-[#a0730b] transition-colors font-medium shadow-sm disabled:opacity-50">
              {loading && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default UpdateOffer;
