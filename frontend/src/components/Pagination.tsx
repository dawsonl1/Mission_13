interface Props {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function Pagination({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {pages.map((p) => (
            <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <div className="d-flex align-items-center gap-2">
        <label className="form-label mb-0">Per page:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Pagination;
