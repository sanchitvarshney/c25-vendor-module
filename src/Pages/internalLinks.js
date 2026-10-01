const links = [
  [
    {
      routeName: "Pending Requests",
      routePath: "/requests/pending",
    },
    {
      routeName: "Transfer Requests",
      routePath: "/requests/transfer",
    },
    {
      routeName: "Completed Requests",
      routePath: "/requests/completed",
    },
  ],
  [
    {
      routeName: "Create",
      routePath: "/sfg/create",
      placeholder: "SFG",
    },
    {
      routeName: "View",
      routePath: "/sfg/view",
      placeholder: "SFG",
    },
  ],
  [
    {
      routeName: "Create",
      routePath: "/PhysicalStock",
      // placeholder: "Create",
    },
    {
      routeName: "Pending",
      routePath: "/physicalStock/pending",
      // placeholder: "Pending",
    },
    {
      routeName: "Rejected",
      routePath: "/physicalStock/rejected",
      // placeholder: "Rejected",
    },
    {
      routeName: "View",
      routePath: "/physicalStock/view",
      // placeholder: "View",
    },
  ],
  [
    {
      routeName: "VQ01",
      routePath: "/reports/rm_stock",
      placeholder: "RM Location Query",
    },
    {
      routeName: "VQ02",
      routePath: "/reports/rmConsumption_report",
      placeholder: "RM Consumption Report",
    },
    {
      routeName: "VR01",
      routePath: "/vr01",
      placeholder: "All RM Transaction",
    },
    {
      routeName: "VR02",
      routePath: "/vr02",
      placeholder: "RM Stock",
    },
    {
      routeName: "VR03",
      routePath: "/vr03",
      placeholder: "RM Consumption",
    },
    {
      routeName: "VR04",
      routePath: "/vr04",
      placeholder: "RM Rejection Report",
    },
  ],
  [
    {
      routeName: "Create RM Consumption",
      routePath: "/rm_consumption",
      // placeholder: "RM Consumption",
    },
    {
      routeName: "Create RM Rejection",
      routePath: "/rm_rejection",
      // placeholder: "Create RM Rejection",
    },
  ],
  [
    {
      routeName: "",
      routePath: "/rm_consumption",
      placeholder: "Create RM Consumption",
    },
  ],
  [
    {
      routeName: "PO Report",
      routePath: "/finance/payments",
    },
  ],
  [
    {
      routeName: "Job Work Inventory Report",
      routePath: "/jobwork-inventory-report",
      // placeholder: "RM Consumption",
    },
  ],
  [
    {
      routeName: "Job work Analysis",
      routePath: "/jobwork-analysis",
      // placeholder: "RM Consumption",
    },
  ],
];
export default links;
