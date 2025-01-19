import { Icon } from "@iconify/react/dist/iconify.js";
import { Grid, IconButton, makeStyles, MenuItem, styled, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import httpCommon from "src/http-common";
import { useNavigate } from "react-router";
import MasterDialog from "./conmponent/MasterDialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import Swal from "sweetalert2";

import Iconify from "src/components/iconify";


// const CustomIconButton = styled(IconButton)(({ theme }) => ({
 
//   '&:hover': {
//     backgroundColor: '#f0f9ff',
//   },
// }));



function AssetItems({
  item,
  allImages,
  allAssets,
  setRefetch,
  setData,
  data,
  activeField,
  setActiveField,
  tableData,
}) {
  const [childrenOpen, setChildrenOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState("");
  const popover = usePopover();
  let site_ID = localStorage.getItem("site_ID");
  const [DefaultModal, setDefaultModal] = useState(false);
  const [textField, setTextField] = useState("");

  // active
  const [active, setActive] = useState("");






  // navigation
  const navigate = useNavigate();

  // animation for chilf
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, y: 0 },
    hover: {
      scale: 1.02,
      border: "1px solid #6082B6",
      color: "#6082B6",
      backgroundColor: "#F0F8FF",
      transition: { duration: 0.5 },
    },
    selected: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const handleActive = (name) => {
    setActive(name);
  };

  const [imageError, setImageError] = useState(false);

  const handleDelete = async (no) => {
    // popover.onClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const body = {
            site_cd: site_ID,
            ast_mst_asset_no: no,
          };

          const response = await httpCommon.post(
            "/delete_ast_child_hirech.php",
            body
          );

          if (response.data.status === "SUCCESS") {
            setRefetch(false);
            Swal.fire({
              title: "Sucess",
              text: "Record Deleted Successfully ",
              icon: "success",
              timer: 2000,
            }).then(() => setRefetch(true));
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  };

  const handleUpdate = async (datat) => {
    try {
      const body = {
        ast_mst_asset_no: datat,
        ast_mst_parent_id: textField,
        site_cd: site_ID,
      };

      const response = await httpCommon.post(
        `/update_ast_child_hirech.php`,
        body
      );

      if (response.data.status === "SUCCESS") {
        setRefetch(true);
        setData("");
        setTextField("");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddClick = (e) => {
    setRefetch(false);
    setDefaultModal(!DefaultModal);
    setTextField(e);
  };

  const handleClose = (e, result) => {
    if (result !== "backdropClick") {
      setDefaultModal(false);
    }
  };

  useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  const handleImageError = (item) => {
    setImageError((prevState) => ({
      ...prevState,
      [item.RowID]: true,
    }));
  };

  const findImage = (row) => {
    const image = allImages.find((item) => item.mst_RowID === row.RowID);
    if (image) {
      const url = httpCommon.defaults.baseURL;
      const img = `${url}/${image.attachment}`;
      console.log("image");
      return img;
    }
    return "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg";
  };

  return (
    <LazyMotion features={domAnimation}>

      <Grid container spacing={0} rowGap={0} >
        <Grid
          item
          xs={2}
          md={1}
          style={{ display: "flex", justifyContent: "end" }}
        >
          {/* Check if the item has any children */}
          {allAssets.some(
            (obj) => item.ast_mst_asset_no === obj.ast_mst_parent_id
          ) && (
            <div style={{background:"",display:"flex",justifyContent:"end"}}>
            <Icon
              icon={
                iconOpen === item.ast_mst_asset_no
                  ? "mingcute:down-fill"
                  : "mingcute:right-fill"
              }
              onClick={() => {
                setIconOpen(iconOpen ? "" : item.ast_mst_asset_no);
                setChildrenOpen(!childrenOpen);
                setActiveField(item.ast_mst_asset_no);
              }}
              className="icons"
              style={{
                color: "gray",
                marginRight: "12px",
                marginTop: "24px",
                cursor: "pointer",
                width: "16px",
                height: "16px",
                marginLeft:"auto"
              }}
            />
            </div>
          )}
        </Grid>

        <Grid item xs={10} md={11}>
          <m.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <m.div
              className="assetlistCard"
              key={item.ast_mst_asset_no}
              onMouseOver={() => handleActive(item.ast_mst_asset_no)}
              onMouseLeave={() => handleActive("")}
              style={{
                cursor: "pointer",
                backgroundColor:
                  activeField === item.ast_mst_asset_no ? "#f4f4f5" : "white",
                color: "black",
              }}
              variants={itemVariants}
              animate={iconOpen ? "selected" : "show"}
              // whileHover="hover"
              onClick={() => {
                setIconOpen(iconOpen ? "" : item.ast_mst_asset_no);
                setChildrenOpen(!childrenOpen);
                setActiveField(item.ast_mst_asset_no);
              }}
            >
              {/* side image */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  width: "100%",
                  // flexWrap:"wrap"
                }}
              >
                <div className="h30">
              
                <div
                  style={{
                    borderRadius: "50%",
                    border: "1px solid gray",
                    overflow: "hidden",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0 8px 15px",
                    marginRight: "20px",
                    height: "40px",
                    width: "40px",
                  }}
                  className="assetImg"
                >
                  {!imageError[item.RowID] ? (
                    <img
                      alt="asset imagae"
                      src={findImage(item)}
                      // style={{
                      //   borderRadius: "50%",
                      //   border: "1px solid gray",
                      //   overflow: "hidden",
                      //   boxShadow: "rgba(0, 0, 0, 0.15) 0 8px 15px",
                      //   marginRight:"20px",
                      //   objectFit: "cover",

                      // }}
                      style={{
                        objectFit: "cover",
                        overflow: "hidden",
                        height: "100%",
                        width: "100%",
                      }}
                      // className="assetImg"
                      onError={() => handleImageError(item)}
                    />
                  ) : (
                    <img
                      alt="asset imagae"
                      src={
                        "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"
                      }
                      style={{
                        objectFit: "cover",
                        overflow: "hidden",
                        height: "100%",
                        width: "100%",
                      }}
                      // className="assetImg"
                      onError={() => handleImageError(item)}
                    />
                  )}
                </div>
                </div>
                {/* part 2 */}

                <Typography className="fs12" style={{ width: "100%",height:"auto",
                     whiteSpace: "nowrap",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                 }}>
                  {item.ast_mst_asset_no} : {item.ast_mst_asset_shortdesc}
                </Typography>
                <div className="visibleOption">
                <IconButton
                  color={popover.open ? "primary" : "default"}
                  onClick={popover.onOpen}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
                </div>
              </div>



              <div className="visibleOption">
              

                <CustomPopover
                  open={popover.open}
                  onClose={popover.onClose}
                  arrow="right-top"
                  sx={{ width: 140 }}
                >
                  {/* add */}
                  <MenuItem sx={{ color: "error.main" }}>
                    <Tooltip title="Add" arrow>
                      <div
                        style={{
                          cursor: "pointer",
                          color: "gray",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        onClick={() => {
                          handleAddClick(item.ast_mst_asset_no);
                          popover.onClose();
                        }}
                      >
                        <Icon
                          icon="ei:plus"
                          width="20px"
                          height="20px"
                          style={{ color: "#2A9D4A" }}
                        />
                        Add
                      </div>
                    </Tooltip>
                  </MenuItem>

                  {/* delete */}
                  <MenuItem sx={{ color: "error.main" }}>
                    <Tooltip title="delete" arrow>
                      <div
                        style={{
                          cursor: "pointer",
                          color: "gray",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        onClick={() => {
                          handleDelete(item.ast_mst_asset_no);
                          popover.onClose();
                        }}
                      >
                        <Icon
                          icon="material-symbols-light:delete-outline"
                          width="20px"
                          height="20px"
                          style={{ color: "red" }}
                        />
                        Delete
                      </div>
                    </Tooltip>
                  </MenuItem>

                  {/* create WR request */}
                  <MenuItem sx={{ color: "error.main" }}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/dashboard/work/newRequest",{
                        state:{
                          RowID: item.RowID,
                          AssetNo:item.ast_mst_asset_no,
                          chkAssetHiercty:'ComingFromAssetHirecty'
                        }
                      })}
                    >
                      <Tooltip title="Create WR" arrow>
                        <div
                          style={{
                            cursor: "pointer",
                            color: "gray",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Icon
                            icon="oui:ml-create-population-job"
                            width="20px"
                            height="20px"
                            style={{ color: "black" }}
                          />
                          Create WR
                        </div>
                      </Tooltip>
                    </div>
                  </MenuItem>

                  {/* create WO request */}
                  <MenuItem sx={{ color: "error.main" }}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/dashboard/work/neworder",{
                        state:{
                          
                        }
                      })}
                    >
                      <Tooltip title="Create WO" arrow>
                        <div
                          style={{
                            cursor: "pointer",
                            color: "gray",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Icon
                            icon="gridicons:create"
                            width="20px"
                            height="20px"
                            style={{ color: "#6366f1" }}
                          />
                          Create WO
                        </div>
                      </Tooltip>
                    </div>
                  </MenuItem>
                </CustomPopover>
              </div>

              <div className="displaynone">
                <m.div
                  className="buttonBox"
                  initial={{ opacity: 0, display: "none" }}
                  animate={{
                    opacity: active === item.ast_mst_asset_no ? 1 : 0,
                    display: active === item.ast_mst_asset_no ? "flex" : "none",
                    alignItems: "center",
                    gap:"2px"
                  }}
                  transition={{ duration: 1.2 }}
                >
                  {/* add */}
                  <Tooltip title="Add Child Asset" arrow placement="top" >
                    <m.div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddClick(item.ast_mst_asset_no)}
                      initial={{scale:1}}
                      whileHover={{scale:1.1}}
                    >
                      {/* <IconButton> */}
                      <IconButton aria-label="Add Asset" size="small">
                      <Icon
                        icon="ei:plus"
                        width="25px"
                        height="25px"
                        style={{ color: "#16a34a", transform: "scale(1.02)" }}
                      />
                      </IconButton>
                      {/* </IconButton> */}
                    </m.div>
                  </Tooltip>

                  {/* delete */}
                  <Tooltip title="Delete Asset" arrow placement="top">
                    <m.div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(item.ast_mst_asset_no)}
                      initial={{scale:1}}
                      whileHover={{scale:1.1}}
                    >
                       <IconButton aria-label="delete" size="small">
                      <Icon
                        icon="material-symbols-light:delete-outline"
                        width="25px"
                        height="25px"
                        style={{ color: "red", transform: "scale(1.02)" }}
                      />
                      </IconButton>
                    </m.div>
                  </Tooltip>


                  
                
                  {/* CreateWR */}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/dashboard/work/newRequest", {
                        state:{
                          RowID: item.RowID,
                          AssetNo:item.ast_mst_asset_no,
                          chkAssetHiercty:'ComingFromAssetHirecty'
                        }
                      })
                    }
                  >
                    <Tooltip title="Create WR" arrow placement="top" >
                      <m.div style={{ cursor: "pointer" }}
                         initial={{scale:1}}
                         whileHover={{scale:1.1}}
                      >
                      <IconButton aria-label="delete" size="small">
                        <Icon
                          icon="oui:ml-create-population-job"
                          width="25px"
                          height="25px"
                          style={{
                            color: "405cf5e3",
                            transform: "scale(1.02)",
                          }}
                        />
                        </IconButton>
                      </m.div>
                    </Tooltip>
                  </div>

                  {/* CreateWO */}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/dashboard/work/neworder", {
                        state: { 
                          RowID: item.RowID,
                          AssetNo:item.ast_mst_asset_no,
                          chkAssetHiercty:'ComingFromAssetHirecty'
                        },
                      })
                    }
                  >
                    <Tooltip title="Create WO" arrow placement="top">
                      <m.div style={{ cursor: "pointer" }}
                      
                      initial={{scale:1}}
                      whileHover={{scale:1.1}}
                      
                      >
                      <IconButton aria-label="delete" size="small">
                        <Icon
                          icon="gridicons:create"
                          width="24px"
                          height="24px"
                          style={{ color: "#6366f1", transform: "scale(1.02)" }}
                        />
                        </IconButton>
                      </m.div>
                    </Tooltip>
                  </div>
                </m.div>
              </div>
            </m.div>

            <div style={{}}>
              {allAssets.map((obj) => {
                if (
                  item.ast_mst_asset_no === obj.ast_mst_parent_id &&
                  childrenOpen
                ) {
                  return (
                    <AssetItems
                      item={obj}
                      allImages={allImages}
                      allAssets={allAssets}
                      setRefetch={setRefetch}
                      setData={setData}
                      data={data}
                      activeField={activeField}
                      setActiveField={setActiveField}
                      tableData={tableData}
                    />
                  );
                }
                return null;
              })}
            </div>
          </m.div>
        </Grid>
      </Grid>
      {/* main div  end*/}

      {/* master Dialog */}
      {/* </div> */}
      <m.div
        variants={staggerContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 2 } }}
      >
        <MasterDialog
          setData={setData}
          handleClose={handleClose}
          open={DefaultModal}
          name={textField}
          handleUpdate={handleUpdate}
          tableData={tableData}
        />
      </m.div>
    </LazyMotion>
  );
}

export default AssetItems;
