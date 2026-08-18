import './Tracker.css';

const STATUS_OPTIONS = [
  "Not yet tried",
  "Should try again",
  "Will do again",
  "Not so often",
  "Not doing it again",
  "Not possible"
];

function Tracker({ hobbies, onUpdate, onDelete }) {
  
  const handleRating = (hobbyName, rating) => {
    onUpdate(hobbyName, { rating });
  };

  const handleStatusChange = (hobbyName, e) => {
    onUpdate(hobbyName, { status: e.target.value });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString();
  };

  if (hobbies.length === 0) {
    return (
      <div className="tracker-container">
        <div className="empty-state">
          <h3>No Hobbies Yet</h3>
          <p>Go to the Discover tab and spin the wheel to find your first hobby!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <h2 className="text-gradient">My Tracker</h2>
        <p>Keep track of the hobbies you've discovered and how you feel about them.</p>
      </div>

      <div className="tracker-table-wrapper">
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Hobby</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Date Picked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hobbies.map((hobby) => (
              <tr key={hobby.name}>
                <td>
                  <div className="col-hobby">{hobby.name}</div>
                  <div className="cat-badge">{hobby.category}</div>
                </td>
                
                <td>
                  <select 
                    className="status-select" 
                    value={hobby.status || "Not yet tried"}
                    onChange={(e) => handleStatusChange(hobby.name, e)}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>

                <td>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${(hobby.rating || 0) >= star ? 'active' : ''}`}
                        onClick={() => handleRating(hobby.name, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>

                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  {formatDate(hobby.datePicked)}
                </td>

                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => onDelete(hobby.name)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tracker;
