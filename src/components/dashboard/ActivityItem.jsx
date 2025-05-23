const ActivityItem = ({ title, studentName, createdAt, status}) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded flex flex-col duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border">
    <div className="flex justify-between items-center">
      <h4 className="text-lg font-semibold">{title}</h4>
      <span
        className={`px-2 py-1 rounded text-sm ${
          status === "approved"
            ? "bg-green-200 text-green-800"
            : status === "rejected"
            ? "bg-red-200 text-red-800"
            : "bg-yellow-200 text-yellow-800"
        }`}
      >
        {status || "Pending"}
      </span>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Student: {studentName}</p>
    <p className="text-sm text-gray-400">
      {createdAt?.toDate
        ? new Date(createdAt.toDate()).toLocaleDateString()
        : "Date unknown"}
    </p>
  </div>
);

export default ActivityItem;
