import { imsAxios } from "../axiosInterceptor";

export const getPoReport = async (wise, data) => {
  const response = await imsAxios.post("/report2/vendorPoReport", {
    data,
    wise,
  });

  let arr = [];
  if (response.success) {
    arr = response.data.map((row, index) => ({
      //  "": totalOB,
      id: index + 1,
      totalClosing: row.totalClosingh,
      totalIn: row.totalIn,
      totalOut: row.totalOut,
      branch: row.branch,
      component: row.component_name,
      unit: row.unit_name,
      partCode: row.part_no,
      newPartCode: row.new_partno,

      createdDate: row.reg_date,
      pendingQty: row.ordered_pending,
      qty: row.ordered_qty,

      //"": reg_by,

      //  "": vendor_name,
      //"": vendor_code,
      dueDate: row.due_date,

      poId: row.po_order_id,
      rate: row.po_rate,
      costCenter: row.po_cost_center,
      project: row.po_project,
      poStatus: row.po_status,
      billingAddress: row.billingDetail,
      shippingAddress: row.shippingDetail,
    }));
  }
  response.data = arr;
  return response;
};
