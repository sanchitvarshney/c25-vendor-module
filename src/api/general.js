import { imsAxios } from "../axiosInterceptor";
import { convertSelectOptions } from "../utils/general";

export const getComponentOptions = async (search) => {
  const response = await imsAxios.post("/backend/getComponentByNameAndNo", {
    search,
  });
  let arr = [];
  if (response.success) {
    arr = convertSelectOptions(response.data);
  }
  response.data = arr;
  return response;
};

export const getComponentDetails = async (componentKey) => {
  const response = await imsAxios.post("/jwvendor/getComponentDetailsByCode", {
    component_code: componentKey,
  });
  return response;
};

export const getComponentClosingStock = async (componentKey, location) => {
  const response = await imsAxios.post("/jwreport/compClosing", {
    component: componentKey,
    location,
  });
  return response;
};

export const postVendorInvoice = async (invoice) => {
  const formData = new FormData();
  formData.append("files", invoice);
  const response = imsAxios.post("/jwvendor/upload-invoice", formData);
  return response;
};

export const postRmConsumption = async (values) => {
  const payload = {
    challan_no: values.documentNumber,
    challan_date: values.documentDate,
    jobwork_attach: values.invoiceNumber,
    type: values.type,
    product: values.type === "consumption" ? values.product?.value : undefined,
    consumed_product_qty:
      values.type === "consumption" ? values.productQty : undefined,
    component: values.components.map((row) => row.component?.value),
    qty: values.components.map((row) => row.qty),
    pick_location: values.components.map((row) => row.pickLocation),
    remark: values.components.map((row) => row.remark),
  };

  const response = await imsAxios.post("/jwvendor/rmConsp", payload);
  return response;
};

export const uploadRmConsumptionSheet = async (values) => {
  const formData = new FormData();
  formData.append("jobwork_attach", values.dragger[0].originFileObj);
  const response = await imsAxios.post("/jwvendor/getDocumentData", formData);

  let arr = [];
  console.log("response api", response);
  if (response.success) {
    arr = response.data.map((row) => ({
      component: {
        label: row.component.text,
        value: row.component.value,
      },
      pickLocation: "1689055233554", //change this,
      closingStock: 0,
      qty: row.quantity,
      remark: row.remarks,
    }));
  }

  response.data = arr;
  return response;
};
export const getPhysicalStockWithStatus = async (status) => {
  const response = await imsAxios.post("/vendor/rmAudit/fetchPendingAudit", {
    status,
  });

  return response;
};

export const updateStatus = async (values) => {
  const payload = {
    audit_key: values.auditKey,
    status: values.status,
    component_key: values.componentKey,
  };

  const response = await imsAxios.post("/vendor/rmAudit/updateAudit", payload);
  return response;
};
export const updateAudit = async (componentKey, auditKey, qty) => {
  const payload = {
    audit_key: auditKey,
    component_key: componentKey,
    audit_qty: qty,
  };

  const response = await imsAxios.post(
    "/vendor/rmAudit/updateRejectedAudit",
    payload
  );
  return response;
};
export const getLogs = async (auditKey) => {
  const payload = {
    audit_key: auditKey,
  };
  const response = await imsAxios.post(
    "/vendor/rmAudit/fetchAuditLog",
    payload
  );
  return response;
};

export const getVerifiedStocks = async (wise, data) => {
  const response = await imsAxios.post("/vendor/rmAudit/fetchAudit", {
    searchBy: wise,
    searchValue: data,
  });

  return response;
};
