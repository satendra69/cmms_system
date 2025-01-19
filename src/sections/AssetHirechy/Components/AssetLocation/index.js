import { Icon } from "@iconify/react";
import { Typography } from "@mui/material";
import httpCommon from "src/http-common";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AssetItems from "./AssetItems";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import spinner from "../spinner.gif";
function AssetLocation() {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");

  const [folder, setFolder] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
  });
  const [plantOpen, setPlantOpen] = useState({});
  const [levelOpen, setLevelOpen] = useState({});
  const [commonAreaOpen, setCommonAreaOpen] = useState({});

  // active field
  const [activeField, setActiveField] = useState("");
  const [showParentIcons, setShowParentIcons] = useState("");

  // data
  const [level, setLevel] = useState([]);
  const [location, setLocation] = useState([]);
  const [allImages, setImages] = useState([]);
  const [workArea, setWorkArea] = useState([]);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [assetDetails, setAssetDetails] = useState([]);

  // params
  const [selectedWkr, setSelectedWkr] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCommonArea, setselectedCommonArea] = useState("");

  const [page, setPage] = useState(1);

  // animation
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, transition: { duration: 0.7 } },
  };

  // useEffect
  useEffect(() => {
    const fetchPlants = async () => {
      const response = await httpCommon.get(
        `/get_asset_hirechy_plant.php?site_cd=${site_ID}`
      );
      console.log("responsePlant", response);
      const plant = response.data.data;
      if (plant) {
        const formattedData = plant.map((item) => ({
          astno: item.ast_mst_asset_no,
          astDesc: item.ast_mst_asset_shortdesc,
        }));
        setWorkArea(formattedData);
      }
    };

    fetchPlants();
  }, []);

  // get assetLevel
  const fetchLevel = async (wkr) => {
    const response = await httpCommon.get(
      `/get_ast_lvl.php?site_cd=${site_ID}&wrk=${wkr}`
    );
    if (response.data.status === "SUCCESS") {
      setLevel(response.data.data);
    } else {
      setLevel([]);
    }
  };
  console.log("index", folder);

  // fetch Asset Location
  const fetchLocation = async (lvl) => {
    const response = await httpCommon.get(
      `/get_ast_loc.php?site_cd=${site_ID}&wrk=${selectedWkr}&lvl=${lvl}`
    );

    if (response.data.status === "SUCCESS") {
      setLocation(response.data.data);
    } else {
      setLocation([]);
    }
  };

  // get AllImages
  const fetchImages = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchImages();
  }, []);
  // get AllImages End

  const fetchAsset = async (loc) => {
    setLoading(true);
    try {
      const response = await httpCommon.get(
        `/get_ast_loc_hirechy.php?site_cd=${site_ID}&wrk=${selectedWkr}&lvl=${selectedLevel}&common_area=${loc}&page=${
          page ? page : "1"
        }`
      );
      console.log("response_new", response);
      setLimit(response.data.limit);
      setTotal(response.data.total);

      if (response.data.status === "SUCCESS") {
        setAssetDetails(response.data.data);
      } else {
        setAssetDetails([]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const myThrottle = (cb, d) => {
    let last = 0;
    return function (...args) {
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
      fetchAsset(selectedCommonArea);
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
            className={`levelstyle level1 p14 ${
              activeField === "1" ? "selectedField" : ""
            }`}
            style={{
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
            <Typography sx={{ fontWeight: 600,fontSize:"14px" }}>
              Asset Hirechy By Location
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
              style={{}}
            >
              {workArea.map((item, index) => (
                <m.div
                  className="parent"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{ duration: 0.7 }}
                >
                  <div
                    className={`levelstyle ${
                      activeField === "2" && selectedWkr === item.astno
                        ? "selectedField"
                        : ""
                    }`}
                    style={{
                      
                      width: "max-content",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      fetchLevel(item.astno);
                      setPlantOpen((prev) => {
                        const newFolder = { ...prev };
                        // Set all indexed properties to false except specified levels
                        for (let key in newFolder) {
                          if (
                            !["level1", "level2", "level3", "level4"].includes(
                              key
                            )
                          ) {
                            newFolder[key] = false;
                          }
                        }
                        // Toggle the clicked index
                        newFolder[index] = !prev[index];
                        return newFolder;
                      });
                      setSelectedWkr(item.astno);
                      setActiveField("2");
                    }}
                  >
                    {/* arrow top down */}
                    {plantOpen[index] && selectedWkr === item.astno ? (
                      <Icon
                        icon="mingcute:down-fill"
                        width="1.2rem"
                        height="1.2rem"
                        style={{
                          color:
                            activeField === "2" && selectedWkr === item.astno
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
                            activeField === "2" && selectedWkr === item.astno
                              ? "gray"
                              : "black",
                        }}
                      />
                    )}
                    {/* arrow top down end */}

                    {/* image and description */}
                    <Icon
                      icon="marketeq:maps-location"
                      width="1.3rem"
                      height="1.3rem"
                    />
                    <Typography sx={{ fontWeight: 500,fontSize:"14px" }}>
                      {item.astno} : {item.astDesc}
                    </Typography>
                  </div>
                  {/* level2 end */}

                  {/* children level 3  Level*/}
                  {plantOpen &&
                    plantOpen[index] &&
                    selectedWkr === item.astno && (
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{ duration: 0.7 }}
                        className="level2"
                        style={{
                          marginLeft: "15px",
                          paddingLeft: "30px",
                          margin: "4px",
                        }}
                      >
                        {level.map((item, index) => (
                          <m.div
                            className="parent"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                            }}
                            transition={{ duration: 0.7 }}
                          >
                            <div
                              className={`levelstyle ${
                                activeField === "3" &&
                                selectedLevel === item.ast_mst_asset_no
                                  ? "selectedField"
                                  : ""
                              }`}
                              onClick={() => {
                                fetchLocation(item.ast_mst_asset_no);
                                setLevelOpen((prev) => {
                                  const newFolder = { ...prev };
                                  // Set all indexed properties to false except specified levels
                                  for (let key in newFolder) {
                                    if (
                                      ![
                                        "level1",
                                        "level2",
                                        "level3",
                                        "level4",
                                      ].includes(key)
                                    ) {
                                      newFolder[key] = false;
                                    }
                                  }
                                  // Toggle the clicked index
                                  newFolder[index] = !prev[index];
                                  return newFolder;
                                });
                                setSelectedLevel(item.ast_mst_asset_no);
                                setActiveField("3");
                              }}
                              // styles
                              style={{
                                padding: "2px 14px",
                                borderRadius: "8px",
                              }}
                            >
                              {/* arrow top down  */}
                              {levelOpen[index] &&
                              selectedLevel === item.ast_mst_asset_no ? (
                                <Icon
                                  icon="mingcute:down-fill"
                                  width="1.2rem"
                                  height="1.2rem"
                                  style={{ color: "gray" }}
                                />
                              ) : (
                                <Icon
                                  icon="mingcute:right-fill"
                                  width="1.2rem"
                                  height="1.2rem"
                                  style={{ color: "gray" }}
                                />
                              )}
                              {/* arrow top down end*/}

                              <Icon
                                icon="carbon:skill-level-basic"
                                width="1.2rem"
                                height="1.2rem"
                                style={{ color: "#EC5434" }}
                              />
                              <Typography sx={{ fontWeight: 500,fontSize:"14px" }}>
                                {item.ast_mst_asset_no} :{" "}
                                {item.ast_mst_asset_shortdesc}
                              </Typography>
                            </div>

                            {/* Level Children Location */}
                            {folder &&
                              levelOpen[index] &&
                              selectedLevel === item.ast_mst_asset_no && (
                                <m.div
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                  }}
                                  transition={{ duration: 0.7 }}
                                  className="ca"
                                  style={
                                    {
                                      // marginLeft: "15px",
                                      // paddingLeft: "20px",
                                      // margin: "4px",
                                    }
                                  }
                                >
                                  {location.map((item, index) => (
                                    <div className="parent">
                                      <div
                                        className={`levelstyle ${
                                          activeField === "4" &&
                                          selectedCommonArea ===
                                            item.ast_mst_asset_no
                                            ? "selectedField"
                                            : ""
                                        }`}
                                        style={{
                                          padding: "2px 14px",

                                          width: " max-content",
                                          borderRadius: "8px",
                                        }}
                                        onClick={() => {
                                          fetchAsset(item.ast_mst_asset_no);
                                          setCommonAreaOpen((prev) => {
                                            const newFolder = { ...prev };
                                            // Set all indexed properties to false except specified levels
                                            for (let key in newFolder) {
                                              if (
                                                ![
                                                  "level1",
                                                  "level2",
                                                  "level3",
                                                  "level4",
                                                ].includes(key)
                                              ) {
                                                newFolder[key] = false;
                                              }
                                            }
                                            // Toggle the clicked index
                                            newFolder[index] = !prev[index];
                                            return newFolder;
                                          });
                                          setselectedCommonArea(
                                            item.ast_mst_asset_no
                                          );
                                          setActiveField("4");
                                        }}
                                      >
                                        {/* arrow top down  */}
                                        {commonAreaOpen[index] &&
                                        selectedCommonArea ===
                                          item.ast_mst_asset_no ? (
                                          <Icon
                                            icon="mingcute:down-fill"
                                            width="1.2rem"
                                            height="1.2rem"
                                            style={{ color: "gray" }}
                                          />
                                        ) : (
                                          <Icon
                                            icon="mingcute:right-fill"
                                            width="1.2rem"
                                            height="1.2rem"
                                            style={{ color: "gray" }}
                                          />
                                        )}
                                        {/* arrow top down end*/}

                                        <Icon
                                          icon="ion:location-outline"
                                          width="1.2rem"
                                          height="1.2rem"
                                          color={
                                            activeField === "4" &&
                                            selectedCommonArea ===
                                              item.ast_mst_asset_no
                                              ? "gray"
                                              : "black"
                                          }
                                        />
                                        <Typography
                                          sx={{
                                            fontWeight: 500,
                                            fontSize: "14px",
                                          }}
                                          className="text14_pr2"
                                        >
                                          {item.ast_mst_asset_no} :{" "}
                                          {item.ast_mst_asset_shortdesc}
                                        </Typography>
                                      </div>

                                      {/* Location Children Asset Details */}
                                      {commonAreaOpen &&
                                        commonAreaOpen[index] &&
                                        selectedCommonArea ===
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

export default AssetLocation;
