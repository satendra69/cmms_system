import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  duration,
  IconButton,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import httpCommon from "src/http-common";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useNavigate } from "react-router";
import Iconify from "src/components/iconify";


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
  hidden: { opacity: 0, x: 20},
  show: { opacity: 1, y: 0  },
  hover: { scale: 1.02,border:"1px solid #6082B6", color:"#6082B6",backgroundColor:"rgb(115, 147, 179,0.2)", transition: { duration: 0.5 } }
};

function AssetItems({ data, allImages }) {
  const [active, setActive] = useState("");
  const [activeID, setActiveID] = useState("");
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState("");

  // popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open2 = Boolean(anchorEl);
  const id = open2 ? 'simple-popover' : undefined;

  const popover = usePopover();
  // navigation
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const handleActive = (name,id) => {
    setActive(name);
    setActiveID(id);
  };

  const [imageError, setImageError] = useState(false);

  const handleImageError = (item) => {
    console.error("Error_loading_image:", item);

    setImageError((prevState) => ({
      ...prevState,
      [item.RowID]: true,
    }));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
          zIndex:2
        }}
      >
      
        {data.map((item) => (
          <m.div
            className="assetlistCard"
            key={item.ast_mst_asset_no}
            onMouseOver={() => handleActive(item.ast_mst_asset_no,item.RowID)}
            onMouseLeave={() => handleActive("")}
            style={{ cursor: "pointer",width:"90%",zIndex:2}}
            variants={itemVariants}
      
   
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
               style={{overflow:"hidden",zIndex:2,borderRadius:"50%",border:"1px solid black",height:"40px",width:"40px" ,}}
                className="assetImg"
              >
                {/* side image */}
                {!imageError[item.RowID] ? (
                  <img
                    alt="asset imagae"
                    src={findImage(item)}
                
                  style={{objectFit:"cover",height:"100%",width:"100%"}}
                    onError={() => handleImageError(item)}
                  />
                ) : (
                  <img
                    alt="asset imagae"
                    src={
                      "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"
                    }
                
                    style={{objectFit:"cover"}}
                    onError={() => handleImageError(item)}
                  />
                )}
              </div>


              {/* description */}
              <Typography className="fs12 m50" >
                {item.ast_mst_asset_no} : {item.ast_mst_asset_shortdesc}
              </Typography>
            </div>
                   {/* description end */}
   {/* description end */}
   <div className="visibleOption">                  
                     <IconButton onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
                </div>

            {/* desktop button */}
            <div className="displaynone">
              <m.div
                className="buttonBox"
                initial={{ opacity: 0, display: "none" }}
                animate={{
                  opacity: active === item.ast_mst_asset_no ? 1 : 0,
                  display: active === item.ast_mst_asset_no ? "flex" : "none",
                }}
                transition={{ duration: 1.2 }}
                style={{ marginRight: "20px" }}
              >
               

                {/* CreateWR */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/dashboard/work/newRequest",{state:{
                    RowID:item.RowID,
                    AssetNo:item.ast_mst_asset_no,
                    chkAssetHiercty:'ComingFromAssetHirecty'
                  }})}
                >
                  <Tooltip title="Create WR" placement="top">
                    <m.div style={{ cursor: "pointer" }}
                     initial={{ scale: 1 }}
                     whileHover={{ scale: 1.1 }}
                    >
                    <IconButton aria-label="create wo">
                      <Icon
                        icon="oui:ml-create-population-job"
                        width="22px"
                        height="22px"
                        style={{ color: "#0EC244" }}
                      />
                      </IconButton>
                    </m.div>
                  </Tooltip>
                </div>

                {/* CreateWO */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/dashboard/work/neworder",{
                    state:{ 
                    RowID:item.RowID,
                    AssetNo:item.ast_mst_asset_no,
                    chkAssetHiercty:'ComingFromAssetHirecty'


                  }})}
                >
                  <Tooltip title="Create WO" placement="top">
                    <m.div style={{ cursor: "pointer" }}
                     initial={{ scale: 1 }}
                     whileHover={{ scale: 1.1 }}
                    >
                    <IconButton aria-label="create wo">
                      <Icon
                        icon="gridicons:create"
                        width="22px"
                        height="22px"
                        style={{ color: "#6495ED" }}
                      />
                      </IconButton>
                    </m.div>
                  </Tooltip>
                </div>
              </m.div>
            </div>
          </m.div>
        ))}
     </m.div>

      {/* mobile buttons */}
      <div className="visibleOption">
                <IconButton
                  color={popover.open ? "primary" : "default"}
                  onClick={popover.onOpen}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

                <CustomPopover
                  open={popover.open}
                  onClose={popover.onClose}
                  arrow="right-top"
                  sx={{ width: 140 }}
                >
                  {/* create WR request */}
                  <MenuItem sx={{ color: "error.main" }}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/dashboard/work/newRequest",{
                        state:{
                          RowID: activeID,
                          //AssetNo:item.ast_mst_asset_no,
                          chkAssetHiercty:'ComingFromAssetHirecty'
                        }
                      })}
                    >
                      <Tooltip title="Create WR">
                        <div
                          style={{
                            cursor: "pointer",
                            color:"gray",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Icon
                            icon="oui:ml-create-population-job"
                            width="20px"
                            height="20px"
                            style={{ color: "#0EC244" }}
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
                          RowID: activeID,
                        //  AssetNo:item.ast_mst_asset_no,
                          chkAssetHiercty:'ComingFromAssetHirecty'
                        }
                      })}
                    >
                      <Tooltip title="Create WO">
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

              
    </LazyMotion>
  );
}

export default AssetItems;
