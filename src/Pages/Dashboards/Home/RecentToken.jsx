import { Link } from "react-router-dom";

const RecentToken = () => {
  const tokens = [
  {
    id: 1,
    username: "Albert Einstein",
    email: "albert.einstein@example.com",
    token: "982374",
  },
  {
    id: 2,
    username: "Maya Angelou",
    email: "maya.angelou@example.com",
    token: "764512",
  },
  {
    id: 3,
    username: "Steve Jobs",
    email: "steve.jobs@example.com",
    token: "348901",
  },
  {
    id: 4,
    username: "Confucius",
    email: "confucius@example.com",
    token: "220145",
  },
  {
    id: 5,
    username: "Helen Keller",
    email: "helen.keller@example.com",
    token: "117893",
  },
];


  return (
    <div className="overflow-x-auto border h-full border-gray-200 rounded-xl p-5">
      <h2 className="text-2xl font-semibold mb-3">Recent Token</h2>

      <table className="min-w-full rounded-xl text-left overflow-hidden">
        <thead className="">
          <tr className="text-sm  bg-[#B7C8FF]">
            <th className="p-4">User Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Token</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {tokens.map((token) => (
            <tr key={token?.id} className="border-t border-gray-200">
              <td className="py-3 px-4 text-left hover:text-blue-500 hover:underline">
                <Link to={`/author/${token?._id}`}>{token?.username}</Link>
              </td>
              <td className="py-3 px-4">{token?.email}</td>
              <td className="py-3 px-4">{token?.token}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentToken;
