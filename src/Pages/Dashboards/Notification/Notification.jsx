import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import CommonModal from "../../../components/Common/CommonModal";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    title: "LeadPilot AI",
    message:
      "Property details for Linda Sanders have been collected and are ready for review.",
    time: "5h ago",
    image:
      "https://images.squarespace-cdn.com/content/v1/6270dcb52a53a65bc96c6dae/ee43aff3-f27d-409f-b5be-a53dd7f494e0/image-asset.jpeg",
    read: false,
  },
  {
    id: 2,
    title: "New Lead Assigned",
    message: "A new lead has been assigned to you: Robert Johnson.",
    time: "2h ago",
    image: "https://luxoplace.ca/wp-content/uploads/apartment_luxo_2.jpg",
    read: false,
  },
  {
    id: 3,
    title: "Reminder",
    message: "Follow up with Jessica Miller about her recent property inquiry.",
    time: "1d ago",
    image:
      "https://pbazaar.com/content/images/thumbs/0182447_1369-sft-ongoing-apartment-for-sale-mirpur.jpeg",
    read: false,
  },
  {
    id: 4,
    title: "Meeting Scheduled",
    message: "Your meeting with Sarah Brown is confirmed for tomorrow at 3PM.",
    time: "3h ago",
    image:
      "https://www.bdhousing.com/api/list/listings/100X100/237260/166e7339df90349227fc4730c2327362.jpg",
    read: false,
  },
  {
    id: 5,
    title: "New Message",
    message:
      "Client Alex Turner has sent a message regarding the 2BHK listing.",
    time: "10m ago",
    image:
      "https://images.squarespace-cdn.com/content/v1/6270dcb52a53a65bc96c6dae/ee43aff3-f27d-409f-b5be-a53dd7f494e0/image-asset.jpeg",
    read: false,
  },
  {
    id: 6,
    title: "Price Update",
    message: "The price of property ID #45213 has been updated.",
    time: "4h ago",
    image: "https://luxoplace.ca/wp-content/uploads/apartment_luxo_2.jpg",
    read: false,
  },
  {
    id: 7,
    title: "Client Feedback",
    message: "You received new feedback from Emily Watson.",
    time: "30m ago",
    image:
      "https://pbazaar.com/content/images/thumbs/0182447_1369-sft-ongoing-apartment-for-sale-mirpur.jpeg",
    read: false,
  },
  {
    id: 8,
    title: "Call Scheduled",
    message: "Your call with Jason Lee is scheduled for 5 PM today.",
    time: "15m ago",
    image:
      "https://www.bdhousing.com/api/list/listings/100X100/237260/166e7339df90349227fc4730c2327362.jpg",
    read: false,
  },
  {
    id: 9,
    title: "Offer Received",
    message: "An offer has been received for property ID #67890.",
    time: "45m ago",
    image:
      "https://images.squarespace-cdn.com/content/v1/6270dcb52a53a65bc96c6dae/ee43aff3-f27d-409f-b5be-a53dd7f494e0/image-asset.jpeg",
    read: false,
  },
  {
    id: 10,
    title: "Site Visit Confirmed",
    message: "The site visit for Mia Rodriguez is confirmed for Friday.",
    time: "6h ago",
    image: "https://luxoplace.ca/wp-content/uploads/apartment_luxo_2.jpg",
    read: false,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (item) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const handleClickNotification = (item) => {
    const updated = notifications.map((n) =>
      n.id === item.id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setSelected(item); // Set selected item
    setIsModalOpen(true); // Open modal properly
  };

  const navigate = useNavigate();

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 mb-6">
          <button className="text-2xl cursor-pointer" onClick={() => navigate(-1)}>
            <RiArrowLeftLine />
          </button>
          <h1 className="text-2xl font-semibold">Notification</h1>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-blue-500 flex items-center gap-1"
        >
          <FaCheck className="text-sm" />
          Mark all as read
        </button>
      </div>

      <div className="">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex gap-4 py-4 cursor-pointer hover:bg-blue-100 transform duration-200 border-b border-gray-100 px-5 ${
              item.read ? "text-gray-500" : "font-semibold"
            }`}
            onClick={() => handleClickNotification(item)}
          >
            <img src={item.image} alt="AI" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <button
                onClick={() => handleView(item)}
                className="hover:text-blue-500"
              >
                {item.title}
              </button>
              <div className="text-sm">{item.message}</div>
            </div>
            <div className="text-sm text-gray-400 whitespace-nowrap">
              {item.time}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-blue-600 cursor-pointer">
        View all notification
      </div>

      {/* ✅ Modal with selected data */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Notification Details"
      >
        {selected && (
          <div className="space-y-3">
            <p className="text-lg font-bold">{selected.title}</p>
            <p className="text-gray-500">{selected.time}</p>
            <p>{selected.message}</p>
          </div>
        )}
      </CommonModal>
    </div>
  );
};

export default Notifications;
