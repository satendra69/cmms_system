import React, { useState, useEffect ,useRef} from "react";

import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";

import 'react-toastify/dist/ReactToastify.css';

import Moment from "moment";
import "moment-timezone";

import Iconify from "src/components/iconify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const WorkOrderComments = ({ data, onDataFromSecondComponent }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");

  const { RowID } = data;
  const { Asset_No } = data;
  const { WorkOrderNo } = data;

  const location = useLocation();
  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [show, setShow] = useState(false);
 
 
  const handleShow = () => setShow(true);
  const [EmployeeID, setEmployeeID] = useState([]);
  const [selected_EmployeeID, setSelected_EmployeeID] = useState([]);

  const [selected_Craft, setSelected_Craft] = useState([]);

  const [TimeCardDate, setTimeCardDate] = useState(new Date());
  const [EndTimeCardDate, setEndTimeCardDate] = useState(new Date());

  const [HourType, setHourType] = useState([]);
  const [selected_HourType, setSelected_HourType] = useState([]);

  const [ActualHour, setActualHour] = useState("0");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [CreditCostCenter, setCreditCostCenter] = useState([]);
  const [selected_CreditCostCenter, setSelected_CreditCostCenter] = useState(
    []
  );

  const chatContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [AllCommnet, setAllComment] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef2 = useRef(null);
  const [imageComment, setimageComment] = useState(null);
  const [uploadImgShow, setUploadImgShow] = useState(false);
  const UploadImghandleClose = () => setUploadImgShow(false);
  const messageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await get_workordermaster_chatData(site_ID, RowID);
      //  get_workorder_status(site_ID, "All");
       // await getWorkOrderCommentsMandatoryfiled();
       // await getWorkOrderCommentsFromLebel();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchData();
  }, [site_ID, RowID, location]);

  // Get Header Data
  const get_workordermaster_chatData = async (site_ID, RowID) => {
    setLoading(true);
    
    try {
      const response = await httpCommon.get(
        `get_chart.php?mst_RowID=${RowID}&site_cd=${site_ID}&url=${httpCommon.defaults.baseURL}&folder=React_web&dvc_id=Web`
      );
     // console.log("res___out____",response);
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.HeaderDt.header);
        setResult(response.data.data);
        setAllComment(response.data.data);
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...ww",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
 

  const get_workorder_status = async (site_ID, type) => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `get_dropdown.php?site_cd=${site_ID}&type=${type}`
      );
     // console.log("TimeCard Responce____",response);
      if (response.data.status === "SUCCESS") {
        let EmployeeID = response.data.data.Employee_List_Supervisor_Id.map(
          (item) => ({
            label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
            value: item.emp_mst_empl_id,
          })
        );
        setEmployeeID(EmployeeID);

        let Craft = response.data.data.Employee_Primary_Craft.map((item) => ({
          label: item.crf_mst_crf_cd + " : " + item.crf_mst_desc,
          value: item.crf_mst_crf_cd,
        }));
        // setCraft(Craft);

        let HourType = response.data.data.HoursType.map((item) => ({
          label: item.hours_type_cd,
          value: item.hours_type_cd,
        }));
        setHourType(HourType);

        let ChargeCostCenter = response.data.data.CostCenter.map((item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        }));
        setChargeCostCenter(ChargeCostCenter);

        let ChargeAccount = response.data.data.account.map((item) => ({
          label: item.account + " : " + item.descs,
          value: item.account,
        }));
        setChargeAccount(ChargeAccount);

        let CreditCostCenter = response.data.data.CostCenter.map((item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        }));
        setCreditCostCenter(CreditCostCenter);

        let CreditAccount = response.data.data.account.map((item) => ({
          label: item.account + " : " + item.descs,
          value: item.account,
        }));
       // setCreditAccount(CreditAccount);

        //get_dropdown_ParentFlag(site_ID,selected_asset);
        // get_workordermaster_select(site_ID,selected_asset);
        // New_WorkOrderTimeCard();
        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
  //Header

  const resetData = () => {
    setSelected_ChargeAccount("");
    setSelected_ChargeCostCenter("");
    setSelected_Craft("");
  //  setSelected_CreditAccount("");
    setSelected_CreditCostCenter("");
    setSelected_EmployeeID("");
    setSelected_HourType("");
    setActualHour("");
    setEndTimeCardDate("");
  };
 
  const handleClose = () => {
    setShow(false);
    resetData();
    get_workordermaster_chatData(site_ID, RowID);
  };
  useEffect(() => {
    const calculateActualHours = () => {
      if (TimeCardDate && EndTimeCardDate) { 
        const startDate = new Date(TimeCardDate);
        const endDate = new Date(EndTimeCardDate);
        const differenceInMilliseconds = endDate - startDate;
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        setActualHour(differenceInHours.toFixed(2)); 
      }
    };

    calculateActualHours();
  }, [TimeCardDate, EndTimeCardDate]);
  
   // Get All Filed label Name
  const getWorkOrderCommentsFromLebel = async () => {
    try {
      const response = await httpCommon.get("/get_work_order_comments_form_lebal.php");
      if (response.data.status === "SUCCESS") {
      //  setWkoMstLabel(response.data.data.wko_ls11);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const getWorkOrderCommentsMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_work_order_comments_mandatory_filed.php");
      
      if (response.data && response.data.data && response.data.data.MandatoryField) {
  
        if (response.data.data.MandatoryField.length > 0) {
          
        //  setMaterialMandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
 

  const Refreshdatapopup = () => {
  //  console.log("refesh button hit___");
    get_workordermaster_chatData(site_ID, RowID);
  };
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [AllCommnet]);

  const handleImageChange2 = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // const base64String = reader.result.split(',')[1];
        const base64String2 = reader.result.split(",")[1];

        const base64String = reader.result;

        const fileName = file.name;
        setImagePreview(base64String);
        // Set the state with the base64 string and file name
        setimageComment({
          base64: base64String2,
          fileName: fileName,
        });
      };

      reader.readAsDataURL(file);
    }
  };
  const handleImageClickSHow = () => {
    setUploadImgShow(true);
  };

  const handleUploadCloseClick = () => {
    setImagePreview("");
  };

  const handleSubmitCmmnt = async () => {
    Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
    Swal.showLoading();

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_name = localStorage.getItem("emp_mst_name");

    const inputValue = messageRef.current.value.trim();

    if (inputValue === "" && !imageComment) {
      console.log("both empty");
      Swal.close();
      return;
    }

    const newComment = {
      // Add other properties as needed
      wko_ls11_name: emp_mst_name,
      audit_user: emp_mst_login_id, // Replace with the actual user
      audit_date: {
        date: Moment().format("YYYY-MM-DD HH:mm:ss"),
        timezone_type: 3,
        timezone: "UTC",
      },
      wko_ls11_sts_upd: inputValue,
      attachment: imageComment ? imageComment.base64 : null,
    };
    setAllComment((prevComments) => [...prevComments, newComment]);

    const json_workorder = {
      site_cd: site_ID,
      RowId: RowID,
      commentMsg: inputValue,
      Emp_name: emp_mst_name,
      Emp_login_Name: emp_mst_login_id,
      orderNo: WorkOrderNo,
      ImgUpload: imageComment,
    };

    try {
      const response = await httpCommon.post(
        "/insert_comment.php",
        JSON.stringify(json_workorder)
      );
      //console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        Swal.close();
        if (messageRef.current) {
          messageRef.current.value = "";
        }
        setImagePreview("");
        setimageComment(null); // Use null instead of an empty string
        scrollChatToBottom();
      
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data,
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error submitting comment:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your comment. Please try again.",
      });
    }
  };

  return (
    <>
      <div>
        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "8px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
              paddingBottom: "10px",
              background: "#eaeceb",
            }}
          >
             
            
            <div className="table-responsive">
            <div className="chat-container">
            <div style={{ display: "flex", gap: "10px",float: "right" }}>
                   
              <Tooltip title="Refresh Chat" placement="top" arrow>
                    <IconButton
                      aria-label="close"
                      onClick={Refreshdatapopup}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                        padding:"5px"
                      }}
                    >
                      <Iconify icon="icon-park:refresh-one" />
                    </IconButton>
              </Tooltip>
                   
                   
                  </div>
                    <div className="menud" ref={chatContainerRef}>
                      <ol className="chatd">
                        {loading ? (
                          <li>Loading...</li>
                        ) : (
                          AllCommnet.map((item, index) => (
                            <li
                              key={index}
                              className={`messagedd ${
                                item.wko_ls11_name === emp_mst_name
                                  ? "self2"
                                  : "other2"
                              }`}
                            >
                              <div
                                className={`avatar2 ${
                                  item.wko_ls11_name === emp_mst_name
                                    ? "top-left"
                                    : "bottom-right"
                                }`}
                              >
                                <span>
                                  {item.wko_ls11_name
                                    ? item.wko_ls11_name.charAt(0)
                                    : "?"}
                                </span>
                              </div>
                              <div className="msg2">
                                <div className="msfcls">
                                  <p className="usrName">
                                    <span>{item.wko_ls11_name}</span>
                                  </p>
                                  <p className="msgP">
                                    {Moment(item.audit_date.date).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </p>
                                  {item.full_size_link ? (
                                    <img
                                      src={item.full_size_link}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : item.attachment ? (
                                    <img
                                      src={`data:image/png;base64,${item.attachment}`}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : null}

                                  <p className="commentTxt">
                                    {item.wko_ls11_sts_upd && (
                                      <p>{item.wko_ls11_sts_upd}</p>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                    <div className="input-container">
                      <label htmlFor="file-upload" className="upload-icon">
                        <Iconify icon="fa:camera" />
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef2}
                        style={{ display: "none" }}
                        disabled={data.statusKey === "CLO"}
                        onChange={handleImageChange2}
                      />

                      {imagePreview && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            onClick={handleImageClickSHow}
                          />

                          {/* Close icon */}
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              cursor: "pointer",
                              padding: "1px",
                              background: "rgba(255, 255, 255, 0.7)",
                              borderRadius: "50%",
                              width: "21px",
                              height: "22px",
                            }}
                            
                            onClick={handleUploadCloseClick}
                          >
                            <Iconify icon="carbon:close-outline" />
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        className="text_input"
                        placeholder="Comment..."
                        disabled={!!imagePreview || data.statusKey === "CLO"}
                        ref={messageRef}
                      />
                      {selectedImage && (
                        <div className="upImgCntr">
                          <img
                            src={`data:image/png;base64,${selectedImage}`}
                            alt="Selected Image"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={data.statusKey === "CLO"}
                        className="submit-button"
                        onClick={handleSubmitCmmnt}
                      >
                        <Iconify icon="fa:send" />
                      </button>
                    </div>
                  </div>
            
            </div>
            <div>
          
{/******************** Comments add Details ********************/}
              <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={show}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    m: 0,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Iconify
                      icon="quill:chat"
                      style={{
                        fontSize: "24px",
                        verticalAlign: "middle",
                        marginRight: "5px",
                      }}
                    />
                    <span style={{ fontSize: "16px", verticalAlign: "middle" }}>
                      Work Order Comment
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      aria-label="close"
                      onClick={Refreshdatapopup}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="tabler:refresh" />
                    </IconButton>
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="ic:baseline-close" />
                    </IconButton>
                  </div>
                </DialogTitle>

                <DialogContent dividers>
                  <div className="chat-container">
                    <div className="menud" ref={chatContainerRef}>
                      <ol className="chatd">
                        {loading ? (
                          <li>Loading...</li>
                        ) : (
                          AllCommnet.map((item, index) => (
                            <li
                              key={index}
                              className={`messagedd ${
                                item.wko_ls11_name === emp_mst_name
                                  ? "self2"
                                  : "other2"
                              }`}
                            >
                              <div
                                className={`avatar2 ${
                                  item.wko_ls11_name === emp_mst_name
                                    ? "top-left"
                                    : "bottom-right"
                                }`}
                              >
                                <span>
                                  {item.wko_ls11_name
                                    ? item.wko_ls11_name.charAt(0)
                                    : "?"}
                                </span>
                              </div>
                              <div className="msg2">
                                <div className="msfcls">
                                  <p className="usrName">
                                    <span>{item.wko_ls11_name}</span>
                                  </p>
                                  <p className="msgP">
                                    {Moment(item.audit_date.date).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </p>
                                  {item.full_size_link ? (
                                    <img
                                      src={item.full_size_link}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : item.attachment ? (
                                    <img
                                      src={`data:image/png;base64,${item.attachment}`}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : null}

                                  <p className="commentTxt">
                                    {item.wko_ls11_sts_upd && (
                                      <p>{item.wko_ls11_sts_upd}</p>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                    <div className="input-container">
                      <label htmlFor="file-upload" className="upload-icon">
                        <Iconify icon="fa:camera" />
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef2}
                        style={{ display: "none" }}
                        onChange={handleImageChange2}
                      />

                      {imagePreview && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            onClick={handleImageClickSHow}
                          />

                          {/* Close icon */}
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              cursor: "pointer",
                              padding: "1px",
                              background: "rgba(255, 255, 255, 0.7)",
                              borderRadius: "50%",
                              width: "21px",
                              height: "22px",
                            }}
                            onClick={handleUploadCloseClick}
                          >
                            <Iconify icon="carbon:close-outline" />
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        className="text_input"
                        placeholder="Comment..."
                        disabled={!!imagePreview}
                        ref={messageRef}
                      />
                      {selectedImage && (
                        <div className="upImgCntr">
                          <img
                            src={`data:image/png;base64,${selectedImage}`}
                            alt="Selected Image"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        </div>
                      )}
                      <button
                        type="submit"
                        className="submit-button"
                        onClick={handleSubmitCmmnt}
                      >
                        <Iconify icon="fa:send" />
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </BootstrapDialog>

            { /* Img file name popup */}
            
            </div>
            
          </div>
        </div>
      </div>
    
    </>
  );
};

export default WorkOrderComments;
