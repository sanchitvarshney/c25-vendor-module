import React, { useEffect, useState } from "react";
import FormTable from "../../Components/FormTable";
import { Button, Input, Modal } from "antd";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MySelect from "../../Components/MySelect";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Footer } from "@adobe/react-spectrum";
import NavFooter from "../../Components/NavFooter";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { imsAxios } from "../../axiosInterceptor";
function RmRejection() {
  const { locations: locationOptions } = useSelector((state) => state.login);
  const [rows, setRows] = useState([
    {
      id: v4(),

      remark: "",
      uom: "",
      component: "",
      qty: "",
    },
  ]);
  // console.log("locationOptions", locationOptions);
  const [availQty, setAvailQty] = useState("");
  const [selectLoading, setSelectLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  //   const addRows = () => {
  //     const newRow = {
  //       id: v4()
  //       component: "",
  //       location: locationOptions[0]?.value,
  //       qty: "",
  //       uom: "--",
  //       remark: "",
  //     };
  //     let arr = rows;
  //     arr = [newRow, ...arr];
  //     setRows(arr);
  //   };
  const removeRows = (id) => {
    let arr = rows;
    console.log("arr", arr);
    console.log("id", id);
    arr = arr.filter((row) => row.id !== id);
    setRows(arr);
  };
  const addRows = () => {
    const newRow = {
      id: v4(),
      remark: "",
      uom: "",
      qty: "",
      //   hsn: "",
      //   unit: "",
      component: "",
      //   pick_location: locationOptions[0]?.value,
      //   drop_location: locationOptions[0]?.value,
      //   availableQty: "",
    };
    setRows((rows) => [...rows, newRow]);
  };
  //   const inputHandler = async (name, value, id) => {
  //         console.log(name, value, id);
  //         let arr = rows;
  //         if (name === "rate") {
  //           rows[0].rate = value;
  //         } else if (name === "qty") {
  //           rows[0].finishedqty = value;
  //         }
  //   };
  const getComponentDetails = async (value, id) => {
    const { data } = await imsAxios.post(
      "/jwvendor/getComponentDetailsByCode",
      {
        component_code: value.value,
      }
    );
    if (data.code === 200) {
      rows[0].hsn = data.data.hsn;
      rows[0].uom = data.data.unit;
    }
    return data;
  };
  const getAsyncOptions = async (search, url) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post(url, {
      search: search,
    });
    setSelectLoading(false);
    if (data[0]) {
      let arr = data.map((row) => ({
        value: row.id,
        text: row.text,
      }));
      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };
  const inputHandler = async (name, value, id) => {
    let arr = rows;
    if (name === "component") {
      const data = await getComponentDetails(value);
      if (data.code === 200) {
        arr = arr.map((row) => {
          if (row.id === id) {
            row = {
              ...row,
              [name]: value,
              uom: data.data.unit,
            };

            return row;
          } else {
            return row;
          }
        });
      } else {
        toast.error("Some error Occurred");
      }
    }
    // if (name === "availableQty") {
    //   const data = await getDetails(rows.component, rows.pick_location);
    //   if (data.code === 200) {
    //     arr = arr.map((row) => {
    //       if (row.id === id) {
    //         row = {
    //           ...row,
    //           [name]: value,
    //           uom: data.data.unit,
    //         };

    //         return row;
    //       } else {
    //         return row;
    //       }
    //     });
    //   } else {
    //     toast.error("Some error Occurred");
    //   }
    // }
    arr = arr.map((row) => {
      if (row.id === id) {
        row = {
          ...row,
          [name]: value,
        };

        return row;
      } else {
        return row;
      }
    });
    setRows(arr);
  };
  const resetHandler = () => {
    let obj = [];
    setRows(obj);
    // setRows([
    //   {
    //     id: v4(),
    //     component: "",
    //     location: "",
    //     qty: "",
    //     uom: "--",
    //     remark: "-- ",
    //   },
    // ]);

    // console.log("rows asfter", rows);
    // addRows();
    // window.location.replace("/rm_rejection");
    // window.open("/rm_rejection");
  };
  const resetModal = () => {
    Modal.info({
      title:
        "Are you sure you want to reset the value of this Rejection Request?",

      onOk() {
        resetHandler();
      },
      onCancel() {},
    });
  };
  const confirmModal = () => {
    Modal.confirm({
      title: "Are you sure you want to submit this Rejection Request?",
      content:
        "Please make sure that the values are correct, This process is irreversible",
      onOk() {
        submitHandler();
      },
      onCancel() {},
    });
  };
  const submitHandler = async () => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/jwreject/saveRejection", {
      component: rows.map((r) => r.component.value),
      qty: rows.map((r) => r.qty),
      remark: rows.map((r) => r.remark),
    });
    if (data.code === 200) {
      resetHandler();
      toast.success(data.message);
      setSelectLoading(false);
    } else {
      toast.error(data.message.msg);
    }
    setSelectLoading(false);
  };
  const getDetails = async (c, l) => {
    // console.log("c", c.value);
    // console.log("l", l);
    // setPageLoading(true);
    const { data } = await imsAxios.post("/jwtransfer/getStock", {
      component: c.value,
      pick_location: l,
    });
    rows[0].availableQty = "";
    if (data.code === 200) {
      // console.log("data", data);
      rows[0].availableQty = data.data.calculated_qty;
      // availQty = data.data.location_qty;
      setAvailQty(data.data.calculated_qty);
      // console.log("data.data.location_qty- >>", data.data.location_qty);
    }
  };
  useEffect(() => {
    // console.log("availQty", availQty);
    if (availQty) {
      // console.log("availQty inside avail Qty", availQty);
      setAvailQty(availQty);
      // rows[0].availableQty = availQty;
    }
  }, [availQty]);
  const getComponentByNameAndNo = async (search) => {
    const response = await imsAxios.post("/backend/getComponentByNameAndNo", {
      search,
    });
    // console.log("response", response);
    const { data } = response;
    if (data.success) {
      let arr = data.data.map((row) => ({
        value: row.id,
        text: row.text,
      }));
      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };
  useEffect(() => {
    // console.log("rows?.pick_location", rows);
    if (rows[0]?.component && rows[0]?.pick_location) {
      // console.log("rows[0]?.pick_location", rows[0]?.pick_location);
      // console.log("rows[0]?.component", rows[0]?.component);
      getDetails(rows[0].component, rows[0].pick_location);
    }
  }, [rows[0]?.component, rows[0]?.pick_location]);

  const columns = [
    {
      headerName: <CommonIcons disabled action="addRow" onClick={addRows} />,
      width: 40,
      field: "add",
      sortable: false,
      renderCell: ({ row }) =>
        rows.indexOf(row) >= 1 && (
          <CommonIcons
            action="removeRow"
            disabled
            onClick={() => removeRows(row?.id)}
          />
        ),
    },
    {
      headerName: "Component Name",
      flex: 1,

      renderCell: ({ row }) => (
        <MyAsyncSelect
          //   placeholder="Search Part Code"
          selectLoading={selectLoading}
          optionsState={asyncOptions}
          labelInValue
          onBlur={() => setAsyncOptions([])}
          value={row.component}
          loadOptions={getComponentByNameAndNo}
          onChange={(value) => {
            inputHandler("component", value, row.id);
          }}
        />
      ),
    },
    // {
    //   headerName: "Pick Location",
    //   width: 150,
    //   renderCell: ({ row }) => (
    //     <MySelect
    // labelInValue
    // value={locationOptions[0]?.text}
    // value={locationOptions[0]?.text}
    //       options={locationOptions}
    //       onChange={(value) => {
    //         inputHandler("pick_location", value, row.id);
    //       }}
    //     />
    //   ),
    // },
    // {
    //   headerName: "Drop Location",
    //   width: 150,
    //   renderCell: ({ row }) => (
    //     <MySelect
    //       // labelInValue
    //       // value={locationOptions[0]?.text}
    //       // value={locationOptions[0]?.text}
    //       options={locationOptions}
    //       onChange={(value) => {
    //         inputHandler("drop_location", value, row.id);
    //       }}
    //     />
    //   ),
    // },

    // {
    //   headerName: "Available Qty",
    //   width: 150,
    //   renderCell: ({ row }) => (
    //     <Input
    //       disabled
    //       defaultValue={row.availableQty}
    //       value={row.availableQty}
    //       suffix={"" + row.uom}
    //       onChange={(e) => {
    //         inputHandler("availableQty", e.target.value, row.id);
    //       }}
    //     />
    //   ),
    // },
    {
      headerName: "Qty",
      flex: 1,

      renderCell: ({ row }) => (
        <Input
          defaultValue={row.qty}
          suffix={"" + row.uom}
          onChange={(e) => {
            inputHandler("qty", e.target.value, row.id);
          }}
        />
      ),
    },
    // {
    //   headerName: "HSN Code",
    //   width: 150,
    //   renderCell: ({ row }) => (
    //     <Input
    //       defaultValue={row.hsn}
    //       value={row.hsn}
    //       onChange={(e) => {
    //         inputHandler("hsn", e.target.value, row.id);
    //       }}
    //     />
    //   ),
    // },
    {
      headerName: "Remark",
      flex: 1,
      renderCell: ({ row }) => (
        <Input
          defaultValue={row.remark}
          onChange={(e) => {
            inputHandler("remark", e.target.value, row.id);
          }}
        />
      ),
    },
    // {
    //   headerName: "Pending Qty",
    //   width: 150,
    //   renderCell: ({ row }) => <Input value={row.pendingqty} disabled />,
    // },
    // {
    //   headerName: "Order Qty",
    //   width: 150,
    //   renderCell: ({ row }) => <Input value={row.orderqty} disabled />,
    // },
    // {
    //   headerName: "Rate",
    //   renderCell: ({ row }) => (
    //     <Input
    //       disabled
    //       value={row.rate}
    //       onChange={(e) => {
    //         // inputHandler("rate", e.target.value);
    //       }}
    //     />
    //   ),
    // },
  ];
  return (
    <div style={{ height: "90%" }}>
      <div style={{ height: "95%", padding: "0px 5px" }}>
        <FormTable columns={columns} data={rows} />
      </div>
      <NavFooter
        selectLoading={selectLoading}
        submitFunction={confirmModal}
        resetFunction={resetModal}
        nextLabel="Submit"
        // setSelectLoading={setSelectLoading}
      />
    </div>
  );
}

export default RmRejection;
