import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { Button, Col, DatePicker, Input, Row, Tabs } from "antd";
import { toast } from "react-toastify";
import MyDataTable from "../../Components/MyDataTable.jsx";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import MyAsyncSelect from "../../Components/MyAsyncSelect.jsx";
import { imsAxios } from "../../axiosInterceptor.js";
import { getComponentOptions } from "./../../api/general.js"; //getComponentOptions
import useApi from "./../../hooks/useApi.js";
import MyButton from "../../Components/MyButton/index.jsx";
// import PIAScan from "@/Pages/Store/MINLabel/PIAScan.tsx";
const { RangePicker } = DatePicker;

function CreatePhysical() {
  // console.log(addrow);

  return (
    <Tabs
      defaultActiveKey="1"
      // type="card"
      tabPosition="left"
      size={"small"}
      style={{ margin: 10, height: "95%" }}
      items={[
        {
          label: "Manual Entry",
          key: 1,
          children: <Manual />,
        },
        // {
        //   label: "PIA",
        //   key: 2,
        //   style: { height: "100%" },
        //   children: <PIAScan />,
        // },
      ]}
    />
  );
}

export default CreatePhysical;

const Manual = () => {
  const [loading, setLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [datee, setDatee] = useState([]);
  // const [availData, setAvailData] = useState({});
  const { executeFun, laoding: loading1 } = useApi();
  const [searchInput, setSearchInput] = useState("");
  const [allData, setAllData] = useState({
    selType: "",

    component: [],
    existStock: [],
    physicalStock: [],
    uom: [],
    remark: [],
  });

  const getComponent = async (e) => {
    if (e?.length > 2) {
      // const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
      //   search: e,
      // });
      const response = await executeFun(() => getComponentOptions(e), "select");
      const { data } = response;
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.value };
      });
      console.log("arr", arr);
      setAsyncOptions(arr);
      // return arr;
    }
  };

  const [addrow, setAddRom] = useState([
    {
      id: v4(),
      comp: "",
      eStick: "",
      phyStock: "",
      u: "",
      rem: "",
    },
  ]);

  console.log("here");

  const inputHandler = async (name, id, value) => {
    console.log(name, id, value);

    if (name == "comp") {
      const { data } = await imsAxios.post("vendor/rmAudit/rmStore", {
        partno: value.value,
      });
      // console.log("data.data", data);
      const exist1 = data?.closing;
      // const exist2 = data?.data.unit;
      // console.log("exist2", exist1);
      setAddRom((comp) =>
        comp.map((h) => {
          if (h.id == id) {
            {
              return { ...h, comp: value.value, eStick: exist1 };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "phyStock") {
      setAddRom((phyStock) =>
        phyStock.map((h) => {
          if (h.id == id) {
            {
              return { ...h, phyStock: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "rem") {
      setAddRom((rem) =>
        rem.map((h) => {
          if (h.id == id) {
            {
              return { ...h, rem: value };
            }
          } else {
            return h;
          }
        })
      );
    }
  };

  const plusRow = () => {
    setAddRom((addrow) => [
      ...addrow,
      {
        id: v4(),
        comp: "",
        rem: "",
        phyStock: "",
        uom: "",
        rem: "",
      },
    ]);
  };

  const minusRow = (id) => {
    setAddRom((addrow) => {
      return addrow.filter((row) => row.id != id);
    });
  };

  const savePhysical = async () => {
    setLoading(true);
    let comName = [];
    let existStock = [];
    let phyisalStock = [];
    let remarkArr = [];
    console.log("comp", addrow);
    addrow.map((a) => comName.push(a.comp));
    addrow.map((a) => existStock.push(a.eStick));
    addrow.map((a) => phyisalStock.push(a.phyStock));
    addrow.map((a) => remarkArr.push(a.rem));

    const response = await imsAxios.post("vendor/rmAudit/saveAudit", {
      // branch: "BRMSC012",
      component: comName,
      closing: existStock,
      audit: phyisalStock,
      remark: remarkArr,
    });

    console.log("data", response);
    let { data } = response;
    if (response.success == true) {
      setAddRom([
        {
          id: v4(),
          comp: "",
          eStick: "",
          phyStock: "",
          u: "",
          rem: "",
        },
      ]);
      toast.success(response.message);
      setLoading(false);
    } else {
      toast.error("Something Went Wrong");
      setLoading(false);
    }
    setLoading(false);
  };

  const resetFunction = () => {
    setAddRom([
      {
        id: v4(),
        comp: "",
        eStick: "",
        phyStock: "",
        u: "",
        rem: "",
      },
    ]);
  };

  const columns = [
    {
      headerName: (
        <span onClick={plusRow}>
          <PlusCircleTwoTone
            style={{ cursor: "pointer", fontSize: "1.0rem" }}
          />
        </span>
      ),
      width: 100,
      field: "add",

      // width: "5
      sortable: false,
      renderCell: ({ row }) =>
        addrow.findIndex((r) => r.id == row.id) >= 1 && (
          <MinusCircleTwoTone
            onClick={() => minusRow(row?.id)}
            style={{ fontSize: "1.0rem", cursor: "pointer" }}
          />
        ),
      // sortable: false,
    },

    {
      headerName: "Part/Part Name",
      field: "product",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <MyAsyncSelect
          style={{ width: "100%" }}
          onBlur={() => setAsyncOptions([])}
          onInputChange={(e) => setSearchInput(e)}
          loadOptions={getComponent}
          value={addrow?.comp}
          optionsState={asyncOptions}
          onChange={(e) => inputHandler("comp", row.id, e)} // value={addRowData.product}
          labelInValue={true}
        />
      ),
    },
    {
      headerName: "IMS Stock",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          placeholder="---"
          disabled
          value={row.eStick ? `${row.eStick} ${row.u}` : "0"}
        />
      ),
    },
    {
      headerName: "Physical Stock",
      field: "quantity ",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          placeholder="Qty"
          onChange={(e) => inputHandler("phyStock", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "Remark",
      field: "remarks ",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          placeholder="Remark"
          value={addrow?.remarks}
          onChange={(e) => inputHandler("rem", row.id, e.target.value)}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ height: "79%" }}>
        <div style={{ height: "75vh", margin: "10px" }}>
          <MyDataTable data={addrow} columns={columns} hideHeaderMenu />
        </div>
      </div>
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ textAlign: "end", margin: "10px" }}>
            <MyButton
              variant="reset"
              onClick={resetFunction}
              style={{
                //   backgroundColor: "red",
                //   color: "white",
                marginRight: "5px",
              }}
            >
              Reset
            </MyButton>
            <MyButton
              onClick={savePhysical}
              loading={loading}
              type="primary"
              variant="add"
            >
              Save
            </MyButton>
          </div>
        </Col>
      </Row>
    </div>
  );
};
