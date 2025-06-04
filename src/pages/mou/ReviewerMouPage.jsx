import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';
import TableComponent from '../admin/components/TableComponent';
import ProjectModal from '../admin/components/ProjectModal';

const ReviewerMouPage = () => {
  const { fetchData, updateData, userProfile } = useData();

  const[selectedMou, setSelectedMou]=useState(null);

  const [loading, setLoading] = useState(false);
  const [reviewableMOUs, setReviewableMOUs] = useState([]);
  const [users, setUsers] = useState([]);



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

    // Build a map for quick user name lookups
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((user) => {
      map[user.id] = user.name;
    });
    return map;
  }, [users]);

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
          onClick={() => setSelectedMou(mou)}
          className="text-gray-900 bg-white border font-bold rounded-full text-sm px-4 py-1.5 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-950 shadow-lg dark:shadow-black/40 flex flex-row gap-1 items-center hover:bg-gray-100 border-gray-300 dark:border-gray-600 dark:focus:ring-gray-700 dark:hover:border-gray-600 focus:ring-gray-100"
        >
          View
        </button>
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

      {selectedMou && (
        <ProjectModal
          title={selectedMou.original.title}
          onClose={() => setSelectedMou(null)}
        >
          <div className="prose dark:prose-invert max-w-none">
            <h4>Description:</h4>
            <p className='ml-2'><i className='text-sm'><div dangerouslySetInnerHTML={{ __html: selectedMou.original.description }} /></i></p>
          </div>

          {selectedMou.original.documentUrl && (
            <a href={selectedMou.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-4 flex items-center gap-2 mt-2">
              <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
              </svg>
              Document
            </a>
          )}
          <div className="prose dark:pros-invert max-w-none">
            <h4 className='font-bold'>Involved Parties</h4>
            <ul>
              {selectedMou.original.parties?.map((p) => (
                <li key={p.partyId} className='pl-5 my-1 border-l-2 border-gray-400 border-b-5'>
                  <span className='font-semibold'>{userMap[p.partyId] || 'Unknown'}</span> <span className='text-gray-400'>{p.signedAt ? `:->signed at ${new Date(p.signedAt).toLocaleString()}` : ''}</span>
                </li>
              ))}
            </ul>
          </div>

        </ProjectModal>
      )}
    </div>
  );
};

export default ReviewerMouPage;
