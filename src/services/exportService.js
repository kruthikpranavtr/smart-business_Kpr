// Export Service for SMARTORA
// Handles CSV generation and formatted PDF/Print layout

export const exportService = {
  // Generates and downloads a CSV file directly in the browser
  downloadCSV: (filename, rows, headers) => {
    if (!rows || !rows.length) return;

    const columnHeaders = headers || Object.keys(rows[0]);
    const csvContent = [
      columnHeaders.join(','),
      ...rows.map(row =>
        columnHeaders
          .map(header => {
            let val = row[header] === undefined || row[header] === null ? '' : row[header];
            // Format strings with quotes to escape commas
            if (typeof val === 'string') {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Triggers browser print dialog for printable report view
  printReport: () => {
    window.print();
  }
};
