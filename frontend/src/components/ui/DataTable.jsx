/**
 * Reusable data table with column definitions, empty state, and optional row expansion.
 * 
 * @param {Array<{key: string, label: string}>} columns - Column definitions
 * @param {Array} data - Row data
 * @param {Function} renderRow - (item, index) => <tr> element
 * @param {Function} [renderExpansion] - (item, index) => <tr> element or null (renders inline card below row)
 * @param {string} emptyMessage - Message when no data
 */
export default function DataTable({ columns, data, renderRow, renderExpansion, emptyMessage = 'No data found' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((item, index) => (
            <>
              {renderRow(item, index)}
              {renderExpansion && renderExpansion(item, index)}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
