function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      //   console.log(line);
      //   line = line.replaceAll(",", "$");
      //   line = line.replaceAll("_", ",");
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }
  //   console.log(str);
  return str;
}
export const downloadCSVAntTable = async (rows, columns, name) => {
  let arr = [];
  arr = rows.map((row) => {
    return columns.map((col) => {
      if (col.type != "actions") {
        if (row[col.dataIndex] || row[col.dataIndex] == "0") {
          return {
            [col.title]: row[col.dataIndex],
          };
        } else {
          return { [col.title]: "" };
        }
      }
    });
  });

  arr = arr.map((row) => {
    let newRow = row.reduce((r, c) => Object.assign(r, c), {});

    return newRow;
  });

  let arr2 = Object.keys(arr[0]);
  let arr1 = [];
  arr.map((row) => {
    let obj = {};
    for (var key in row) {
      obj = {
        ...obj,
        [key]: row[key]
          ? row[key]
              .toString()
              .replaceAll(",", ";")
              .replaceAll("/n", " ")
              .replaceAll("\n", " ")
              .replaceAll("<br>", " ")
          : row[key] == "0"
          ? row[key]
          : "--",
      };
    }

    arr1.push(obj);
  });

  exportCSVFile(arr2, arr1, name ? name : "File");
};
export const downloadCSV = async (rows, columns, name) => {
  let arr = [];
  arr = rows.map((row) => {
    return columns.map((col) => {
      if (col.type != "actions") {
        if (row[col.field] || row[col.field] == "0") {
          return {
            [col.headerName]: row[col.field],
          };
        } else {
          return { [col.headerName]: "" };
        }
      }
    });
  });

  arr = arr.map((row) => {
    let newRow = row.reduce((r, c) => Object.assign(r, c), {});

    return newRow;
  });

  let arr2 = Object.keys(arr[0] ?? {});
  let arr1 = [];
  arr.map((row) => {
    let obj = {};
    for (var key in row) {
      obj = {
        ...obj,
        [key]: row[key]
          ? row[key]
              .toString()
              .replaceAll(",", ";")
              .replaceAll("/n", " ")
              .replaceAll("\n", " ")
              .replaceAll("<br>", " ")
          : row[key] == "0"
          ? row[key]
          : "--",
      };
    }

    arr1.push(obj);
  });

  exportCSVFile(arr2, arr1, name ? name : "File");
};
export const downloadCSVCustomColumns = async (csvData, name) => {
  console.log(csvData);
  let arr = Object.keys(csvData[0]);
  let arr1 = [];
  csvData.map((row) => {
    // let a = [];
    let obj = {};
    for (var key in row) {
      obj = {
        ...obj,
        [key]: row[key]
          ? row[key]
              .toString()
              .replaceAll(",", ";")
              .replaceAll("/n", " ")
              .replaceAll("\n", " ")
              .replaceAll("<br>", " ")
          : "--",
      };
    }

    arr1.push(obj);
  });
  exportCSVFile(arr, arr1, name ? name : "File");
};
export function exportCSVFile(headers, items, fileTitle) {
  let formattedItem = [];
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
