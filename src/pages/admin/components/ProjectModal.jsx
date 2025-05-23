import React, { useState, useEffect } from "react";

const ProjectModal = ({
  project,
  userProfile,
  onClose,
  onSubmitReview,
  onApproveReject,
  fetchSingleDoc, // 👈 MUST be passed in from parent
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewerNames, setReviewerNames] = useState({});

  const isStudent = userProfile?.role === "student";
  const isAdmin = userProfile?.role === "admin";
  const isStaff = userProfile?.role === "staff";
  const isSupervisor = project.supervisorId === userProfile?.uid;

  const reviewers = project.reviews || [];

  const hasReviewed = reviewers.some(r => r.reviewerId === userProfile?.uid);
  const canReview = isStaff && !isSupervisor && !hasReviewed && reviewers.length < 2;

  const averageRating =
    reviewers.reduce((sum, r) => sum + r.rating, 0) / (reviewers.length || 1);

  const canApprove =
    isSupervisor &&
    reviewers.length >= 2 &&
    averageRating >= 5;

  useEffect(() => {
    // ⚙️ Fetch and store reviewer names
    const fetchReviewerNames = async () => {
      const uniqueReviewerIds = [...new Set(reviewers.map(r => r.reviewerId))];
      const names = {};

      await Promise.all(
        uniqueReviewerIds.map(async (uid) => {
          if (uid && !reviewerNames[uid]) {
            const user = await fetchSingleDoc("users", uid);
            if (user) names[uid] = user.name;
          }
        })
      );

      setReviewerNames(prev => ({ ...prev, ...names }));
    };

    if (reviewers.length > 0) fetchReviewerNames();
  }, [reviewers]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{project.title}</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-lg">✕</button>
        </div>

        <div className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <h4>Description</h4>
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
          </div>

          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              GitHub Link
            </a>
          )}

          {isStudent && (
            <div className="text-sm text-gray-500">
              <p><strong>Supervisor:</strong> {project.supervisorName || "N/A"}</p>
              <p><strong>Status:</strong> {project.status}</p>
            </div>
          )}

          {canReview && (
            <div className="space-y-2">
              <h4 className="font-semibold">Submit Your Review</h4>
              <input
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
              <textarea
                rows="4"
                placeholder="Write your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button
                onClick={() => onSubmitReview(project.id, {
                  reviewerId: userProfile.uid,
                  rating,
                  comment,
                  reviewedAt: new Date()
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </div>
          )}

          {isSupervisor && (
            <div className="space-x-4">
              <button
                disabled={!canApprove}
                onClick={() => onApproveReject(project.id, "approved")}
                className={`px-4 py-2 rounded text-white ${canApprove ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Approve
              </button>
              <button
                onClick={() => onApproveReject(project.id, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-semibold">Reviews:</h4>
            {reviewers.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews submitted yet.</p>
            ) : (
              <ul className="space-y-2">
                {reviewers.map((r, index) => (
                  <li key={index} className="text-sm border-b pb-2">
                    <p><strong>Reviewer:</strong> {reviewerNames[r.reviewerId] || r.reviewerId}</p>
                    <p><strong>Rating:</strong> {r.rating}</p>
                    <p><strong>Comment:</strong> {r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
