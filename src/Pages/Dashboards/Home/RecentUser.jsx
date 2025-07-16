const RecentUser = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      dob: "1990-01-01",
      role: "User",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "234-567-8901",
      dob: "1992-02-02",
      role: "Admin",
    },
    {
      id: 3,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "345-678-9012",
      dob: "1988-03-03",
      role: "User",
    },
    {
      id: 4,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "456-789-0123",
      dob: "1995-04-04",
      role: "User",
    },
    {
      id: 5,
      name: "Mike Brown",
      email: "mike@example.com",
      phone: "567-890-1234",
      dob: "1991-05-05",
      role: "Moderator",
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "678-901-2345",
      dob: "1993-06-06",
      role: "User",
    },
    {
      id: 7,
      name: "David Lee",
      email: "david@example.com",
      phone: "789-012-3456",
      dob: "1989-07-07",
      role: "User",
    },
  ];

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl p-5">
      <h2 className="text-2xl font-semibold mb-5">Recent User</h2>
      <table className="min-w-full rounded-xl text-center overflow-hidden">
        <thead>
          <tr className="text-sm  bg-[#B7C8FF]">
            <th className="p-4 text-left">User Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Number</th>
            <th className="p-4">Date of Birth</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {users?.map((user, idx) => (
            <tr key={idx} className="border-t border-gray-200">
              <td className="py-3 px-4 text-left">{user?.name || "N/A"}</td>
              <td className="py-4 px-4">{user?.email}</td>
              <td className="py-3 px-4">0{user?.phone || "N/A"}</td>
              <td className="py-3 px-4">{user?.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentUser;
