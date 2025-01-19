import { Icon } from "@iconify/react";
import { Typography } from "@mui/material";
import httpCommon from "src/http-common";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AssetItems from "./AssetItems";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import spinner from "../spinner.gif";

function AssetSystem() {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");

  const [folder, setFolder] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
  });

  // active field
  const [activeField, setActiveField] = useState("");
  const [showParentIcons, setShowParentIcons] = useState("");

  // data
  const [assetType, setAssetType] = useState([]);
  const [assetCode, setAssetCode] = useState([]);
  const [grpCode, setGrpCode] = useState([]);
  const [allImages, setImages] = useState([]);
  const [assetDetails, setAssetDetails] = useState([]);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [assetTypeOpen,setAssetTypeOpen]=useState({})
  const [assetCodeOpen,setAssetCodeOpen]=useState({})
  const [grpCodeOpen,setGrpCodeOpen]=useState({})
  
 

  // params
  const [selectedType, setSelectedType] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedGrpCode, setselectedGrpCode] = useState("");

  const [selectedCommonArea, setselectedCommonArea] = useState("");

  // animation
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, transition: { duration: 0.7 } },
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await httpCommon.get("/get_asset_desc_image.php");
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
  }, []);

  // fetch asset type
  useEffect(() => {
    const fetchAssetType = async () => {
      const response = await httpCommon.get(
        `/get_ast_code_sys_hirech.php?site_cd=${site_ID}`
      );
      setAssetType(response.data.data);
    };
    fetchAssetType();
  }, []);

  // get assetCode
  const fetchAssetCode = async (type) => {
    const response = await httpCommon.get(
      `/get_ast_sys_hirech.php?site_cd=${site_ID}&ast_typ=${type}`
    );

    if (response.data.status === "SUCCESS") {
      setAssetCode(response.data.data);
    } else {
      setAssetCode([]);
    }
  };

  // fetch Asset Group Code
  const fetchGroupCode = async (code) => {
    const response = await httpCommon.get(
      `/get_ast_grp_code_sys_hirech.php?site_cd=${site_ID}&ast_typ=${selectedType}&ast_code=${code}`
    );

    if (response.data.status === "SUCCESS") {
      setGrpCode(response.data.data);
    } else {
      setGrpCode([]);
    }
  };

  const fetchAsset = async (loc) => {
    const response = await httpCommon.get(
      `/get_ast_sys_list_hirech.php?site_cd=${site_ID}&ast_typ=${selectedType}&ast_code=${selectedCode}&grp_code=${loc}&page=${
        page ? page : "1"
      }`
    );

    if (response.data.status === "SUCCESS") {
      setAssetDetails(response.data.data);
      setLimit(response.data.limit);
      setTotal(response.data.total);
    } else {
      setAssetDetails([]);
    }
  };

  // optimizing throtelling

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
      fetchAsset(selectedGrpCode);
      fetchImages();
    }
  }, 500);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // optimizing throtelling end

  return (
    <div>
      {/* level 1 folder*/}
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          <m.div
            variants={fadeAnimation}
       
            className={`levelstyle level1 ${activeField === "1"?"selectedField":""}`}
            style={{
              padding: "2px 14px",
              width: " max-content",
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
                style={{ color: activeField === "1" ? "gray" : "black" }}
              />
            ) : (
              <Icon
                icon="mingcute:right-fill"
                width="1.2rem"
                height="1.2rem"
                style={{ color: activeField === "1" ? "gray" : "black" }}
              />
            )}
            {/* arrow top down end */}

            {/* title and icon */}
            <Icon icon="flat-color-icons:folder" width="30px" height="30px" />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize:"14px"
              }}
            >
              Asset Hirechy By System
            </Typography>
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
            >
              {assetType.map((item,index) => (
                <m.div
                  className="parent"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{ duration: 0.7 }}
                >
                  <div
                    className={`levelstyle ${activeField === "2" && selectedType === item.ast_mst_asset_no ?"selectedField":""}`}
                    style={{
                      padding: "2px 14px",
                     

                      width: "250px",
                      borderRadius: "8px",
                     
                    }}
                    onClick={() => {
                      fetchAssetCode(item.ast_mst_asset_no);
                      setAssetTypeOpen((prev) => {
                        const newFolder = { ...prev };
                        // Set all indexed properties to false except specified levels
                        for (let key in newFolder) {
                          if (!["level1", "level2", "level3", "level4"].includes(key)) {
                            newFolder[key] = false;
                          }
                        }
                        // Toggle the clicked index
                        newFolder[index] = !prev[index];
                        return newFolder;
                      });
                      setSelectedType(item.ast_mst_asset_no);
                      setActiveField("2");
                    }}
                  >
                    {/* arrow top down */}
                    {assetTypeOpen[index] && selectedType === item.ast_mst_asset_no ? (
                      <Icon
                        icon="mingcute:down-fill"
                        width="1.2rem"
                        height="1.2rem"
                        style={{
                          color:
                            activeField === "2" &&
                            selectedType === item.ast_mst_asset_no
                              ? "gray"
                              : "black",
                        }}
                      />
                    ) : (
                      <Icon
                        icon="mingcute:right-fill"
                        width="1.2rem"
                        height="1.2rem"
                        style={{
                          color:
                            activeField === "2" &&
                            selectedType === item.ast_mst_asset_no
                              ? "gray"
                              : "black",
                        }}
                      />
                    )}
                    {/* arrow top down end */}

                    {/* image and description */}
                    <Icon
                      icon="tabler:asset"
                      width="1.3rem"
                      height="1.3rem"
                      style={{
                        color:
                          activeField === "2" &&
                          selectedType === item.ast_mst_asset_no
                            ? "gray"
                            : "black",
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize:"14px"
                      }}
                    >
                      {item.ast_mst_asset_no} : {item.ast_mst_asset_shortdesc}
                    </Typography>
                  </div>
                  {/* level2 end */}

                  {/* children Asset Code 3  Asset Code*/}
                  {assetTypeOpen[index] &&
                    selectedType === item.ast_mst_asset_no && (
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{ duration: 0.7 }}
                        className="level3"
                        style={{
                          marginLeft: "15px",
                          paddingLeft: "30px",
                          margin: "4px",
                        }}
                      >
                        {assetCode.map((item,index) => (
                          <m.div
                            className="parent"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                            }}
                            transition={{ duration: 0.7 }}
                          >
                            <div
                             className={`levelstyle ${activeField === "3" &&
                              selectedCode === item.ast_mst_asset_no ?"selectedField":""}`}
                              onClick={() => {
                                fetchGroupCode(item.ast_mst_asset_no);
                                setAssetCodeOpen((prev) => {
                                  const newFolder = { ...prev };
                                  // Set all indexed properties to false except specified levels
                                  for (let key in newFolder) {
                                    if (!["level1", "level2", "level3", "level4"].includes(key)) {
                                      newFolder[key] = false;
                                    }
                                  }
                                  // Toggle the clicked index
                                  newFolder[index] = !prev[index];
                                  return newFolder;
                                });
                                setSelectedCode(item.ast_mst_asset_no);
                                setActiveField("3");
                              }}
                              // styles
                              style={{
                                padding: "2px 14px",
                                

                                // width: "300px",
                                borderRadius: "8px",
                               
                              }}
                            >
                              {/* arrow top down  */}
                              {assetCodeOpen[index] &&
                              selectedCode === item.ast_mst_asset_no ? (
                                <Icon
                                  icon="mingcute:down-fill"
                                  width="1.2rem"
                                  height="1.2rem"
                                  style={{
                                    color:
                                      activeField === "3" &&
                                      selectedCode === item.ast_mst_asset_no
                                        ? "gray"
                                        : "black",
                                  }}
                                />
                              ) : (
                                <Icon
                                  icon="mingcute:right-fill"
                                  width="1.2rem"
                                  height="1.2rem"
                                  style={{
                                    color:
                                      activeField === "3" &&
                                      selectedCode === item.ast_mst_asset_no
                                        ? "gray"
                                        : "black",
                                  }}
                                />
                              )}
                              {/* arrow top down end*/}

                              <Icon
                                icon="fa6-regular:file-code"
                                width="1.2rem"
                                height="1.2rem"
                                style={{ color: "#EC5434" }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  fontSize:"14px"
                                }}
                              >
                                {item.ast_mst_asset_no} :
                                {item.ast_mst_asset_shortdesc}
                              </Typography>
                            </div>

                            {/* Level Children grp code */}
                            {assetCodeOpen[index] &&
                              selectedCode === item.ast_mst_asset_no && (
                                <m.div
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                  }}
                                  transition={{ duration: 0.7 }}
                                  className="level4"
                                  style={{
                                    marginLeft: "15px",
                                    paddingLeft: "20px",
                                    margin: "4px",
                                  }}
                                >
                                  {grpCode.map((item) => (
                                    <div className="parent">
                                      <div
                                       className={`levelstyle ${activeField === "4" &&
                                        selectedGrpCode === item.ast_mst_asset_no ?"selectedField":""}`}
                                        style={{
                                          padding: "2px 14px",
                
                                          width: " max-content",
                                          borderRadius: "8px",
                                        
                                        }}
                                        onClick={() => {
                                          fetchAsset(item.ast_mst_asset_no);
                                          setGrpCodeOpen((prev) => {
                                            const newFolder = { ...prev };
                                            // Set all indexed properties to false except specified levels
                                            for (let key in newFolder) {
                                              if (!["level1", "level2", "level3", "level4"].includes(key)) {
                                                newFolder[key] = false;
                                              }
                                            }
                                            // Toggle the clicked index
                                            newFolder[index] = !prev[index];
                                            return newFolder;
                                          });
                                          setselectedGrpCode(
                                            item.ast_mst_asset_no
                                          );
                                          setActiveField("4");
                                        }}
                                      >
                                        {/* arrow top down  */}
                                        {grpCodeOpen[index] && activeField === "4" &&
                                          selectedGrpCode ===
                                            item.ast_mst_asset_no ? (
                                          <Icon
                                            icon="mingcute:down-fill"
                                            width="1.2rem"
                                            height="1.2rem"
                                            style={{
                                              color:
                                                activeField === "4" &&
                                                selectedGrpCode ===
                                                  item.ast_mst_asset_no
                                                  ? "gray"
                                                  : "black",
                                            }}
                                          />
                                        ) : (
                                          <Icon
                                            icon="mingcute:right-fill"
                                            width="1.2rem"
                                            height="1.2rem"
                                            style={{
                                              color:
                                                activeField === "4" &&
                                                selectedGrpCode ===
                                                  item.ast_mst_asset_no
                                                  ? "gray"
                                                  : "black",
                                            }}
                                          />
                                        )}
                                        {/* arrow top down end*/}

                                        <Icon
                                          icon="formkit:group"
                                          width="1.2rem"
                                          height="1.2rem"
                                          color={ activeField === "4" &&
                                          selectedGrpCode ===
                                            item.ast_mst_asset_no
                                            ? "gray"
                                            : "black"}
                                          
                                        />
                                        <Typography
                                          sx={{
                                            fontWeight: 500,
                                           fontSize:"14px"
                                          }}
                                        >
                                          {item.ast_mst_asset_no} :{" "}
                                          {item.ast_mst_asset_shortdesc}
                                        </Typography>
                                      </div>

                                      {/* Asset Code Children GrpCode */}
                                      {grpCodeOpen[index] &&
                                        selectedGrpCode ===
                                          item.ast_mst_asset_no && (
                                          <m.div
                                            initial={{ opacity: 0 }}
                                            animate={{
                                              opacity: 1,
                                            }}
                                            className="level4  margin-left"
                                            style={{
                                              marginLeft: "15px",
                                              paddingLeft: "20px",
                                              margin: "4px",
                                            }}
                                          >
                                            <AssetItems
                                              data={assetDetails}
                                              allImages={allImages}
                                            />
                                          </m.div>
                                        )}
                                    </div>
                                  ))}
                                </m.div>
                              )}

                            {/* level  Children Location End */}
                          </m.div>
                        ))}
                      </m.div>
                    )}
                </m.div>
              ))}
            </m.div>
          )}

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
        </AnimatePresence>
      </LazyMotion>
      {/* leve2 end */}
    </div>
  );
}

export default AssetSystem;
