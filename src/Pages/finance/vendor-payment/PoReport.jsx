import React, { useState } from "react";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import MyDataTable from "../../../Components/MyDataTable";
import { Row, Col, Card, Form, Flex } from "antd";
import MySelect from "../../../Components/MySelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import MyButton from "../../../Components/MyButton";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import useApi from "../../../hooks/useApi";
import { getPoReport } from "../../../api/finance";
import { downloadCSV } from "../../../Components/exportToCSV";

const PoReport = () => {
  const [rows, setRows] = useState([]);

  const [filterForm] = Form.useForm();
  const { executeFun, loading } = useApi();

  const handleFetchRows = async () => {
    const values = await filterForm.validateFields();
    const response = await executeFun(
      () => getPoReport(values.wise, values.data),
      "fetch"
    );
    setRows(response.data);
  };

  const handleDownload = () => [downloadCSV(rows, columns, "PO Report")];
  return (
    <Row style={{ height: "93%", padding: "0px 10px" }} gutter={6}>
      <Col span={4}>
        <Card size="small">
          <Form
            form={filterForm}
            layout="vertical"
            initialValues={initialValues}
          >
            <Form.Item name="wise" label="Wise">
              <MySelect options={wiseOptions} />
            </Form.Item>
            <Form.Item name="data" label="Period">
              <MyDatePicker
                setDateRange={(value) =>
                  filterForm.setFieldValue("data", value)
                }
              />
            </Form.Item>
            <Flex justify="end" gap={5}>
              <CommonIcons onClick={handleDownload} action="downloadButton" />
              <MyButton
                onClick={handleFetchRows}
                loading={loading("fetch")}
                variant="search"
              />
            </Flex>
          </Form>
        </Card>
      </Col>
      <Col span={20}>
        <MyDataTable loading={loading("fetch")} data={rows} columns={columns} />
      </Col>
    </Row>
  );
};

export default PoReport;

const columns = [
  {
    headerName: "#",
    field: "id",
    width: 30,
  },
  {
    headerName: "PO ID",
    field: "poId",
    width: 120,
    renderCell: ({ row }) => <ToolTipEllipses text={row.poId} copy={true} />,
  },
  {
    headerName: "Component",
    field: "component",
    minWidth: 160,
    flex: 1,
    renderCell: ({ row }) => <ToolTipEllipses text={row.component} />,
  },
  {
    headerName: "Part Code",
    field: "partCode",
    width: 100,
    renderCell: ({ row }) => (
      <ToolTipEllipses text={row.partCode} copy={true} />
    ),
  },
  {
    headerName: "New Part Code",
    field: "newPartCode",
    width: 100,
    renderCell: ({ row }) => (
      <ToolTipEllipses text={row.newPartCode} copy={true} />
    ),
  },
  {
    headerName: "Unit",
    field: "unit",
    width: 40,
  },
  {
    headerName: "Due Date",
    field: "dueDate",
    width: 120,
  },
  {
    headerName: "PO Rate",
    field: "rate",
    width: 100,
  },
  {
    headerName: "PO Qty",
    field: "qty",
    width: 100,
  },
  {
    headerName: "Pending Qty",
    field: "pendingQty",
    width: 100,
  },
  {
    headerName: "Total In",
    field: "totalIn",
    width: 120,
  },
  {
    headerName: "Total Out",
    field: "totalOut",
    width: 120,
  },
  {
    headerName: "Total Closing",
    field: "totalClosing",
    width: 120,
  },
  {
    headerName: "Branch",
    field: "branch",
    width: 80,
  },
  {
    headerName: "Cost Center",
    field: "costCenter",
    width: 120,
    renderCell: ({ row }) => <ToolTipEllipses text={row.costCenter} />,
  },
  {
    headerName: "Project",
    field: "project",
    width: 120,
    renderCell: ({ row }) => <ToolTipEllipses text={row.project} copy={true} />,
  },
  {
    headerName: "PO Status",
    field: "poStatus",
    width: 120,
  },
  {
    headerName: "Billing Address",
    field: "billingAddress",
    width: 150,
    renderCell: ({ row }) => <ToolTipEllipses text={row.billingAddress} />,
  },
  {
    headerName: "Shipping Address",
    field: "shippingAddress",
    width: 120,
    renderCell: ({ row }) => <ToolTipEllipses text={row.shippingAddress} />,
  },
  {
    headerName: "PO Created On",
    field: "createdDate",
    width: 120,
    renderCell: ({ row }) => <ToolTipEllipses text={row.createdDate} />,
  },
];

const initialValues = {
  wise: "A",
};
const wiseOptions = [
  {
    text: "All",
    value: "A",
  },
  {
    text: "Pending",
    value: "P",
  },
];
