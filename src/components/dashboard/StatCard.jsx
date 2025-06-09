const StatCard = ({ label, count }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md text-center">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm">{label}</h3>
    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{count}</p>
  </div>
);

export default StatCard;
