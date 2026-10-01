import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Form,
  Upload,
  Button,
  Modal,
  InputNumber,
  Flex,
} from "antd";
import FormTable2 from "../../Components/FormTable2";
import useApi from "../../hooks/useApi";
import {
  getComponentOptions,
  getComponentClosingStock,
  postVendorInvoice,
  postRmConsumption,
  uploadRmConsumptionSheet,
} from "../../api/general";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { convertSelectOptions } from "../../utils/general";
import { useSelector } from "react-redux";
import MySelect from "../../Components/MySelect";
import SingleDatePicker from "../../Components/SingleDatePicker";
import { InboxOutlined } from "@ant-design/icons";
import Loading from "../../Components/Loading";
import { downloadCSV } from "../../Components/exportToCSV";
import { toast } from "react-toastify";

function RMConsumption() {
  const [asyncOptions, setAsyncOptions] = useState([]);
  const { locations: pickLocationOptions } = useSelector(
    (state) => state.login
  );
  const [showTypeModal, setTypeModal] = useState(true);
  const [form] = Form.useForm();
  const initialValues = {
    components: [
      {
        pickLocation: "1689055233554",
      },
    ],
  };

  const { executeFun, loading } = useApi();
  const selectedType = Form.useWatch("type", form);

  const handleFetchComponentOptions = async (componentKey) => {
    const response = await executeFun(
      () => getComponentOptions(componentKey),
      "select"
    );

    setAsyncOptions(response.data);
  };
  const handleFetchComponentClosingStock = async (componentKey, location) => {
    const response = await executeFun(
      () => getComponentClosingStock(componentKey, location),
      "page"
    );
    if (response.success) {
      return response.data.data.closingStock;
    }
  };

  const validateHandler = async () => {
    const values = await form.validateFields();
    Modal.confirm({
      title: "Confirm Consumption",
      content: "Are you sure you want to create this RM Consumption",
      okText: "Continue",
      onOk: () => handleSubmit(values),
      confirmLoading: loading("submit"),
    });
  };
  const handleSubmit = async (values) => {
    if (values.dragger && values.dragger[0]) {
      console.log(values);
      values["file"] = values.dragger[0].originFileObj;
      values["invoiceNumber"] = null;
      delete values["dragger"];

      const fileResponse = await executeFun(
        () => postVendorInvoice(values.file),
        "fileUpload"
      );

      console.log("this is the file response", fileResponse);
      if (fileResponse.success) {
        values["invoiceNumber"] = fileResponse.data.data;
      }
    }

    const response = await executeFun(
      () => postRmConsumption(values),
      "submit"
    );
    // console.log("these are the response right herer", response);
    if (response.success) {
      form.resetFields();
    } else if (response.data.code == 500) {
      toast.error(response.message.msg);
    }
  };

  const handleUploadSheet = async () => {
    const values = await form.validateFields(["dragger"]);
    const response = await executeFun(
      () => uploadRmConsumptionSheet(values),
      "upload"
    );

    if (response.success) {
      let arr = response.data;
      console.log("response data", response.data);
      for (let i = 0; i < response.data.length; i++) {
        const current = response.data[i];
        const closingStock = await handleFetchComponentClosingStock(
          current.component.value,
          current.pickLocation
        );
        arr[i].closingStock = closingStock;
      }
      form.setFieldValue("components", arr);
    } else toast.error(response.error);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const calculation = async (fieldName, values) => {
    if (values.component && values.component?.value && values.pickLocation) {
      const closingStock = await handleFetchComponentClosingStock(
        values.component.value,
        values.pickLocation
      );
      form.setFieldValue(
        ["components", fieldName, "closingStock"],
        closingStock
      );
    }
  };

  const handleDownloadSample = () => {
    downloadCSV(
      [
        {
          partCode: "",
          qty: "",
          remarks: "",
        },
      ],
      sampleColumns,
      "RM Consumption Sample"
    );
  };

  return (
    <Form
      form={form}
      style={{ height: "100%" }}
      layout="vertical"
      initialValues={initialValues}
    >
      {/* <TypeModal show={showTypeModal} hide=/> */}
      <Row gutter={6} style={{ height: "95%", padding: 10, paddingTop: 0 }}>
        <Col span={4}>
          <Card title="Create RM Consumption" size="small">
            <Form.Item name="type" label="Type" rules={rules.type}>
              <MySelect options={typeOptions} />
            </Form.Item>
            {selectedType === "consumption" && (
              <Form.Item
                name="product"
                label="Product"
                rules={selectedType && rules.product}
              >
                <MyAsyncSelect
                  loadOptions={handleFetchComponentOptions}
                  onBlur={() => setAsyncOptions([])}
                  optionsState={asyncOptions}
                  selectLoading={loading("select")}
                  labelInValue={true}
                />
              </Form.Item>
            )}
            {selectedType === "consumption" && (
              <Form.Item
                style={{ width: "100%" }}
                name="productQty"
                label="Product Qty"
                rules={selectedType && rules.productQty}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            )}
            <Form.Item
              name="documentNumber"
              label="Document Number"
              rules={rules.documentNumber}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="documentDate"
              label="Document Date"
              rules={rules.documentDate}
            >
              <SingleDatePicker
                setDate={(value) => form.setFieldValue("documentDate", value)}
              />
            </Form.Item>
            <Form.Item label="Dragger">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger
                  beforeUpload={() => false}
                  name="files"
                  maxCount={1}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>

            <Button
              onClick={handleUploadSheet}
              loading={loading("upload")}
              block
            >
              Upload
            </Button>
            <Button onClick={handleDownloadSample} type="link" block>
              Download Sample
            </Button>

            <Row justify="end">
              <Button type="primary" onClick={validateHandler}>
                Save
              </Button>
            </Row>
          </Card>
        </Col>
        <Col span={20}>
          <Card
            size="small"
            style={{ height: "100%" }}
            bodyStyle={{ height: "97%" }}
          >
            {loading("page") && <Loading />}
            <FormTable2
              columns={columns(
                handleFetchComponentOptions,
                asyncOptions,
                setAsyncOptions,
                loading("select"),
                pickLocationOptions
              )}
              removableRows={true}
              addableRow={true}
              listName="components"
              nonRemovableColumns={1}
              form={form}
              watchKeys={["component", "pickLocation"]}
              // nonListWatchValues={["closingStock", "qty", "remark"]}
              calculation={calculation}
              // componentRequiredRef={["component", "qty"]}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  );
}

export default RMConsumption;

const columns = (
  handleFetchComponentOptions,
  asyncOptions,
  setAsyncOptions,
  selectLoading,
  locationOptions
) => [
  {
    headerName: "#",
    field: "index",
    name: "index",
    width: 30,

    // renderCell: ({ row }) => ,
    field: (_, index) => index + 1,
  },
  {
    headerName: "Component",
    field: "component",
    name: "component",
    width: 150,
    flex: 1,

    // renderCell: ({ row }) => ,
    field: (_, index) => (
      <MyAsyncSelect
        loadOptions={handleFetchComponentOptions}
        onBlur={() => setAsyncOptions([])}
        optionsState={asyncOptions}
        selectLoading={selectLoading}
        labelInValue={true}
      />
    ),
  },

  {
    headerName: "Pick Location",
    field: "pickLocation",
    name: "pickLocation",
    width: 150,
    // renderCell: ({ row }) => ,
    field: (_, index) => <MySelect options={locationOptions} />,
  },
  {
    headerName: "Closing Stock",
    field: "closingStock",
    name: "closingStock",
    width: 100,
    // renderCell: ({ row }) => ,
    field: (_, index) => <Input disabled />,
  },
  {
    headerName: "Qty",
    field: "qty",
    name: "qty",
    width: 100,
    // renderCell: ({ row }) => ,
    field: (_, index) => <Input />,
  },
  {
    headerName: "Remark",
    field: "remark",
    name: "remark",
    width: 200,
    // renderCell: ({ row }) => ,
    field: (_, index) => <Input />,
  },
];

const sampleColumns = [
  {
    headerName: "partCode",
    field: "partCode",
  },
  {
    headerName: "qty",
    field: "qty",
  },
  {
    headerName: "remark",
    field: "remark",
  },
];

// const locationOptions = [
//   {
//     value: "1689055233554",
//     text: "SFJW050_M3S",
//   },
//   {
//     value: "1689055233555",
//     text: "SFJW051_M3S",
//   },
// ];
const rules = {
  type: [
    {
      required: true,
      message: "Type is required",
    },
  ],
  product: [
    {
      required: true,
      message: "Product is required in case of Consumption",
    },
  ],
  productQty: [
    {
      required: true,
      message: "Consumed Qty is required in case of Consumption",
    },
  ],
  documentNumber: [
    {
      required: true,
      message: "Document number is required",
    },
  ],
  documentDate: [
    {
      required: true,
      message: "Document Date is required",
    },
  ],
  component: [
    {
      required: true,
      message: "Component is Required",
    },
  ],
  qty: [
    {
      required: true,
      message: "Quantity is required",
    },
  ],
};

const typeOptions = [
  {
    text: "Rejection",
    value: "rejection",
  },
  {
    text: "Shortage",
    value: "shortage",
  },
  {
    text: "Consumption",
    value: "consumption",
  },
];
