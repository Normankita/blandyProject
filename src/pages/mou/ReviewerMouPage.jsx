import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';
import TableComponent from '../admin/components/TableComponent';

const ReviewerMouPage = () => {
  const { fetchData, updateData, userProfile } = useData();

  const [loading, setLoading] = useState(false);
  const [reviewableMOUs, setReviewableMOUs] = useState([]);
  const [users, setUsers] = useState([]);

  // Build a map for quick user name lookups
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((user) => {
      map[user.uid] = user.name;
    });
    return map;
  }, [users]);

  // Fetch MOUs assigned to current reviewer
  const fetchMOUs = async () => {
    setLoading(true);
    try {
      const { data: mous } = await fetchData({ path: 'mous' });
      const { data: usersData } = await fetchData({ path: 'users' });

      setUsers(usersData);

      const pending = mous.filter((mou) =>
        mou.reviewers?.some(
          (r) => r.reviewerId === userProfile.uid && !r.decision
        )
      );

      setReviewableMOUs(pending);
    } catch (err) {
      toast.error('Failed to load MOUs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.uid) {
      fetchMOUs();
    }
  }, [userProfile?.uid]);

  // Handle Approve/Reject Action
  const handleDecision = async (mouId, decision) => {
    console.log(mouId);

    setLoading(true);
    try {
      const mou = reviewableMOUs.find((m) => m.id === mouId);
      if (!mou) throw new Error('MOU not found');

      const updatedReviewers = mou.reviewers.map((r) =>
        r.reviewerId === userProfile.uid
          ? {
            ...r,
            decision,
            comment: '',
            decidedAt: new Date().toISOString(),
          }
          : r
      );

      await updateData('mous', mouId, { reviewers: updatedReviewers });

      toast.success(`MOU "${mou.title}" ${decision.toUpperCase()}ED`);

      // Update state locally instead of refetching all
      setReviewableMOUs((prev) => prev.filter((m) => m.id !== mouId));
    } catch (err) {
      toast.error('Failed to update decision');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const custom = (mou) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleDecision(mou.original.id, 'approved')}
          className="text-gray-900 bg-white border font-bold rounded-full text-sm px-4 py-1.5 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-950 shadow-lg dark:shadow-black/40 flex flex-row gap-1 items-center hover:bg-green-100 border-green-300 dark:border-green-600 dark:focus:ring-green-700 dark:hover:border-green-600 focus:ring-green-100"
        >
          Approve
        </button>
        <button
          onClick={() => handleDecision(mou.original.id, 'rejected')}
          className="text-gray-900 bg-white border font-bold rounded-full text-sm px-4 py-1.5 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-950 shadow-lg dark:shadow-black/40 flex flex-row gap-1 items-center hover:bg-red-100 border-red-300 dark:border-red-600 dark:focus:ring-red-700 dark:hover:border-red-600 focus:ring-red-100"
        >
          Reject
        </button>
      </div>
    );
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        MOUs Pending Your Review
      </h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : reviewableMOUs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No MOUs awaiting your review.
        </p>
      ) : (
        <TableComponent
          headers={['Title', 'Created At', 'Parties']}
          ItemData={reviewableMOUs.map((mou) => ({
            Title: mou.title,
            'Created At': new Date(mou.createdAt).toLocaleString(),
            Parties: mou.parties
              ?.map((p) => userMap[p.partyId] || 'Unknown')
              .join(', '),
            original: mou, // Preserve the original mou
          }))}
          customActions={custom}
        />

      )}
    </div>
  );
};

export default ReviewerMouPage;
