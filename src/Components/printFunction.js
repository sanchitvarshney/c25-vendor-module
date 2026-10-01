import printJS from "print-js";
import fileDownload from "js-file-download";

const printFunction = (buffer) => {
  const file = new Blob([
    new Uint8Array(buffer),
    {
      type: "application/pdf",
    },
  ]);
  const url = URL.createObjectURL(file);
  printJS(url);
};
const downloadFunction = (buffer, filename, type) => {
  const file = new Blob([
    new Uint8Array(buffer),
    {
      type: "application/pdf",
    },
  ]);
  // const url = URL.createObjectURL(file);
  // return url;
  console.log(filename);
  fileDownload(file, `${filename}.pdf`);
};
const downloadExcel = (buffer, filename, type) => {
  const file = new Blob([
    new Uint8Array(buffer),
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  ]);
  fileDownload(file, filename);
};
export { downloadFunction, downloadExcel ,printFunction};
export default printFunction;
