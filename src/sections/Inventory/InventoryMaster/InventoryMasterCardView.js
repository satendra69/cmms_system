import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

import httpCommon from "src/http-common";
import PropTypes from "prop-types";
import { CardActionArea, CardActions } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Iconify from "src/components/iconify/iconify";
import { ThreeCircles } from "react-loader-spinner";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import img from "../../../assets/img/Add_Image_icon.png";
const InventoryMasterCardView = () => {
  const site_ID = localStorage.getItem("site_ID");
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  // const history = useHistory();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await httpCommon.get(
          `/get_InventoryMasterCardViewTableData.php?site_cd=${site_ID}&page=${currentPage}`
        );
        console.log("response______",response);
        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEvents();
  }, [site_ID, currentPage]);

  const handleEventClick = (events2) => {
    if (events2 && events2.rowId) {
      navigate(`/dashboard/work/neworder?rowID=${events2.rowId}`);
    }
  };
  const itemsPerPage = 100;
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    console.log("newPage____",newPage);
   // setPage(newPage);
    setCurrentPage(newPage);
  };

  const numPages = Math.ceil('5000' / itemsPerPage);
  const handleEditRow = useCallback(
    (id) => {
      const Rowid = id;
      
      if (Rowid !== "") {
        navigate(`/dashboard/InventoryMaster/inventoryform`, {
          state: {
            RowID: Rowid,
          },
        });
      }
    },
    []
  );
  const renderItems = () => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageItems = tableData.slice(startIdx, endIdx);

    return pageItems.map((item, index) => (
      <Grid item xs={12} md={3} key={`${startIdx}_${index}`}>
      
        <Card sx={{ mt: 1, mb: 1 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={
                item.attachment
                  ? item.attachment
                  : img
              }
              style={{
                display: "block",
                margin: "auto",
                width: !item.attachment ? "auto" : "100%",
              }}
              onClick={() =>
                handleEditRow(item.RowID)
              }
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                style={{ display: "flex", justifyContent: "space-between" }}
                onClick={() =>
                  handleEditRow(item.RowID)
                }
              >
                <span>{item.itm_mst_stockno}</span>
                <span>{item.itm_det_part_deac_status}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Iconify icon="tabler:file-description" width="277" />{" "}
                {item.itm_mst_desc.length > 30
                  ? `${item.itm_mst_desc.slice(0, 30)}...`
                  : item.itm_mst_desc}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Iconify
                  icon="material-symbols:edit-location-sharp"
                  width="277"
                />{" "}
                {item.itm_mst_mstr_locn !== "" &&
                item.itm_mst_mstr_locn !== "null"
                  ? item.itm_mst_mstr_locn
                  : ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Iconify icon="carbon:map-center" width="277" />{" "}
                {item.itm_mst_costcenter.length > 35
                  ? `${item.itm_mst_costcenter.slice(0, 35)}...`
                  : item.itm_mst_costcenter}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Iconify icon="akar-icons:price-cut" width="277" />{" "}
                {item.itm_mst_ttl_oh.length > 35
                  ? `${item.itm_mst_ttl_oh.slice(0, 35)}...`
                  : item.itm_mst_ttl_oh}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ));
  };

  return (
    <>
      {isLoading ? (
        <Dialog
          open={isLoading}
          aria-labelledby="loading-dialog-title"
          PaperProps={{
            style: {
              backgroundColor: "transparent", // Set your desired background color here
            },
          }}
          BackdropProps={{
            className: "yourbackdropclass",
          }}
        >
          <DialogTitle
            id="loading-dialog-title"
            style={{ textAlign: "center" }}
          ></DialogTitle>
          <DialogContent>
            <div style={{ textAlign: "center", paddingTop: "10px" }}>
              <ThreeCircles
                radius="9"
                visible={true}
                ariaLabel="three-circles-loading"
                color="green"
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          <Grid container spacing={2} className="MasterCardView">
            {renderItems()}
          </Grid>
          <Pagination
            count={numPages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              padding: 10,
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      )}

      {/* </div> */}
    </>
  );
};
InventoryMasterCardView.propTypes = {
  data: PropTypes.shape({
    site_cd: PropTypes.string.isRequired,
  }).isRequired,
};
export default InventoryMasterCardView;
