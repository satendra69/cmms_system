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
import { useNavigate } from "react-router";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import Swal from "sweetalert2";
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
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, y: 0 },
  hover: {
    scale: 1.02,
    border: "1px solid #6082B6",
    color: "#6082B6",
    backgroundColor: "rgb(115, 147, 179,0.2)",
    transition: { duration: 0.5 },
  },
};

function AssetItems({ data, allImages }) {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState("");
  const popover = usePopover();
  const [active, setActive] = useState("");
  // navigation
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActive = (name) => {
    setActive(name);
  };

  const [imageError, setImageError] = useState(false);

  const handleImageError = (item) => {
    console.error("Error_loading_image:", item);

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
        {data.map((item) => (
          <m.div
            className="assetlistCard"
            key={item.ast_mst_asset_no}
            onMouseOver={() => handleActive(item.ast_mst_asset_no)}
            onMouseLeave={() => handleActive("")}
            style={{ cursor: "pointer", width: "90%" }}
            variants={itemVariants}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  borderRadius: "50%",
                  border: "1px solid gray",
                  overflow: "hidden",
                  boxShadow: "rgba(0, 0, 0, 0.15) 0 8px 15px",
                  height: "40px",
                  width: "40px",
                }}
                className="assetImg"
              >
                {/* side image */}
                {!imageError[item.RowID] ? (
                  <img
                    alt="asset imagae"
                    src={findImage(item)}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
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
                      height: "100%",
                      width: "100%",
                    }}
                    onError={() => handleImageError(item)}
                  />
                )}
              </div>

              <Typography className="fs12 m50">
                {item.ast_mst_asset_no} : {item.ast_mst_asset_shortdesc}
              </Typography>
            </div>

            <div className="visibleOption">
              <div style={{ position: "relative" }}>
                <IconButton onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

                {open && row === item.ast_mst_asset_no && (
                  <div
                    ref={popoverRef}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "5px",
                      background: "white",
                      borderRadius: "10px",
                      padding: "20px",
                    }}
                    className="shadow11"
                  >
                    {/* create WR request */}
                    <MenuItem
                      sx={{ color: "error.main" }}
                      onClick={() => setOpen(false)}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/dashboard/work/newRequest", {
                            state: {
                              RowID: item.RowID,
                              AssetNo: item.ast_mst_asset_no,
                              chkAssetHiercty: "ComingFromAssetHirecty",
                            },
                          })
                        }
                      >
                        <Tooltip title="Create WR" arrow>
                          <m.div
                            style={{
                              cursor: "pointer",
                              color: "gray",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            initial={{scale:1}}
                             whileHover={{scale:1.1}}
                          >
                            <Icon
                              icon="oui:ml-create-population-job"
                              width="25px"
                              height="25px"
                              style={{ color: "405cf5e3" }}
                            />
                            Create WR
                          </m.div>
                        </Tooltip>
                      </div>
                    </MenuItem>

                    {/* create WO request */}
                    <MenuItem
                      sx={{ color: "error.main" }}
                      onClick={() => setOpen(false)}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/dashboard/work/neworder", {
                            state: {
                              RowID: item.RowID,
                              AssetNo: item.ast_mst_asset_no,
                              chkAssetHiercty: "ComingFromAssetHirecty",
                            },
                          })
                        }
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
                              width="24px"
                              height="24px"
                              style={{ color: "gray" }}
                            />
                            Create WO
                          </div>
                        </Tooltip>
                      </div>
                    </MenuItem>
                  </div>
                )}
              </div>
            </div>

            {/* 
            <IconButton
              >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}

            {/*  destop view */}

            <div className="displaynone">
              <m.div
                className="buttonBox"
                initial={{ opacity: 0, display: "none" }}
                animate={{
                  opacity: active === item.ast_mst_asset_no ? 1 : 0,
                  display: active === item.ast_mst_asset_no ? "flex" : "none",
                }}
                transition={{ duration: 1.2 }}
              >
          

                {/* CreateWR */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate("/dashboard/work/newRequest", {
                      state: {
                        RowID: item.RowID,
                        AssetNo: item.ast_mst_asset_no,
                        chkAssetHiercty: "ComingFromAssetHirecty",
                      },
                    })
                  }
                >
                  <Tooltip title="Create WR" arrow placement="top">
                    <m.div style={{ cursor: "pointer" }}
                    initial={{scale:1}}
                    whileHover={{scale:1.1}}
                    >
                    <IconButton aria-label="create wr">
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
                  onClick={() => navigate("/dashboard/work/neworder")}
                >
                  <Tooltip title="Create WO" arrow placement="top">
                    <m.div
                      style={{ cursor: "pointer" }}
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
            {/* end  destop view */}
          </m.div>
        ))}
      </m.div>
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
              onClick={() => navigate("/dashboard/work/newRequest")}
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
              onClick={() => navigate("/dashboard/work/neworder")}
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
    </LazyMotion>
  );
}

export default AssetItems;
