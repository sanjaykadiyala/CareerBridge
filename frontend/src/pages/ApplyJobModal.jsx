import { useState } from "react";

function ApplyJobModal({
  job,
  applying,
  onApply,
  onClose,
}) {
  const [coverLetter, setCoverLetter] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const applicationSuccessful = await onApply(
      job._id,
      coverLetter
    );

    if (applicationSuccessful) {
      onClose();
    }
  }

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <div
        className="apply-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="apply-modal-header">
          <div>
            <span>APPLYING FOR</span>
            <h2>{job.title}</h2>
            <p>{job.company}</p>
          </div>

          <button
            type="button"
            className="apply-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="cover-letter">
            Cover letter
          </label>

          <textarea
            id="cover-letter"
            value={coverLetter}
            onChange={(event) =>
              setCoverLetter(event.target.value)
            }
            maxLength="1000"
            rows="8"
            placeholder="Briefly explain why you are suitable for this job..."
            required
          />

          <div className="cover-letter-count">
            {coverLetter.length}/1000 characters
          </div>

          <div className="apply-modal-actions">
            <button
              type="button"
              className="apply-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="apply-modal-submit"
              disabled={applying}
            >
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyJobModal;