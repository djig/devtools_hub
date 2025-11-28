// Web Worker for exporting data (JSON, CSV, ZIP)
importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');

// Helper function to flatten nested objects
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      acc[newKey] = JSON.stringify(value);
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {});
}

self.onmessage = async function(e) {
  const { type, data, schemaText } = e.data;

  try {
    switch (type) {
      case 'json':
        const jsonString = JSON.stringify(data, null, 2);
        self.postMessage({
          type: 'complete',
          format: 'json',
          data: jsonString,
          size: new Blob([jsonString]).size
        });
        break;

      case 'csv':
        if (data.length === 0) {
          self.postMessage({
            type: 'error',
            error: 'No data to export'
          });
          return;
        }

        const flatData = data.map(item => flattenObject(item));
        const headers = Object.keys(flatData[0]).join(',');
        const rows = flatData.map(item =>
          Object.values(item).map(val => {
            const str = String(val === null || val === undefined ? '' : val);
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          }).join(',')
        );
        const csvString = [headers, ...rows].join('\n');

        self.postMessage({
          type: 'complete',
          format: 'csv',
          data: csvString,
          size: new Blob([csvString]).size
        });
        break;

      case 'zip':
        const zip = new JSZip();

        // Add JSON
        const jsonData = JSON.stringify(data, null, 2);
        zip.file('data.json', jsonData);

        // Add CSV
        const flatDataForZip = data.map(item => flattenObject(item));
        const headersForZip = Object.keys(flatDataForZip[0]).join(',');
        const rowsForZip = flatDataForZip.map(item =>
          Object.values(item).map(val => {
            const str = String(val === null || val === undefined ? '' : val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          }).join(',')
        );
        const csvDataForZip = [headersForZip, ...rowsForZip].join('\n');
        zip.file('data.csv', csvDataForZip);

        // Add schema
        zip.file('schema.json', schemaText);

        // Generate ZIP with compression
        const zipBlob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 9 }
        }, (metadata) => {
          // Report progress
          self.postMessage({
            type: 'progress',
            progress: metadata.percent
          });
        });

        // Convert blob to array buffer for transfer
        const arrayBuffer = await zipBlob.arrayBuffer();
        const originalSize = new Blob([jsonData]).size;

        self.postMessage({
          type: 'complete',
          format: 'zip',
          data: arrayBuffer,
          originalSize,
          compressedSize: arrayBuffer.byteLength
        }, [arrayBuffer]); // Transfer ownership
        break;

      default:
        self.postMessage({
          type: 'error',
          error: 'Unknown export type'
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
};
