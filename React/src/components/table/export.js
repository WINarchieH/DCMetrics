// Export Data
import DCMLogo from '../../images/logo_min.bmp';
import Papa from "papaparse";
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";

// Source: https://github.com/gargroh/react-table-plugins
export const getExportFileBlob = ({ columns, data, fileType, fileName, ...rest }) =>  {
    if (fileType === "csv") {
      // CSV example
      const headerNames = columns.filter(column => column.isVisible).map(x => x.exportValue);
      const csvString = Papa.unparse({ fields: headerNames, data });
      return new Blob([csvString], { type: "text/csv" });
    } 
    else if (fileType === "xlsx") {
      // XLSX example
  
      const header = columns.filter(column => column.isVisible).map(x => x.exportValue);
      const compatibleData = data.map((row) => {
        const obj = {};
        header.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });
  
      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        header,
      });
      XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
  
      // Returning false as downloading of file is already taken care of
      return false;
    }
    //PDF example
    if (fileType === "pdf") {
      const headerNames = columns.filter(column => column.isVisible).map(x => x.exportValue);
      console.log(headerNames);
      if (headerNames.length > 15) {
        alert('PDF is not supported for tables with more than 15 columns. Please remove columns in the filter menu before trying again.');
        return false;
      };

      const headerIndex = columns.map((column, idx) => {
        if (column.isVisible) {
          return idx;
        }
        return null;
      });

      const filteredData = data.map((row) => {
        return (row.map((element, index) => {
          if (headerIndex.includes(index)) {
            return element;
          }
          return null;
        })).filter(x => x);
      });
      
      const doc = headerNames.length > 8 ? new JsPDF('landscape') : new JsPDF();
      doc.autoTable({
        head: [headerNames],
        body: filteredData,
        margin: { top: 20 },
        didDrawPage: (data) => { // NOTE. DCM Logo added
          doc.addImage(DCMLogo, 'JPEG', 2.5, 2.5, 15, 15);
        },
        styles: {
          minCellHeight: 9,
          halign: "left",
          valign: "center",
          fontSize: 11,
        },
      });
      doc.save(`${fileName}.pdf`);
  
      return false;
    }
  
    // Other formats goes here
    return false;
  }