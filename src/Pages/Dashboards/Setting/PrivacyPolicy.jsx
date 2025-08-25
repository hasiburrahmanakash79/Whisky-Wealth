import { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../lib/api-client"; // ঠিক path অনুযায়ী import করো
import toast from "react-hot-toast";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // শুরুতে edit mode এ থাকবে
  const [description, setDescription] = useState("");

  const [formData, setFormData] = useState({
    terms: `
    <p>
      At <strong>Aroma Queen</strong>, your privacy and trust are extremely important to us. 
      This Privacy Policy outlines how we collect, use, and protect your personal information when 
      you visit our website or make a purchase through our platform.
    </p>

    <h3>Information We Collect</h3>
    <p>
      We collect information that you provide when you register, place an order, subscribe to our newsletter, 
      or interact with our content. This may include your name, email address, shipping information, and 
      payment details. We also collect anonymous data like browser type and usage patterns to improve user experience.
    </p>

    <h3>How We Use Your Information</h3>
    <p>
      The information we collect helps us to:
      <ul>
        <li>Process and deliver your orders efficiently</li>
        <li>Send you updates, offers, and helpful content</li>
        <li>Improve our website, products, and services</li>
        <li>Ensure secure transactions and customer support</li>
      </ul>
    </p>

    <h3>Third-Party Sharing</h3>
    <p>
      We never sell your personal data. We may share necessary details with trusted third-party services 
      (like delivery partners or payment gateways) solely for order fulfillment and security. All partners 
      follow strict data protection standards.
    </p>

    <h3>Cookies</h3>
    <p>
      Aroma Queen uses cookies to enhance your browsing experience. Cookies help us remember your preferences, 
      personalize content, and track website traffic. You can manage or disable cookies through your browser settings.
    </p>

    <h3>Security</h3>
    <p>
      We implement a variety of security measures to safeguard your personal information. However, no online 
      transmission is 100% secure. We are committed to taking all reasonable steps to protect your data.
    </p>

    <h3>Your Rights</h3>
    <p>
      You have the right to access, update, or delete your personal information at any time. If you wish 
      to opt-out of marketing emails, you can do so via the unsubscribe link in any of our emails.
    </p>

    <p>
      By using our site, you agree to this Privacy Policy. We may update it from time to time, and we’ll notify you 
      of any significant changes.
    </p>

    <p>
      If you have any questions or concerns about your privacy, feel free to contact us at 
      <a href="mailto:support@aromaqueen.com">support@aromaqueen.com</a>.
    </p>
  `,
  });
  const handleEditClick = () => {
    setDescription(formData.terms); // load old content
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save locally
      setFormData((prev) => ({ ...prev, terms: description }));

      // API call
      const response = await apiClient.post("/terms", {
        type: "privacy",
        content: description,
      });

      toast.success("Privacy policy updated successfully!");
      console.log("API Response:", response.data);

      setIsEditing(false);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error("Failed to update privacy policy");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }, { font: [] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ align: [] }],
      ["link", "image"],
    ],
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="cursor-pointer"
            title="Go back">
            <IoArrowBackOutline className="text-xl" />
          </button>
          <h2 className="font-semibold text-lg">Privacy Policy</h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {!isEditing ? (
          <div
            className="leading-7 privacy-content"
            dangerouslySetInnerHTML={{ __html: formData.terms }}
          />
        ) : (
          <ReactQuill
            value={description}
            onChange={setDescription}
            theme="snow"
            modules={modules}
            placeholder="Write your privacy policy here..."
            className="quill-custom   text-black"
            style={{ height: "50vh" }} // default height 40vh
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end px-5 pb-5 mt-10">
        {!isEditing ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // safety
              handleEditClick();
            }}
            className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#a0730b] transition">
            ✎ Edit
          </button>
        ) : (
          <button
            type="submit"
            className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#a0730b] transition">
            Update Info
          </button>
        )}
      </div>
    </form>
  );
};

export default PrivacyPolicy;
