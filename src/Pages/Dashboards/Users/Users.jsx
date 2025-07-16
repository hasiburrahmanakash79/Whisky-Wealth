import { useState } from "react";
import {
  RiArrowLeftLine,
  RiDeleteBin5Line,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../../components/Common/CommonModal"; // ✅ Make sure this path is correct

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    dob: "1990-01-01",
    role: "User",
    country: "USA",
    specialty: "Frontend Development",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "234-567-8901",
    dob: "1992-02-02",
    role: "Admin",
    country: "Canada",
    specialty: "Project Management",
  },
  {
    id: 3,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "345-678-9012",
    dob: "1988-03-03",
    role: "User",
    country: "UK",
    specialty: "Backend Development",
  },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "456-789-0123",
    dob: "1995-04-04",
    role: "User",
    country: "Australia",
    specialty: "UI/UX Design",
  },
  {
    id: 5,
    name: "Mike Brown",
    email: "mike@example.com",
    phone: "567-890-1234",
    dob: "1991-05-05",
    role: "Moderator",
    country: "Germany",
    specialty: "Security Analysis",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "678-901-2345",
    dob: "1993-06-06",
    role: "User",
    country: "France",
    specialty: "Data Science",
  },
  {
    id: 7,
    name: "David Lee",
    email: "david@example.com",
    phone: "789-012-3456",
    dob: "1989-07-07",
    role: "User",
    country: "Singapore",
    specialty: "Cloud Engineering",
  },
  {
    id: 8,
    name: "Sophia Wilson",
    email: "sophia@example.com",
    phone: "890-123-4567",
    dob: "1994-08-08",
    role: "User",
    country: "India",
    specialty: "Mobile App Development",
  },
  {
    id: 9,
    name: "Daniel Martinez",
    email: "daniel@example.com",
    phone: "901-234-5678",
    dob: "1990-09-09",
    role: "Admin",
    country: "Spain",
    specialty: "DevOps",
  },
];

const Users = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleted user:", userToDelete);
    // TODO: Remove user from list or trigger API call here
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div>
      
      <div className="overflow-x-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            className="text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <RiArrowLeftLine />
          </button>
          <h1 className="text-2xl font-semibold">All Users</h1>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <table className="min-w-full rounded-xl text-center overflow-hidden">
            <thead>
              <tr className="text-sm bg-[#B7C8FF]">
                <th className="p-4 text-left rounded-tl-xl">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Number</th>
                <th className="p-4">Date of Birth</th>
                <th className="p-4">Specialty</th>
                <th className="p-4">Country</th>
                <th className="p-4 rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {users.map((user, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-left">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-3 px-4">0{user.phone}</td>
                  <td className="py-3 px-4">{user.dob}</td>
                  <td className="py-3 px-4">{user.specialty}</td>
                  <td className="py-3 px-4">{user.country}</td>
                  <td className="py-4 px-4 flex justify-center text-xl">
                    <button onClick={() => handleDeleteClick(user)}>
                      <RiDeleteBin5Line className="text-red-500 hover:text-red-700 transition" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Delete Confirmation Modal */}
        <CommonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Delete"
        >
          {userToDelete && (
            <div className="space-y-4 text-center">
              <p className="text-lg">
                Are you sure you want to delete{" "}
                <span className="">{userToDelete.name}</span>?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border border-blue-300 px-5 py-3 rounded-md"
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn-primary">
                  Confirm
                </button>
              </div>
            </div>
          )}
        </CommonModal>
      </div>
    </div>
  );
};

export default Users;
