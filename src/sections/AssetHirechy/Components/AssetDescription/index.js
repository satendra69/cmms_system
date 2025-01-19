import { Icon } from "@iconify/react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import httpCommon from "src/http-common";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AssetItems from "./AssetItems";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import spinner from "../spinner.gif";
import MasterDialog from "./conmponent/MasterDialog";

function AssetDescription() {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const [refetch, setRefetch] = useState(false);
  const [textField, setTextField] = useState("");
  const [tableData, setTableData] = useState([]);
  const [folder, setFolder] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
  });
  const [data, setData] = useState("");
  // active field
  const [activeField, setActiveField] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFieldChild, setActiveFieldChild] = useState("");

  // data
  const [assets, setAssets] = useState([]);
  const [allImages, setImages] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);

  // modal
  const [DefaultModal, setDefaultModal] = useState(false);

  // animation
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, transition: { duration: 0.7 } },
  };

  // table Function for parent
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

  const handleInsert = async (datat) => {
    try {
      const body = {
        ast_mst_asset_no: datat,
        site_cd: site_ID,
      };

      const response = await httpCommon.post(
        `/insert_ast_parent_hirech.php`,
        body
      );
      console.log("responseParent", response);
      if (response.data.status === "SUCCESS") {
        setRefetch(true);
        setData("");
        setTextField("");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleParentClick = (e) => {
    setFolder((pre) => ({
      ...pre,
      level1: pre.level1 ? false : true,
    }));
    setRefetch(false);
    setDefaultModal(!DefaultModal);
    setTextField(e);
  };

  // table Function for parent end

  const fetchImages = async () => {
    setLoading(true);

    try {
      const response = await httpCommon.get(
        `/get_asset_desc_image.php?page=${page ? page : "1"}`
      );

      setImages(response.data.data.AllImgGet);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  // get AllImages
  useEffect(() => {
    fetchImages();
  }, [refetch]);

  // fetch Assets

  const fetchDescription = async () => {
    setRefetch(false);
    setLoading(true);
    try {
      const response = await httpCommon.get(
        `/get_ast_desc_list_hirech.php?site_cd=${site_ID}&page=${
          page ? page : "1"
        }`
      );

      setLimit(response.data.limit);
      setTotal(response.data.total);
      setAssets(response.data.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch TableData
  const fetchTableData = async () => {
    setRefetch(false);
    try {
      const response = await httpCommon.get(
        "/get_ast_child_all_hirech.php?site_cd=" + site_ID
      );
      setTableData(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  // fetch assets
  useEffect(() => {
    fetchTableData();
    fetchDescription();
  }, [refetch]);

  // fetch All Assets

  useEffect(() => {
    const fetchAllAssets = async () => {
      const response = await httpCommon.get(
        `/get_ast_desc_all_list_hirech.php?site_cd=${site_ID}`
      );
      console.log("all_assets", response);
      setAllAssets(response.data.data);
    };
    fetchAllAssets();
  }, [refetch]);

  const myThrottle = (cb, d) => {
    let last = 0;
    return (...args) => {
      let now = new Date().getTime();
      if (now - last < d) return;
      last = now;
      return cb(...args);
    };
  };

  const handleScroll = myThrottle(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 500 >
        document.documentElement.offsetHeight &&
      !loading &&
      limit < total
    ) {
      setPage(page + 1);
      fetchDescription();
      fetchImages();
    }
  }, 500);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      {/* level 1 folder*/}
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          <m.div
            variants={fadeAnimation}
            className={` ${
              activeField === "1" ? "selectedField" : ""
            } levelstyle level1`}
            style={{
              padding: "2px 14px",

              // background: activeField === "1" ?"#faf5ff":"",

              borderRadius: "5px",
              // boxShadow:
              //   activeField === "1"
              //     ? "rgba(0, 0, 0, 0.16) 0px 1px 4px"
              //     : "0px 0px 0px transparent",
              width: "max-content",
              borderRadius: "8px",
            }}
            onClick={() => {
              setFolder((pre) => ({
                ...pre,
                level1: !pre.level1,
              }));
              setActiveField("1");
            }}
          >
            {/* arrow top down */}
            {folder.level1 ? (
              <Icon
                icon="mingcute:down-fill"
                width="1.2rem"
                height="1.2rem"
                style={{ color: activeField === "1" ? "gray" : "grey" }}
              />
            ) : (
              <Icon
                icon="mingcute:right-fill"
                width="1.2rem"
                height="1.2rem"
                style={{ color: activeField === "1" ? "gray" : "gray" }}
              />
            )}
            {/* arrow top down end */}

            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
              {/* title and icon */}

              
              <div
                className="leftIcons"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
               
                <Icon
                  icon="flat-color-icons:folder"
                  width="30px"
                  height="30px"
                />
           
                <Typography sx={{ fontWeight: 600,fontSize:"14px" }}>Asset Hirechy</Typography>
              </div>
          

              {/* right side file icon */}
              {activeField === "1" && (
                 <Tooltip title="Add Parent Asset" arrow placement="top">
                <m.div
                  variants={fadeAnimation}
                  onClick={() => handleParentClick("open")}
                  className="rightIcons"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  whileHover={{scale:1.1}}
                >
                  <IconButton aria-label="delete" size="small">
                  <Icon
                    icon="tabler:file-plus"
                    width="1.3rem"
                    height="1.5rem"
                    style={{ color: "#50C878" }}
                  />
                  </IconButton>
                </m.div>
                </Tooltip>
              )}
            </div>
          </m.div>

          {/* title and icon end */}

          {/* level2 workArea */}
          {folder && folder.level1 && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              transition={{ duration: 0.7 }}
              className="level2"
              style={{ marginLeft: "-40px", marginRight: "8px" }}
            >
              {assets.map((item) => (
                <AssetItems
                  item={item}
                  allImages={allImages}
                  allAssets={allAssets}
                  setRefetch={setRefetch}
                  data={data}
                  setData={setData}
                  loading={loading}
                  activeField={activeFieldChild}
                  setActiveField={setActiveFieldChild}
                  tableData={tableData}
                />
              ))}
            </m.div>
          )}

          <MasterDialog
            setData={setData}
            handleClose={handleClose}
            open={DefaultModal}
            name={textField}
            handleUpdate={handleInsert}
            tableData={tableData}
          />
        </AnimatePresence>
      </LazyMotion>
      {/* leve2 end */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={spinner} />
        </div>
      )}
    </div>
  );
}

export default AssetDescription;
