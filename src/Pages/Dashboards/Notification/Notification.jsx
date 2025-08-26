/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import CommonModal from "../../../components/Common/CommonModal";
import { useForm } from "react-hook-form";
import apiClient from "../../../lib/api-client";
import useUserData from "../../../hook/useUserData";
import Loader from "../../../components/Common/Loader";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { users } = useUserData(1, 10, "");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const isGlobal = watch("isGlobal"); // ✅ watch checkbox value

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async (page = 1) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/notifications`);
        setNotifications(response.data.data.notifications);
        setPagination(response.data.data.pagination);
        setUnreadCount(response.data.data.unreadCount);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notifications. Please try again.");
        setLoading(false);
      }
    };
    fetchNotifications(pagination.current);
  }, []);

  const handleView = (item) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  const handleClickNotification = async (item) => {
    if (!item.isRead) {
      try {
        await apiClient.put(`/notifications/${item.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      } catch (err) {
        setError("Failed to mark notification as read.");
      }
    }
    handleView(item);
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError("Failed to mark all notifications as read.");
    }
  };

  const handleCreateNotification = async (data) => {
    try {
      setError(null);

      console.log("Purchase", data);

      await apiClient.post("/notifications", {
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        category: data.category,
        adminNotes: data.adminNotes,
        isGlobal: data.isGlobal, // ✅ send checkbox value
        recipient: data.isGlobal ? null : data.recipient, // ✅ only send if not global
      });

      setIsCreateModalOpen(false);
      reset();
      // Refresh notifications
      const response = await apiClient.get(`/notifications`);
      setNotifications(response.data.data.notifications);
      setPagination(response.data.data.pagination);
      setUnreadCount(response.data.data.unreadCount);
      alert("Notification created successfully!");
    } catch (err) {
      setError("Failed to create notification. Please try again.");
    }
  };

  const loadMore = async () => {
    if (pagination.current < pagination.pages) {
      try {
        setLoading(true);
        const nextPage = pagination.current + 1;
        const response = await apiClient.get(
          `/notifications?page=${nextPage}&limit=${pagination.limit}`
        );
        setNotifications((prev) => [
          ...prev,
          ...response.data.data.notifications,
        ]);
        setPagination(response.data.data.pagination);
        setUnreadCount(response.data.data.unreadCount);
        setLoading(false);
      } catch (err) {
        setError("Failed to load more notifications.");
        setLoading(false);
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log("uiser", notifications);

  return (
    <div className="mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-900">
          Notifications ({unreadCount} unread)
        </h1>
        <div className="flex gap-2">
          {unreadCount > 1 && (
            <button
              onClick={markAllAsRead}
              className="bg-[#B8860B] hover:bg-[#a0730b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              disabled={unreadCount === 0}>
              Mark All as Read
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#B8860B] hover:bg-[#a0730b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + Create Notification
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-0 relative">
        {loading && (
          <div className=" flex items-center justify-center bg-white/60 z-10">
            <Loader />
          </div>
        )}

        {notifications.length === 0 && !loading && (
          <div className=" flex items-center justify-center bg-white/60 z-10">
            <p className="text-gray-500">No notifications available.</p>
          </div>
        )}

        {!loading &&
          notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 py-6 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                item.isRead ? "opacity-60" : ""
              }`}
              onClick={() => handleClickNotification(item)}>
              {/* Circular icon */}
              <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-purple-700 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {item.category.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.message}
                </p>
              </div>

              <div className="text-sm text-gray-500 flex-shrink-0">
                {item.time}
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {pagination.current < pagination.pages && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="bg-[#B8860B] hover:bg-[#a0730b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Notification Details Modal */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Notification Details">
        {selected && (
          <div className="space-y-3">
            <p className="text-lg font-bold">{selected.title}</p>
            <p className="text-gray-500">{selected.time}</p>
            <p>{selected.message}</p>
            <p className="text-sm text-gray-400">
              Priority: {selected.priority} | Type: {selected.type} | Category:{" "}
              {selected.category}
            </p>
          </div>
        )}
      </CommonModal>

      {/* Create Notification Modal */}
      <CommonModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setError(null);
          reset();
        }}
        title="Create Notification">
        <form
          onSubmit={handleSubmit(handleCreateNotification)}
          className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-300 p-3 rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Message</label>
            <textarea
              {...register("message", { required: "Message is required" })}
              className="w-full border border-gray-300 p-3 rounded"
              rows="4"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Type</label>
            <select
              {...register("type")}
              className="w-full border border-gray-300 p-3 rounded">
              <option value="system">System</option>
              <option value="tier">Tier</option>
              <option value="referral">Referral</option>
              <option value="payment">Payment</option>
              <option value="cask">Cask</option>
              <option value="offer">Offer</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>

          {/* Global Checkbox */}
          <div className="flex items-center gap-2">
            <label className="block">Is Global</label>
            <input type="checkbox" {...register("isGlobal")} />
          </div>

          {/* Recipient only if NOT global */}
          {!isGlobal && (
            <div>
              <label className="block mb-1">Recipient</label>
              <select
                {...register("recipient", {
                  required: "Recipient user ID is required",
                })}
                className="w-full border border-gray-300 p-3 rounded">
                <option value="">-- Select a user --</option>
                {users.length > 0 &&
                  users.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              {errors.recipient && (
                <p className="text-red-500 text-sm">
                  {errors.recipient.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-1">Admin Notes</label>

            <textarea
              {...register("adminNotes")}
              className="w-full border border-gray-300 p-3 rounded"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#a0730b] transition"
            disabled={loading}>
            {loading ? "Creating..." : "Create Notification"}
          </button>
        </form>
      </CommonModal>
    </div>
  );
};

export default Notifications;
