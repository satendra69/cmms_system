import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Checkbox,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import httpCommon from "src/http-common";
import { useNavigate } from "react-router";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import Swal from "sweetalert2";

import Iconify from "src/components/iconify";

function AssetItems({
  item,
  activeField,
  setActiveField,
  stockLocationData,
  setStockLocationData,
  handleStock,
}) {
  let site_ID = localStorage.getItem("site_ID");
  const [DefaultModal, setDefaultModal] = useState(false);

  // active
  const [active, setActive] = useState(false);

  const [checkedData, setCheckedData] = useState({
    usg_itm_list: 0,
    usg_itm_change: 0,
    RowID: "",
  });

  // useEffect(() => {

  //     // Ensure item exists
  //     setCheckedData({
  //       usg_itm_list: Number(item.usg_itm_list),
  //       usg_itm_change: Number(item.usg_itm_change), // Corrected this line
  //       RowID: item.RowID, // Ensure RowID is also set
  //     });

  // }, []);

  useEffect(() => {
    handleStock(checkedData);
    setActive(false);
  }, [active]);

  // const handleChangeCheck = (e) => {
  //   const value = e.target.checked;

  //   setCheckedData((prev) => ({
  //     ...prev,
  //     [e.target.name]: value ? 1 : 0,
  //     RowID: item.RowID,
  //   }));

  //   setActive(true);
  // };

  const handleChangeCheck = (e) => {
    const value = e.target.checked;
  
    setCheckedData((prev) => ({
      ...prev,
      [e.target.name]: value ? 1 : 0,
      RowID: item.RowID 
    }));
  
    setActive(true); 
  };

  useEffect(() => {
    if (item) {
      // Ensure item exists
      setCheckedData({
        usg_itm_list: Number(item.usg_itm_list),
        usg_itm_change: Number(item.usg_itm_change), // Corrected this line
        RowID: item.RowID, // Ensure RowID is also set
      });
    }
  }, [item]);

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

  return (
    <LazyMotion features={domAnimation}>
      <Grid container spacing={0} rowGap={0}>
        <Grid item xs={12} md={12}>
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
              className="assetlistCard2"
              key={item.ast_mst_asset_no}
              style={{
                cursor: "pointer",
                backgroundColor:
                  activeField === item.ast_mst_asset_no ? "#f4f4f5" : "white",
                color: "black",
              }}
              variants={itemVariants}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                {/* Stock Location */}
                <Typography
                  sx={{
                    width: { xs: "50px", md: "180px" },
                    fontSize: { xs: "10px", md: "13px" },
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mr: { xs: 1 },
                   
                  }}
                >
                  {item.loc_mst_stk_loc}
                </Typography>

                {/* Location Description */}
                <Typography
                  sx={{
                    width: { xs: "120px", md: "700px" },
                    fontSize: { xs: "10px", md: "13px" },
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.loc_mst_desc}
                </Typography>

                {/* List Checkbox */}
                <Stack
                  sx={{
                    width: { xs: "80px", md: "150px" },
                    textAlign: "center",
                  }}
                >
                  <div>
                    <Checkbox
                      checked={checkedData.usg_itm_list === 0 ? false : true}
                      onChange={handleChangeCheck}
                      name="usg_itm_list"
                    />
                  </div>
                </Stack>

                {/* Change Checkbox */}
                <Stack
                  sx={{
                    width: { xs: "50px", md: "100px" },
                    textAlign: "center",
                  }}
                >
                  <div>
                    <Checkbox
                      checked={checkedData.usg_itm_change === 0 ? false : true}
                      onChange={handleChangeCheck}
                      name="usg_itm_change"
                    />
                  </div>
                </Stack>
              </div>
            </m.div>
          </m.div>
        </Grid>
      </Grid>

      <m.div
        variants={staggerContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 2 } }}
      ></m.div>
    </LazyMotion>
  );
}

export default AssetItems;
