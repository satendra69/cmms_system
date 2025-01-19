import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import httpCommon from "src/http-common";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Moment from "moment";
import Inventory_location from "../component_module/Location/Inventory_location"
import Inventory_Supplier from "../component_module/Supplier/Inventory_Supplier"

// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Checkbox ,Radio} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

import heic2any from "heic2any"; 

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {  DatePicker as AntDatePicker } from 'antd';
import dayjs from 'dayjs';

import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

//Tab
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import InventoryMasterLocation from "../Table/InventoryMasterLocationListForm";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";


// routes
import { RouterLink } from "src/routes/components";
import { faL } from "@fortawesome/free-solid-svg-icons";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": { padding: theme.spacing(2) }, 
    "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export default function InventoryForm(){

    let site_ID = localStorage.getItem("site_ID");

    const [loading, setLoading] = useState(true);

    const settings = useSettingsContext();
    const location = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const autocompleteRef = useRef(null);
    const MasterLocationCodeRef = useRef(null);

    const state = location.state || {};
    const { RowID, itm_mst_stockno, DuplicatRowID, DupRowID, DupAst_no, currentPage, selectedOption, selectDropRowID ,TabBtnName } = state || {};
    const [isFormFiled, setIsFormFiled] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");
    const [progress, setProgress] = useState(0);

   
    const [itmMstLabel, setItmMstLabel] = useState([]);

    const [InventoryNo, setInventoryNo] = useState("");
    const [Button_save, setButton_save] = useState("");
    

    //Tab
    const [Tabvalue, setTabValue] = useState(0);
    const [isOpenWork, setIsOpenWork] = useState(true);
    const [isOpenWork2, setIsOpenWork2] = useState(true);
    const [isOpenWork3, setIsOpenWork3] = useState(true);

    //DropDown 
    const [type, setType] = useState([
        { label: "Stock", value: "P" },
        { label: "Tool", value: "T" },
        { label: "Serialize", value: "S" },
        { label: "Serialize With Asset", value: "Z" },
    ]);
 
    const [commodity, setCommodity] = useState([]);
    const [stockGroup, setStockGroup] = useState([]);
    const [orderRule, setOrderRule] = useState([]);
    const [costCenter, setCostCenter] = useState([]);
    const [account, setAccount] = useState([]);
    const [partDeacStatus, setpartDeacStatus] = useState([]);
    const [issueUom, setIssueUom] = useState([]);
    const [recivedUom, setRecivedUom] = useState([]);
    const [storageType, setStorageType] = useState([]);
    const [stockNo, setStockNo] = useState([]);
    const [accountType, setAccountType] = useState([
        { label: "INVENTORY", value: "I" },
        { label: "EXPENSE", value: "E" },
    ]);

    //Stock Master Part 01
    const [selected_Type, setSelected_Type] = useState([]);
    const [stockNoText, setStockNoText] = useState("");
    const [MasterLocationCode, setMasterLocationCode] = useState("");
    const [selected_orderRule, setSelected_orderRule] = useState();
    const [Short_Description, setShort_Description] = useState("");
    const [selected_costCenter, setSelected_costCenter] = useState("");
    const [selected_account, setSelected_account] = useState("");
    const [selected_issueUom, setSelected_IssueUom] = useState("");
    const [selected_recivedUom, setSelected_RecivedUom] = useState("");
    const [selected_partDeacStatus, setSelected_partDeacStatus] = useState("");

    //Stock MasterPart 02
    const [selected_Commodity, setSelected_Commodity] = useState("");
    const [selected_stockGroup, setSelected_stockGroup] = useState("");
    const [orderPoint, setOrderPoint] = useState("");
    const [maximumInvtr, setMaximumInvtr] = useState("");
    const [PartNo, setPartNo] = useState("");
    const [selected_storageType, setSelected_StorageType] = useState("");
    const [Long_Description, setLong_Description] = useState("");
    const [Cube, setCube] = useState("");
    const [shelfLife, setshelfLife] = useState("");


    //Stock MasterPart 03
    const [TotalOnHand, setTotalOnHand] = useState("0.00");
    const [Reserved,setReserved] = useState("0.00");
    const [Shortage,setShortage] = useState("0.00");
    const [Qty_Available,setQty_Available] = useState("0.00");
    const [PR_Outstanding,setPR_Outstanding] = useState("0.00");
    const [PO_Outstanding,setPO_Outstanding] = useState("0.00");
    const [Reoreder_SubTotal,setReoreder_SubTotal] = useState("0.00");

    //IMAGE
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImages2, setSelectedImages2] = useState([]);
    const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
    const [RefImg, setRefImg] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [getDbImgRowId, setDbImgRowId] = useState("");
    const [SpecialOdrResult, setSpecialOdrResult] = useState([]);

    const [getDbImg, setDbImg] = useState();
    const [image, setImage] = useState({ preview: "", raw: "" });

    const [imguploadStatus, setImguploadStatus] = useState("");
    const [imguploadRefStatus, setImguploadRefStatus] = useState("");

    const [removedRefItems, setRemovedRefItems] = useState([]);
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [imageSelect, setImageSelect] = useState({ name: "", path: "" });


    const [showdd, setShowdd] = useState(false);
    const [handalImg, sethandalImg] = useState({});
    const handleClosedd = () => setShowdd(false);
    const [showdd2, setShowdd2] = useState(false);
    const handleClosedd2 = () => setShowdd2(false);



    // Stock Master Part 01 Error State 
    const [InventoryMandatoryFiled, setInventoryMandatoryFiled] = useState([]);
    const [errorField, setErrorField] = useState(null);

    const [isTypeEmpty, setIsTypeEmpty] = useState(false);  
    const [isMasterLocationEmpty, setIsMasterLocationEmpty] = useState(false);
    const [isStockNo,setIsStockNo] = useState(false);
    const [isOrderRuleEmpty, setIsOrderRuleEmpty] = useState(false);
    const [isDescEmpty,setIsDescEmpty] = useState(false);
    const [isCostCenterEmpty,setIsCostCenterEmpty] = useState(false);
    const [isAccountEmpty,setIsAccountEmpty] = useState(false);
    const [isPartDeacEmpty,setIsPartDeacEmpty] = useState(false);
    const [isIssueUomEmpty,setIsIssueUomEmpty] = useState(false);
    const [isReciveUomEmpty,setIsReciveUomEmpty] = useState(false);

    //Stock Master Part 02 Error State 
    const [isCommodityCodeEmpty,setIsCommodityCodeEmpty] = useState(false);
    const [isStockGroupEmpty, setIsStockGroupEmpty] = useState(false);
    const [isStorageTypeEmpty, setIsisStorageTypeEmpty] = useState(false);
    const [isTaxCodeEmpty, setIsTaxCodeEmpty] = useState(false);
    const [isAccountTypeEmpty, setIsAccountTypeEmpty] = useState(false);


    //Financial Part 01
    const[CostingRule, setCostingRule] = useState([
        { id: 1, code:'AVG',  costingRule: 'Average', total_a: '', total_b: 0, total_c: 0, total: 0, itemCost: 0, issuePrice: 0 },
        { id: 2, code:'STD',  costingRule: 'Standard', total_a: '', total_b: 0, total_c: 0, total: 0, itemCost: 0, issuePrice: 0 },
        { id: 3, code:'LST',  costingRule: 'Last', total_a: '', total_b: 0, total_c: 0, total: 0, itemCost: 0, issuePrice: 0 },
        { id: 4, code:'FIFO', costingRule: 'FIFO', total_a: '', total_b: 0, total_c: 0, total: 0, itemCost: 0, issuePrice: 0 },
    ]);

 
    const [selectedRowd, setSelectedRowd] = useState(null);
    const [costingValue, setcostingValue] = useState("");



    //Financial Part 02
    const [autoSpare, setAutoSpare] = useState(false);
    const [criticalSpare, setcriticalSpare] = useState(false);
    const [HazardousMaterial, setHazardousMaterial] = useState(false);
    const [taxCode, setTaxCode] = useState("");
    const [selected_AccountType, setSelected_AccountType] = useState([]);
    const [abcClass, setAbcClass] = useState("");
    const [ytdUsage, setYtdUsage] = useState("0.0000");
    const [ytdTurns, setYtdTurns] = useState("0.0000");
    const [ytdStockouts, setYtdStockouts] = useState("0.0000");
    const [lastyrUsage, setLastyrUsage] = useState("0.0000");
    const [lastyrTurns, setLastyrTurns] = useState("0.0000");
    const [lastyrStkouts, setLastyrStkouts] = useState("0.0000");

    //Financial Part 03
    const [UDFText_1, setUDFText_1] = useState("");
    const [UDFText_2, setUDFText_2] = useState("");
    const [UDFText_3, setUDFText_3] = useState("");
    const [UDFText_4, setUDFText_4] = useState("");
    const [UDFText_5, setUDFText_5] = useState("");
    const [UDFText_6, setUDFText_6] = useState("");
    const [UDFText_7, setUDFText_7] = useState("");
    const [UDFText_8, setUDFText_8] = useState("");
    const [UDFText_9, setUDFText_9] = useState("");
    const [UDFText_10, setUDFText_10] = useState("");
    const [UDFNote_1, setUDFNote_1] = useState("");

    //Financial Part 03
    const [UDFNumeric_1, setUDFNumeric_1] = useState("");
    const [UDFNumeric_2, setUDFNumeric_2] = useState("");
    const [UDFNumeric_3, setUDFNumeric_3] = useState("");
    const [UDFNumeric_4, setUDFNumeric_4] = useState("");
    const [UDFNumeric_5, setUDFNumeric_5] = useState("");

    const [UDFDateTime_1, setUDFDateTime_1] = useState("");
    const [UDFDateTime_2, setUDFDateTime_2] = useState("");
    const [UDFDateTime_3, setUDFDateTime_3] = useState("");
    const [UDFDateTime_4, setUDFDateTime_4] = useState("");
    const [UDFDateTime_5, setUDFDateTime_5] = useState("");

    const [anchorEl, setAnchorEl] = useState(null);

    //Model
    const [open_MasterLocation, setopen_MasterLocation] = useState(false);
    const [Total_loc_mst, setTotal_loc_mst] = useState(0);
    const [TotalSearch, setTotalSearch] = useState("");
    const [viewedTotlRows, setViewedTotlRows] = useState(0);
    
    useEffect(() => {
        async function fetchData() {

            if (typeof RowID !== "undefined" && RowID !== null && RowID !== "") {
                setButton_save("Update");
                await get_inventory_master_form_data();
                await getInventoryFromLebel();
                await fetchStatusData();
                await getInventoryMandatoryfiled();

            } else if ( typeof DuplicatRowID !== "undefined" && DuplicatRowID !== null && DuplicatRowID !== "" ){
                setButton_save("Duplicate");
                await get_inventory_master_form_data();
                await getInventoryFromLebel();
                await fetchStatusData();
                await getInventoryMandatoryfiled();

            }else{

                await getInventoryFromLebel();
                await fetchStatusData();
                await getInventoryMandatoryfiled();
                setButton_save("Save");
            }
            setLoading(false);

        }
        fetchData();
    },[])

    // Get All Filed label Name
    const getInventoryFromLebel = async () => {

        try {
            const response = await httpCommon.get("/get_inventory_master_cf_lebal.php");
            //console.log("response____getLabel",response);
            if (response.data.status === "SUCCESS") {
                setItmMstLabel(response.data.data.itm_mst);
               
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Second Api call fetch all dropdowwn data
    const fetchStatusData = async () => {
        try {
            const response = await httpCommon.get( "/get_inventory_master_dropdown.php?site_cd=" + site_ID );
            //console.log("response____status__111", response);
            let Commodity = response.data.data.CommodityCode.map((item) => ({
                label: item.com_mst_com_code + " : " + item.com_mst_desc,
                value: item.com_mst_desc,
                key: item.com_mst_com_code,
            }));

            setCommodity(Commodity);

            let StockGroup = response.data.data.StockGroup.map((item) => ({
                label: item.itm_grp_cd + " : " + item.itm_grp_desc,
                value: item.itm_grp_desc,
            }));
            setStockGroup(StockGroup);

            let Order_Rule = response.data.data.OrderRule.map((item) => ({
                label: item.odr_mst_odr + " : " + item.odr_mst_desc,
                value: item.odr_mst_desc,
            }));
            setOrderRule(Order_Rule);

            let Charge_Cost_Center = response.data.data.CostCenter.map((item) => ({
                label: item.costcenter + " : " + item.descs,
                value: item.descs,
            }));
            setCostCenter(Charge_Cost_Center);

            let Accoun_t = response.data.data.Account.map((item) => ({
                label: item.account + " : " + item.descs,
                value: item.descs,
            }));
            setAccount(Accoun_t);

            let partDeacStatus = response.data.data.PartDeac.map((item) => ({
                label: item.itm_sts_status + " : " + item.itm_sts_desc,
                value: item.itm_sts_desc,
            }));
            setpartDeacStatus(partDeacStatus);

            let IssueUom = response.data.data.IssueUoM.map((item) => ({
                label: item.uom_mst_uom + " : " + item.uom_mst_desc,
                value: item.uom_mst_desc,
            }));
            setIssueUom(IssueUom);

            let RecivedUom = response.data.data.IssueUoM.map((item) => ({
                label: item.uom_mst_uom + " : " + item.uom_mst_desc,
                value: item.uom_mst_desc,
            }));
            setRecivedUom(RecivedUom);

            let Storage_type = response.data.data.StorageType.map((item) => ({
                label: item.stt_mst_stt + " : " + item.stt_mst_desc,
                value: item.stt_mst_desc,
            }));
            setStorageType(Storage_type);

            let Storage_no = response.data.data.StockNO.map((item) => ({
                label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
                value: item.ast_grp_desc,
            }));
            setStockNo(Storage_no);

        /*   end */
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Get All Filed label Name
    const getInventoryMandatoryfiled = async () => {
        try {
            const response = await httpCommon.get("/get_inventory_mandatory_filed.php");
            if (response.data.data.MandatoryField.length > 0) {
                setInventoryMandatoryFiled(response.data.data.MandatoryField);
            }
        } catch (error) {
         console.error("Error fetching data:", error);
        }
    };

   

    // get inventory API data
    const get_inventory_master_form_data = async () => {
        var json = { site_cd: site_ID, 
            RowId: DuplicatRowID !== undefined && DuplicatRowID !== "" ? DupRowID : RowID, 
        };
        console.log("Form Data", JSON.stringify(json));
        try {
          const response = await httpCommon.post( "/get_inventory_edit_formdata.php", JSON.stringify(json) );
           console.log("Get_inventory Data", response);
          if (response.data.status === "SUCCESS") {

            for (let data of Object.values(response.data.data)) {

                console.log("Get_inventory Data",data.itm_mst_stockno);

                if (data.itm_mst_type === "P") {
                    setSelected_Type({ label: "Stock" });
                } else if (data.itm_mst_type === "T") {
                    setSelected_Type({ label: "Tool" });
                } else if (data.itm_mst_type === "S") {
                    setSelected_Type({ label: "Serialize" });
                } else if (data.itm_mst_type === "Z") {
                    setSelected_Type({ label: "Serialize With Asset" });
                }
                setStockNoText(data.itm_mst_stockno);
                setShort_Description(data.itm_mst_desc);
                setLong_Description(data.itm_mst_ext_desc);

                setMasterLocationCode(data.itm_mst_mstr_locn);
                setSelected_orderRule({label: data.itm_mst_order_rule});
                setSelected_costCenter({label: data.itm_mst_costcenter});
                setSelected_account({label: data.itm_mst_account});

                setSelected_partDeacStatus({label: data.itm_det_part_deac_status});
                setSelected_IssueUom({label: data.itm_det_issue_uom});
                setSelected_RecivedUom({label: data.itm_det_rcv_uom});

                
                setSelected_Commodity({label: data.itm_mst_com_code});
                setSelected_stockGroup({label: data.itm_mst_itm_grp});
                setPartNo(data.itm_mst_partno);
                setOrderPoint(data.itm_det_order_pt);
                setMaximumInvtr(data.itm_det_maximum);
                setSelected_StorageType({label: data.itm_det_storage_type});
                setCube(data.itm_det_cube);
                setshelfLife(data.itm_det_shelf_life);

                let itm_det_ttl_oh = parseFloat(data.itm_det_ttl_oh).toFixed(2);
                let itm_det_ttl_hard_resrv = parseFloat(data.itm_det_ttl_hard_resrv).toFixed(2);
                let itm_det_ttl_short = parseFloat(data.itm_det_ttl_short).toFixed(2);
                let itm_qty_available = (parseFloat(itm_det_ttl_oh) - parseFloat(itm_det_ttl_hard_resrv)).toFixed(2);
                let itm_det_pr_due_in = parseFloat(data.itm_det_pr_due_in).toFixed(2);
                let itm_det_due_in = parseFloat(data.itm_det_due_in).toFixed(2);
                let itm_sub_total = (parseFloat(itm_qty_available) + parseFloat(itm_det_pr_due_in) + parseFloat(itm_det_due_in)).toFixed(2);
                
                setTotalOnHand(itm_det_ttl_oh);
                setReserved(itm_det_ttl_hard_resrv);
                setShortage(itm_det_ttl_short);
                setQty_Available(itm_qty_available);
                setPR_Outstanding(itm_det_pr_due_in);
                setPO_Outstanding(itm_det_due_in);
                setReoreder_SubTotal(itm_sub_total);

                let itm_det_cr_code = data.itm_det_cr_code;
                let itm_det_avg_cost = parseFloat(data.itm_det_avg_cost).toFixed(2);
                let itm_det_ttl_repair = parseFloat(data.itm_det_ttl_repair).toFixed(2);
                let itm_det_std_cost = parseFloat(data.itm_det_std_cost).toFixed(2);
                let itm_det_last_cost = parseFloat(data.itm_det_last_cost).toFixed(2);
                let itm_det_item_cost = parseFloat(data.itm_det_item_cost).toFixed(2);
                let itm_det_issue_price = parseFloat(data.itm_det_issue_price).toFixed(2);
                

                let h = parseFloat(itm_det_avg_cost)
                let r = parseFloat(itm_det_ttl_oh)
                let a = parseFloat(itm_det_ttl_repair)

                console.log("H : " + h)
                console.log("R : " + r)
                console.log("A : " + a)

                let f3 = (h * (r - a));

                console.log("f3 : " ,parseFloat(f3).toFixed(4))

                if(itm_det_cr_code === 'AVG'){

                    setSelectedRowd(1);
                    setcostingValue(itm_det_cr_code);

                   

                    const newData = CostingRule.map(item => {
                        if (item.id == 1) {

                          item.total_a = itm_det_avg_cost
                          item.total_b = itm_det_ttl_oh
                          item.total_c = itm_det_ttl_repair
                          item.total = f3
                          item.itemCost = itm_det_item_cost
                          item.issuePrice = itm_det_issue_price
                        
                          return item;
                        }
                        return item;
                      })
                      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
                      setCostingRule(newData)

                }else if(itm_det_cr_code === 'STD'){

                    setSelectedRowd(2);
                    setcostingValue(itm_det_cr_code);

                    const newData = CostingRule.map(item => {
                        if (item.id == 2) {

                          item.total_a = itm_det_avg_cost
                          item.total_b = itm_det_ttl_oh
                          item.total_c = itm_det_ttl_repair
                          item.total = f3
                          item.itemCost = itm_det_item_cost
                          item.issuePrice = itm_det_issue_price
                        
                          return item;
                        }
                        return item;
                      })
                      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
                      setCostingRule(newData)

                }else if(itm_det_cr_code === 'LST'){

                    setSelectedRowd(3);
                    setcostingValue(itm_det_cr_code);

                    const newData = CostingRule.map(item => {
                        if (item.id == 3) {

                          item.total_a = itm_det_avg_cost
                          item.total_b = itm_det_ttl_oh
                          item.total_c = itm_det_ttl_repair
                          item.total = f3
                          item.itemCost = itm_det_item_cost
                          item.issuePrice = itm_det_issue_price
                        
                          return item;
                        }
                        return item;
                      })
                      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
                      setCostingRule(newData)

                }else if(itm_det_cr_code === 'FIFO'){

                    setSelectedRowd(4);
                    setcostingValue(itm_det_cr_code);

                    const newData = CostingRule.map(item => {
                        if (item.id == 4) {

                          item.total_a = itm_det_avg_cost
                          item.total_b = itm_det_ttl_oh
                          item.total_c = itm_det_ttl_repair
                          item.total = f3
                          item.itemCost = itm_det_item_cost
                          item.issuePrice = itm_det_issue_price
                        
                          return item;
                        }
                        return item;
                      })
                      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
                      setCostingRule(newData)

                }
                
                

                

                if (data.itm_det_auto_spare == '0') {
                    setAutoSpare(false);
                }else{
                    setAutoSpare(true);
                }

                if (data.itm_det_critical_spare == '0') {
                    setcriticalSpare(false);
                }else{
                    setcriticalSpare(true);
                }

                if (data.itm_det_hzd_mtl == '0') {
                    setHazardousMaterial(false);
                }else{
                    setHazardousMaterial(true);
                }

                setAbcClass(data.itm_det_abc_class);
                setTaxCode(data.itm_det_tax_cd);

                if (data.itm_det_acct_type === "I") {
                    setSelected_AccountType({ label: "INVENTORY" });
                } else if (data.itm_det_acct_type === "E") {
                    setSelected_AccountType({ label: "EXPENSE" });
                }

                setYtdUsage(data.itm_det_ytd_usage);
                setYtdTurns(data.itm_det_ytd_turns);
                setYtdStockouts(data.itm_det_ytd_stockouts);

                setLastyrUsage(data.itm_det_lastyr_usage);
                setLastyrTurns(data.itm_det_lastyr_turns);
                setLastyrStkouts(data.itm_det_lastyr_stkouts);
                
                setUDFText_1(data.itm_det_varchar1);
                setUDFText_2(data.itm_det_varchar2);
                setUDFText_3(data.itm_det_varchar3);
                setUDFText_4(data.itm_det_varchar4);
                setUDFText_5(data.itm_det_varchar5);
                setUDFText_6(data.itm_det_varchar6);
                setUDFText_7(data.itm_det_varchar7);
                setUDFText_8(data.itm_det_varchar8);
                setUDFText_9(data.itm_det_varchar9);
                setUDFText_10(data.itm_det_varchar10);

                setUDFNote_1(data.itm_det_note1);

                setUDFNumeric_1(data.itm_det_numeric1);
                setUDFNumeric_2(data.itm_det_numeric2);
                setUDFNumeric_3(data.itm_det_numeric3);
                setUDFNumeric_4(data.itm_det_numeric4);
                setUDFNumeric_5(data.itm_det_numeric5);
               
                if (data.itm_det_datetime1 == null) {
                    setUDFDateTime_1("");
                } else {
                    const apiDate = data.itm_det_datetime1.date;
                    const formattedDate = Moment( apiDate, "YYYY-MM-DD HH:mm:ss.SSSSSS" ).toDate();
                    setUDFDateTime_1(formattedDate);
                }

                if (data.itm_det_datetime2 == null) {
                    setUDFDateTime_2("");
                } else {
                    const apiDate = data.itm_det_datetime2.date;
                    const formattedDate = Moment( apiDate, "YYYY-MM-DD HH:mm:ss.SSSSSS" ).toDate();
                    setUDFDateTime_2(formattedDate);
                }

                if (data.itm_det_datetime3 == null) {
                    setUDFDateTime_3("");
                } else {
                    const apiDate = data.itm_det_datetime3.date;
                    const formattedDate = Moment( apiDate, "YYYY-MM-DD HH:mm:ss.SSSSSS" ).toDate();
                    setUDFDateTime_3(formattedDate);
                }

                if (data.itm_det_datetime4 == null) {
                    setUDFDateTime_4("");
                } else {
                    const apiDate = data.itm_det_datetime4.date;
                    const formattedDate = Moment( apiDate, "YYYY-MM-DD HH:mm:ss.SSSSSS" ).toDate();
                    setUDFDateTime_4(formattedDate);
                }

                if (data.itm_det_datetime5 == null) {
                    setUDFDateTime_5("");
                } else {
                    const apiDate = data.itm_det_datetime5.date;
                    const formattedDate = Moment( apiDate, "YYYY-MM-DD HH:mm:ss.SSSSSS" ).toDate();
                    setUDFDateTime_5(formattedDate);
                }

                fetchImgData();
            }
            
          } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.data, });
          }
        } catch (error) {
          Swal.fire({ icon: "error", title: "Oops select Inventory Not Found...", text: error, });
        }
    };

    // Thired Api Call
    const fetchImgData = async () => {
    
        try {
        const response = await httpCommon.get( "/get_inventory_edit_form_img.php?RowID=" + RowID );
    // console.log("response____img__asset",response);
            if (response.data.data) {
            // Check if AllImgGet exists and has items
            
            if (response.data.data.AllImgGet && response.data.data.AllImgGet.length > 0) {
                setDbImg(response.data.data.AllImgGet);
            // setDbImgRowId(response.data.data.AllImgGet[0].RowID);
                setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);
                setImageSelect({
                name: response.data.data.AllImgGet[0].file_name,
                path: response.data.data.AllImgGet[0].attachment,
                });
            }
            
            // Check if AllRef exists and has items
            if (response.data.data.AllRef && response.data.data.AllRef.length > 0) {
                setRefImg(response.data.data.AllRef);
                setImguploadRefStatus(response.data.data.AllRef[0].ImgStatusRef);
            }
            }
        } catch (error) {
        console.error("Error fetching data:", error);
        }
    };

    const findCustomizeLabel = (columnName) => {
        const matchingColumn = itmMstLabel.find( (item) => item.column_name === columnName );
        return matchingColumn ? matchingColumn.customize_label : "";
    };

    const onClickCancel = () => {

        navigate(`/dashboard/InventoryMaster/list`, {
            state: {
                currentPage,
                selectedOption,
            },
        });

    }

    const onClickDuplicate = (event) => {

    };

    const onClickChange = (event) => { 
        event.preventDefault();

        if (selected_Type == "" || selected_Type == null) {
            setIsTypeEmpty(true);
            const errorMessage = "Please fill the required field Type is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if (MasterLocationCode == "" || MasterLocationCode == null) {
            setIsMasterLocationEmpty(true);
            const errorMessage = "Please fill the required field Master Location is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if (stockNoText == "" || stockNoText == null) {
            setIsStockNo(true);
            const errorMessage = "Please fill the required field Stock No is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if (selected_orderRule == "" || selected_orderRule == null) {
            setIsOrderRuleEmpty(true);
            const errorMessage = "Please fill the required field Order Rule is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if ( Short_Description == "" || Short_Description == null ) {
            setIsDescEmpty(true);
            const errorMessage = "Please fill the required field Description is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if ( selected_costCenter == "" || selected_costCenter == null ) {
            setIsCostCenterEmpty(true);
            const errorMessage = "Please fill the required field Cost Center is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if (selected_account == "" || selected_account == null) {
            setIsAccountEmpty(true);
            const errorMessage = "Please fill the required field Account is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if ( selected_issueUom == "" || selected_issueUom == null ) {
            setIsIssueUomEmpty(true);
            const errorMessage = "Please fill the required field Issue UOM is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if ( selected_issueUom == "" || selected_issueUom == null ) {
            setIsIssueUomEmpty(true);
            const errorMessage = "Please fill the required field Issue UOM is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if ( selected_recivedUom == "" || selected_recivedUom == null ) {
            setIsReciveUomEmpty(true);
            const errorMessage = "Please fill the required field Recive UOM is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else if (selected_partDeacStatus == "" || selected_partDeacStatus == null) {
            setIsPartDeacEmpty(true);
            const errorMessage = "Please fill the required field Part Deac Status is required!";
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
        }else{

            

            if (Button_save === "Save") {
                New_Inventory();
            } else if (Button_save === "Update") {
                Update_Inventory();
            }

        } 

    }

    const New_Inventory = async () => {
        Swal.fire({
            title: "Loading.... !",
            allowOutsideClick: false,
            customClass: {
              container: "swalcontainercustom",
            },
        });

        let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");
        let site_ID = localStorage.getItem("site_ID");
        let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

        //selected_orderRule
        let setselectedorderRule;
        if (selected_orderRule.label == "" || selected_orderRule.label == null) {
            setselectedorderRule = "";
        } else {
            let selectedorderRule = selected_orderRule.label.split(":");
            setselectedorderRule = selectedorderRule[0];
        } 

        //selected_costCenter
        let setselectedcostCenter;
        if (selected_costCenter.label == "" || selected_costCenter.label == null) {
            setselectedcostCenter = "";
        } else {
            let selectedcostCenter = selected_costCenter.label.split(":");
            setselectedcostCenter = selectedcostCenter[0];
            //console.log("selectedstockGroup: ", selectedcostCenter[0])
        } 

        //selected_account
        let setselectedaccount;
        if (selected_account.label == "" || selected_account.label == null) {
            setselectedaccount = "";
        } else {
            let selectedaccount = selected_account.label.split(":");
            setselectedaccount = selectedaccount[0];
            //console.log("selectedstockGroup: ", selectedaccount[0])
        } 

        //selected_issueUom,
        let setselectedissueUom;
        if (selected_issueUom.label == "" || selected_issueUom.label == null) {
            setselectedissueUom = "";
        } else {
            let selectedissueUom = selected_issueUom.label.split(":");
            setselectedissueUom = selectedissueUom[0];
            //console.log("selectedstockGroup: ", selectedissueUom[0])
        }

        //selected_recivedUom,
        let setselectedrecivedUom;
        if (selected_recivedUom.label == "" || selected_recivedUom.label == null) {
            setselectedrecivedUom = "";
        } else {
            let selectedrecivedUom = selected_recivedUom.label.split(":");
            setselectedrecivedUom = selectedrecivedUom[0];
            //console.log("selectedstockGroup: ", selectedrecivedUom[0])
        }

        //selected_partDeacStatus,
        let setselectedpartDeacStatus;
        if (selected_partDeacStatus.label == "" || selected_partDeacStatus.label == null) {
            setselectedpartDeacStatus = "";
        } else {
            let selectedpartDeacStatus = selected_partDeacStatus.label.split(":");
            setselectedpartDeacStatus = selectedpartDeacStatus[0];
            //console.log("selectedstockGroup: ", selectedpartDeacStatus[0])
        } 

        // selected_Commodity
        let setCommodity;
        if (selected_Commodity.label == "" || selected_Commodity.label == null) {
            setCommodity = "";
        } else {
            let Commodity = selected_Commodity.label.split(":");
            setCommodity = Commodity[0];
            // console.log("Commodity: ", Commodity[0])
        }

        //selected_stockGroup
        let setselectedstockGroup;
        if (selected_stockGroup.label == "" || selected_stockGroup.label == null) {
            setselectedstockGroup = "";
        } else {
            let selectedstockGroup = selected_stockGroup.label.split(":");
            setselectedstockGroup = selectedstockGroup[0];
            //console.log("selectedstockGroup: ", selectedstockGroup[0])
        } 

        //selected_storageType
        let setselectedstorageType;
        if (selected_storageType.label == "" || selected_storageType.label == null) {
            setselectedstorageType = "";
        } else {
            let selectedstorageType = selected_storageType.label.split(":");
            setselectedstorageType = selectedstorageType[0];
            // console.log("selectedstockGroup: ", selectedstorageType[0])
        }

        let setselectedStockNo;
        if (stockNoText.label == "" || stockNoText.label == null) {
            setselectedStockNo = stockNoText;
        } else {
            let selectedStockNo = stockNoText.label.split(":");
            setselectedStockNo = selectedStockNo[0];
        // console.log("selectedStockNo: ", selectedStockNo[0])
        }

        let selectedAccountType, setselectedAccountType;
        if (selected_AccountType.label == "" || selected_AccountType.label == null) {
        setselectedAccountType = "";
        } else {
        selectedAccountType = selected_AccountType.label;
        setselectedAccountType = selectedAccountType;
        //console.log("selectedstockGroup: ", selectedAccountType)
        }

        // select UDFDate_1 
        let date_of_1 = "";
        if (UDFDateTime_1 == "" || UDFDateTime_1 == null) {
            date_of_1 = "";
        } else {
            date_of_1 = Moment(UDFDateTime_1) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        // select UDFDate_2
        let date_of_2 = "";
        if (UDFDateTime_2 == "" || UDFDateTime_2 == null) {
            date_of_2 = "";
        } else {
            date_of_2 = Moment(UDFDateTime_2) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        // select UDFDate_3
        let date_of_3 = "";
        if (UDFDateTime_3 == "" || UDFDateTime_3 == null) {
            date_of_3 = "";
        } else {
            date_of_3 = Moment(UDFDateTime_3) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }
        // select UDFDate_4
        let date_of_4 = "";
        if (UDFDateTime_4 == "" || UDFDateTime_4 == null) {
            date_of_4 = "";
        } else {
            date_of_4 = Moment(UDFDateTime_4) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        // select UDFDate_5
        let date_of_5 = "";
        if (UDFDateTime_5 == "" || UDFDateTime_5 == null) {
            date_of_5 = "";
        } else {
            date_of_5 = Moment(UDFDateTime_5) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        let itmmsttype;
        if (selected_Type) {
            switch (selected_Type.label) {
            case "Stock":
                itmmsttype = "P";
                break;
            case "Tool":
                itmmsttype = "T";
                break;
            case "Serialize":
                itmmsttype = "S";
                break;
            case "Serialize With Asset":
                itmmsttype = "Z";
                break;
            default:
                itmmsttype = "";
                break;
            }
        }

        const selectedRow = CostingRule.find(item => item.id === selectedRowd);

       
        let missingFields = [];

        var json_AssetInsert = {
            site_cd: site_ID,
            itm_mst_stockno: setselectedStockNo ? setselectedStockNo.trim() : stockNoText,
            itm_mst_partno: PartNo.trim(),
            itm_mst_desc: Short_Description.trim(),
            itm_mst_issue_price: selectedRow.issuePrice,
            itm_mst_ttl_oh: '',
            itm_mst_issue_uom: setselectedissueUom.trim(),
            itm_mst_com_code: setCommodity.trim(),
            itm_mst_mstr_locn: MasterLocationCode.trim(),
            itm_mst_non_stk_flg: "0",
            itm_mst_tool_flg: "0",
            itm_mst_order_rule: setselectedorderRule.trim(),
            itm_mst_costcenter: setselectedcostCenter.trim(),
            itm_mst_account: setselectedaccount.trim(),
            itm_mst_rec_supplier:"NULL",
            itm_mst_ext_desc: Long_Description ? Long_Description.trim() : "",
            itm_mst_serialize_flg: "1",
            itm_mst_auto_serialize_flg: "1",
            itm_mst_serialize_counter: '100001',
            itm_mst_type: itmmsttype,
            itm_mst_itm_grp: setselectedstockGroup,
            itm_det_issue_uom:setselectedissueUom.trim(),
            itm_det_rcv_uom:setselectedrecivedUom.trim(),
            itm_det_auto_spare:autoSpare,   
            itm_det_critical_spare:criticalSpare,
            itm_det_hzd_mtl:HazardousMaterial,
            itm_det_storage_type:setselectedstorageType,
            itm_det_cube:Cube,
            itm_det_cr_code:costingValue ? costingValue : "",
            itm_det_abc_class:abcClass,
            itm_det_shelf_life:shelfLife,
            itm_det_order_pt:orderPoint,
            itm_det_maximum:maximumInvtr,
            itm_det_part_deac_status:setselectedpartDeacStatus.trim(),
            itm_det_acct_type: selectedAccountType !== "" ? (selectedAccountType === "INVENTORY" ? "I" : "E") : "",
            itm_det_avg_cost:selectedRow.total_a,
            itm_det_tax_cd:taxCode,  
            itm_det_varchar1:UDFText_1 ? UDFText_1.trim() : UDFText_1,
            itm_det_varchar2:UDFText_2 ? UDFText_2.trim() : UDFText_2,
            itm_det_varchar3:UDFText_3 ? UDFText_3.trim() : UDFText_3,
            itm_det_varchar4:UDFText_4 ? UDFText_4.trim() : UDFText_4,
            itm_det_varchar5:UDFText_5 ? UDFText_5.trim() : UDFText_5,
            itm_det_varchar6:UDFText_6 ? UDFText_6.trim() : UDFText_6,
            itm_det_varchar7:UDFText_7 ? UDFText_7.trim() : UDFText_7,
            itm_det_varchar8:UDFText_8 ? UDFText_8.trim() : UDFText_8,
            itm_det_varchar9:UDFText_9 ? UDFText_9.trim() : UDFText_9,
            itm_det_varchar10:UDFText_10 ? UDFText_10.trim() : UDFText_10,
            itm_det_numeric1:UDFNumeric_1 ? UDFNumeric_1.trim() : "",
            itm_det_numeric2:UDFNumeric_2 ? UDFNumeric_2.trim() : "",
            itm_det_numeric3:UDFNumeric_3 ? UDFNumeric_3.trim() : "",
            itm_det_numeric4:UDFNumeric_4 ? UDFNumeric_4.trim() : "",
            itm_det_numeric5:UDFNumeric_5 ? UDFNumeric_5.trim() : "",
            itm_det_datetime1:date_of_1 ? date_of_1.trim() : date_of_1,
            itm_det_datetime2:date_of_2 ? date_of_2.trim() : date_of_2,
            itm_det_datetime3:date_of_3 ? date_of_3.trim() : date_of_3,
            itm_det_datetime4:date_of_4 ? date_of_4.trim() : date_of_4,
            itm_det_datetime5:date_of_5 ? date_of_5.trim() : date_of_5,
            itm_det_note1:UDFNote_1,

            audit_user: emp_mst_login_id.trim(),
            itm_mst_create_by: emp_mst_login_id.trim(),
            itm_aud_originator: emp_mst_login_id.trim(),
            itm_mst_create_date: get_date,
            ImgUpload: imageSelect,
            
        }

        console.log("json_AssetInsert___",JSON.stringify(json_AssetInsert));
        
        for (let i = 0; i < InventoryMandatoryFiled.length; i++) {
        const item = InventoryMandatoryFiled[i];
        const fieldValue = json_AssetInsert[item.column_name];
            if (fieldValue !== null && fieldValue.trim() === "") {
                missingFields = item.customize_label;
                setErrorField(item.column_name);
                break;
            }
        }

        // If any fields are missing, display an error message
        if (missingFields.length > 0) {

            Swal.close();
            const errorMessage = `Please fill the required field: ${missingFields}`;
            setSnackbarOpen(true);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");

        }else {
            //Swal.close();
            try {
                const response = await httpCommon.post( "/insert_new_inventroy_master.php", JSON.stringify(json_AssetInsert) );
                console.log("json_Master Data", response);
                if (response.data.status === "SUCCESS") {

                    let GetRowId = response.data.ROW_ID;

                    if (selectedPdfFiles.length > 0) {

                        const formData = new FormData();
                        for (let i = 0; i < selectedPdfFiles.length; i++) {
                            formData.append("files[]", selectedPdfFiles[i]);
                        }
                        formData.append("site_cd", site_ID);
                        formData.append("RowID", response.data.ROW_ID);
                        formData.append("RefImgUploadStatus", imguploadRefStatus);
                        formData.append("audit_user", emp_mst_login_id.trim());
                        try {
          
                            const response2 = await httpCommon.post( "/insert_inventory_form_reference_multipal_Img_upload.php", 
                                formData, { headers: { 'Content-Type': 'multipart/form-data' 

                            }});
                
                           // console.log("upload_mltipal____",response2);
                            if (response2.data.status == "SUCCESS") {
                             
                              Swal.close();
                           
                            }else{
                              Swal.close();
                             // console.log("error__", error);
                            }
                        } catch (error) {
                            Swal.close();
                            console.log("error__", error);
                        //Handle error  WorkOrderNo
                        }


                    }
                    

                    Swal.close();
                    Swal.fire({
                        icon: "success",
                        customClass: {
                        container: "swalcontainercustom",
                        },
                        title: response.data.status,
                        text: response.data.message,
                    }).then(() => {
                        navigate(`/dashboard/InventoryMaster/list`);
                    });

                }else {
                    Swal.close();
                    Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.message,
                    });
                }
            } catch (error) {
                Swal.close();
                Swal.fire({
                  icon: "error",
                  title: "Oops Somthing is wrong...",
                  text: error,
                });
            }
        }
    }

    const Update_Inventory = async () => {
        Swal.fire({
          title: "Loading.... !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();
    
        let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");
        let site_ID = localStorage.getItem("site_ID");
        let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

        //selected_orderRule
        let setselectedorderRule;
        if (selected_orderRule.label == "" || selected_orderRule.label == null) {
            setselectedorderRule = "";
        } else {
            let selectedorderRule = selected_orderRule.label.split(":");
            setselectedorderRule = selectedorderRule[0];
        } 

        //selected_costCenter
        let setselectedcostCenter;
        if (selected_costCenter.label == "" || selected_costCenter.label == null) {
            setselectedcostCenter = "";
        } else {
            let selectedcostCenter = selected_costCenter.label.split(":");
            setselectedcostCenter = selectedcostCenter[0];
            //console.log("selectedstockGroup: ", selectedcostCenter[0])
        } 

        //selected_account
        let setselectedaccount;
        if (selected_account.label == "" || selected_account.label == null) {
            setselectedaccount = "";
        } else {
            let selectedaccount = selected_account.label.split(":");
            setselectedaccount = selectedaccount[0];
            //console.log("selectedstockGroup: ", selectedaccount[0])
        } 

        //selected_issueUom,
        let setselectedissueUom;
        if (selected_issueUom.label == "" || selected_issueUom.label == null) {
            setselectedissueUom = "";
        } else {
            let selectedissueUom = selected_issueUom.label.split(":");
            setselectedissueUom = selectedissueUom[0];
            //console.log("selectedstockGroup: ", selectedissueUom[0])
        }

        //selected_recivedUom,
        let setselectedrecivedUom;
        if (selected_recivedUom.label == "" || selected_recivedUom.label == null) {
            setselectedrecivedUom = "";
        } else {
            let selectedrecivedUom = selected_recivedUom.label.split(":");
            setselectedrecivedUom = selectedrecivedUom[0];
            //console.log("selectedstockGroup: ", selectedrecivedUom[0])
        }

        //selected_partDeacStatus,
        let setselectedpartDeacStatus;
        if (selected_partDeacStatus.label == "" || selected_partDeacStatus.label == null) {
            setselectedpartDeacStatus = "";
        } else {
            let selectedpartDeacStatus = selected_partDeacStatus.label.split(":");
            setselectedpartDeacStatus = selectedpartDeacStatus[0];
            //console.log("selectedstockGroup: ", selectedpartDeacStatus[0])
        } 

        // selected_Commodity
        let setCommodity;
        if (selected_Commodity.label == "" || selected_Commodity.label == null) {
            setCommodity = "";
        } else {
            let Commodity = selected_Commodity.label.split(":");
            setCommodity = Commodity[0];
            // console.log("Commodity: ", Commodity[0])
        }

        //selected_stockGroup
        let setselectedstockGroup;
        if (selected_stockGroup.label == "" || selected_stockGroup.label == null) {
            setselectedstockGroup = "";
        } else {
            let selectedstockGroup = selected_stockGroup.label.split(":");
            setselectedstockGroup = selectedstockGroup[0];
            //console.log("selectedstockGroup: ", selectedstockGroup[0])
        } 

        //selected_storageType
        let setselectedstorageType;
        if (selected_storageType.label == "" || selected_storageType.label == null) {
            setselectedstorageType = "";
        } else {
            let selectedstorageType = selected_storageType.label.split(":");
            setselectedstorageType = selectedstorageType[0];
            // console.log("selectedstockGroup: ", selectedstorageType[0])
        }

        let setselectedStockNo;
        if (stockNoText.label == "" || stockNoText.label == null) {
            setselectedStockNo = stockNoText;
        } else {
            let selectedStockNo = stockNoText.label.split(":");
            setselectedStockNo = selectedStockNo[0];
        // console.log("selectedStockNo: ", selectedStockNo[0])
        }

        let selectedAccountType, setselectedAccountType;
        if (selected_AccountType.label == "" || selected_AccountType.label == null) {
        setselectedAccountType = "";
        } else {
        selectedAccountType = selected_AccountType.label;
        setselectedAccountType = selectedAccountType;
        //console.log("selectedstockGroup: ", selectedAccountType)
        }

        // select UDFDate_1 
        let date_of_1 = "";
        if (UDFDateTime_1 == "" || UDFDateTime_1 == null) {
            date_of_1 = "";
        } else {
            date_of_1 = Moment(UDFDateTime_1) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        // select UDFDate_2
        let date_of_2 = "";
        if (UDFDateTime_2 == "" || UDFDateTime_2 == null) {
            date_of_2 = "";
        } else {
            date_of_2 = Moment(UDFDateTime_2) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        // select UDFDate_3
        let date_of_3 = "";
        if (UDFDateTime_3 == "" || UDFDateTime_3 == null) {
            date_of_3 = "";
        } else {
            date_of_3 = Moment(UDFDateTime_3) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }
        // select UDFDate_4
        let date_of_4 = "";
        if (UDFDateTime_4 == "" || UDFDateTime_4 == null) {
            date_of_4 = "";
        } else {
            date_of_4 = Moment(UDFDateTime_4) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }

        // select UDFDate_5
        let date_of_5 = "";
        if (UDFDateTime_5 == "" || UDFDateTime_5 == null) {
            date_of_5 = "";
        } else {
            date_of_5 = Moment(UDFDateTime_5) .format("yyyy-MM-DD HH:mm:ss") .trim();
        }
    
        //Check Img state
        let setDbImgRowIdUpdate;
        if (getDbImgRowId == "" || getDbImgRowId == null) {
            setDbImgRowIdUpdate = "";
        } else {
            setDbImgRowIdUpdate = getDbImgRowId;
        }
    
      
        const selectedRow = CostingRule.find(item => item.id === selectedRowd);

        let missingFields = [];
    
        var json_AssetUpdate = {
          site_cd: site_ID,
          itm_mst_stockno: setselectedStockNo ? setselectedStockNo.trim() : stockNoText,
          itm_mst_partno: PartNo ? PartNo.trim() : "",
          itm_mst_desc: Short_Description.trim(),
          itm_mst_issue_price: selectedRow.issuePrice,
          itm_mst_ttl_oh: '',
          itm_mst_issue_uom: setselectedissueUom.trim(),
          itm_mst_com_code: setCommodity.trim(),
          itm_mst_mstr_locn: MasterLocationCode.trim(),
          itm_mst_non_stk_flg: "0",
          itm_mst_tool_flg: "0",
          itm_mst_order_rule: setselectedorderRule.trim(),
          itm_mst_costcenter: setselectedcostCenter.trim(),
          itm_mst_account: setselectedaccount.trim(),
          itm_mst_rec_supplier:"NULL",
          itm_mst_ext_desc: Long_Description ? Long_Description.trim() : "",
          itm_mst_serialize_flg: "1",
          itm_mst_auto_serialize_flg: "1",
          itm_mst_serialize_counter: '100001',
          itm_mst_type: selected_Type.label,
          itm_mst_itm_grp: setselectedstockGroup,
          itm_det_issue_uom:setselectedissueUom.trim(),
          itm_det_rcv_uom:setselectedrecivedUom.trim(),
          itm_det_auto_spare:autoSpare,   
          itm_det_critical_spare:criticalSpare,
          itm_det_hzd_mtl:HazardousMaterial,
          itm_det_storage_type:setselectedstorageType,
          itm_det_cube:Cube,
          itm_det_cr_code:costingValue ? costingValue : "",
          itm_det_abc_class:abcClass,
          itm_det_shelf_life:shelfLife,
          itm_det_order_pt:orderPoint,
          itm_det_maximum:maximumInvtr,
          itm_det_part_deac_status:setselectedpartDeacStatus.trim(),
          itm_det_acct_type: selectedAccountType !== "" ? (selectedAccountType === "INVENTORY" ? "I" : "E") : "",
          itm_det_avg_cost:selectedRow.total_a,
          itm_det_tax_cd:taxCode,  
          itm_det_varchar1:UDFText_1 ? UDFText_1.trim() : UDFText_1,
          itm_det_varchar2:UDFText_2 ? UDFText_2.trim() : UDFText_2,
          itm_det_varchar3:UDFText_3 ? UDFText_3.trim() : UDFText_3,
          itm_det_varchar4:UDFText_4 ? UDFText_4.trim() : UDFText_4,
          itm_det_varchar5:UDFText_5 ? UDFText_5.trim() : UDFText_5,
          itm_det_varchar6:UDFText_6 ? UDFText_6.trim() : UDFText_6,
          itm_det_varchar7:UDFText_7 ? UDFText_7.trim() : UDFText_7,
          itm_det_varchar8:UDFText_8 ? UDFText_8.trim() : UDFText_8,
          itm_det_varchar9:UDFText_9 ? UDFText_9.trim() : UDFText_9,
          itm_det_varchar10:UDFText_10 ? UDFText_10.trim() : UDFText_10,
          itm_det_numeric1:UDFNumeric_1 ? UDFNumeric_1.trim() : "",
          itm_det_numeric2:UDFNumeric_2 ? UDFNumeric_2.trim() : "",
          itm_det_numeric3:UDFNumeric_3 ? UDFNumeric_3.trim() : "",
          itm_det_numeric4:UDFNumeric_4 ? UDFNumeric_4.trim() : "",
          itm_det_numeric5:UDFNumeric_5 ? UDFNumeric_5.trim() : "",
          itm_det_datetime1:date_of_1 ? date_of_1.trim() : date_of_1,
          itm_det_datetime2:date_of_2 ? date_of_2.trim() : date_of_2,
          itm_det_datetime3:date_of_3 ? date_of_3.trim() : date_of_3,
          itm_det_datetime4:date_of_4 ? date_of_4.trim() : date_of_4,
          itm_det_datetime5:date_of_5 ? date_of_5.trim() : date_of_5,
          itm_det_note1:UDFNote_1,
    
          audit_user: emp_mst_login_id.trim(),
          itm_mst_create_by: emp_mst_login_id.trim(),
          itm_aud_originator: emp_mst_login_id.trim(),
          itm_mst_create_date: get_date,

          SingleImguploadStatus:imguploadStatus,
          ImguploadRefStatus:imguploadRefStatus ? imguploadRefStatus :"EMPTY",
    
          ImgGetDbImgRowId: setDbImgRowIdUpdate,
          ImgUpload: imageSelect,
          SpecialOdrResult: SpecialOdrResult,
    
          removedRefItems: removedRefItems,
          RowID: RowID,
    
          selectedPdfFiles:selectedPdfFiles,

          RowID: RowID,
        };
        console.log("selectedPdfFiles", selectedPdfFiles.length);

        console.log("json_AssetUpdate____", JSON.stringify(json_AssetUpdate));
        for (let i = 0; i < InventoryMandatoryFiled.length; i++) {
          const item = InventoryMandatoryFiled[i];
          const fieldValue = json_AssetUpdate[item.column_name];
          if (fieldValue !== null && fieldValue.trim() === "") {
            missingFields = item.customize_label;
            setErrorField(item.column_name);
            break; // Stop loop as soon as a missing field is found
          }
        }
        console.log("Code block executed");
        // If any fields are missing, display an error message
        if (missingFields.length > 0) {
          Swal.close();
    
          const errorMessage = `Please fill the required field: ${missingFields}`;
          setSnackbarOpen(true);
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity("error");
        } else {
          try {
            const response = await httpCommon.post( "/update_inventory_master.php", JSON.stringify(json_AssetUpdate) );
            console.log("response_____", response);
            if (response.data.status === "SUCCESS") {

                if (selectedPdfFiles.length > 0) {

                    const formData = new FormData();

                    for (let i = 0; i < selectedPdfFiles.length; i++) {

                        formData.append("files[]", selectedPdfFiles[i]);
                    }
                    formData.append("site_cd", site_ID);
                    formData.append("RowID", RowID);
                    formData.append("RefImgUploadStatus", imguploadRefStatus);
                    formData.append("audit_user", emp_mst_login_id.trim());
                
                    try {

                        const response = await httpCommon.post( "/insert_inventory_form_reference_multipal_Img_upload.php", 
                            formData, { headers: { 'Content-Type': 'multipart/form-data'  } 
                        } );

                        console.log("upload_mltipal____",response);
                        if (response.data.status == "SUCCESS") {

                            Swal.close();

                            Swal.fire({
                                icon: "success",
                                customClass: {
                                container: "swalcontainercustom",
                                },
                                title: response.data.status,
                                text: `Inventory ${setselectedStockNo ? setselectedStockNo.trim() : stockNoText} Updated Successfully`,
                                timer: 3000, // Auto-close after 3 seconds
                                timerProgressBar: true, // Optional: Shows a progress bar
                                willClose: () => {
                                // Navigate to the desired page when the modal closes
                                 navigate(`/dashboard/InventoryMaster/list`, { state: { currentPage, selectedOption}});
                                },
                            }).then((result) => {

                                if (result.dismiss !== Swal.DismissReason.timer) {
                                    navigate(`/dashboard/InventoryMaster/list`, { state: { currentPage, selectedOption}});
                                }else{
                                    Swal.close();
                                }


                            });

                        }

                    }catch (error) {
                        Swal.close();
                        console.log("error__", error);
                        //Handle error  WorkOrderNo
                    }

                }else{

                    Swal.close();
                    Swal.fire({
                    icon: "success",
                    customClass: {
                        container: "swalcontainercustom",
                    },
                    title: response.data.status,
                    text: response.data.message,
                    }).then(() => {
                    if (response.data.status === "SUCCESS") {
                        // navigate(`/dashboard/work/order`);
                        navigate(`/dashboard/InventoryMaster/list`, { state: { currentPage, selectedOption}});
                    }
                    });

                }
              
              
            } else {
              Swal.close();
              Swal.fire({
                icon: "error",
                customClass: {
                  container: "swalcontainercustom",
                },
                title: "Oops...",
                text: response.data,
              });
            }
          } catch (error) {
            Swal.close();
    
            Swal.fire({
              icon: "error",
              customClass: {
                container: "swalcontainercustom",
              },
              title: "Oops Data Not Updated...",
              text: error,
            });
          }
        }
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function CustomTextField({ rightIcons, ...props }) {
        return (
            <TextField
            {...props}
            InputProps={{
                endAdornment: rightIcons && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {rightIcons.map((icon, index) => (
                    <IconButton key={index} onClick={icon.props.onClick}>
                        {icon}
                    </IconButton>
                    ))}
                </div>
                ),
            }}
            />
        );
    }

    function handleCloseModalMasterLocation() {
        setopen_MasterLocation(false);
    }

    const handleRowData3 = (dataLenth, dataa, dataSecond) => {
        // Use the row data in the second component
        setMasterLocationCode(dataa);

        if (dataLenth !== undefined && dataLenth !== null) {
            setTotal_loc_mst(dataLenth);
        }
        // if (dataa !== undefined && dataa !== null) {
        //   handleSelectedAssetNo(dataa);
        // }
        if (dataSecond == "1") {
            setopen_MasterLocation(false);
            setTotalSearch("");
        }
    };
    

    const handleRowDataPagechg = (pageCount) => {
        setViewedTotlRows(pageCount);
    };

    const handelRowSearch = (searchTotl) => {
        setTotalSearch(searchTotl);
    };

    const handleCancelMasterLocation = () => {
        setMasterLocationCode("");
    };

    const handleEditClickMasterLocation = () => {
        setopen_MasterLocation(true);
        setIsMasterLocationEmpty(false);
    };



    const handleStatusChange = (event, value) => {

        setSelected_Commodity(value);
        setIsCostCenterEmpty(false);

    }

    const handleNumericInputChange = (e, setterFunction) => {


        console.log('')
        let { value } = e.target;
        if (value.length >= 17) {
        return; 
        }
        value = value.replace(/[^0-9.]/g, '');
        value = value.slice(0, 16); 
        const parts = value.split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1];
        if ( decimalPart === '') { 
            integerPart += '.';
            decimalPart = '';
        } else if (decimalPart && decimalPart.length >= 4) {
            decimalPart = decimalPart.slice(0, 4);
        }else{
            let integerPart2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (integerPart2.length > 11) {
            integerPart2 = integerPart2.slice(0, 12) + '.' + integerPart2.slice(12, 16);
            }
            let decimalPart2 = parts[1] ? parts[1].slice(0, 4) : '';
            const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2
            setterFunction(formattedValue2);
            setErrorField(null); // Clear any error state
            return; 
        }
        const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
        setterFunction(formattedValue); // Set the state for the respective UDFNumber state
        setErrorField(null);
            
        
        
    }

    const handleToggle = (event) => {
        
        setAnchorEl(event.currentTarget);
    };



    const handleCancelTaxCode = () => {
        setTaxCode("");
    };

    const handleEditClickTaxCode = () => {
    
    };

   
    const handleRadioChange = (rowId,value) => {
        setSelectedRowd(rowId);
        setcostingValue(value);

        console.log('rowId',rowId)
        console.log('value',value)

        console.log('CostingRule'+ JSON.stringify(CostingRule))

    };

    const handleInputChange = (rowId, value) => {


        if (value.length >= 17) {
          return; 
        }
        value = value.replace(/[^0-9.]/g, '');
        value = value.slice(0, 16); 
        const parts = value.split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1];
        if ( decimalPart === '') { 
            integerPart += '.';
            decimalPart = '';
        } else if (decimalPart && decimalPart.length >= 4) {
            decimalPart = decimalPart.slice(0, 4);
        }else{
            let integerPart2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (integerPart2.length > 11) {
                integerPart2 = integerPart2.slice(0, 12) + '.' + integerPart2.slice(12, 16);
            }
            let decimalPart2 = parts[1] ? parts[1].slice(0, 4) : '';
            const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2;

            const newData = CostingRule.map(item => {
                if (item.id == rowId) {

                  item.total_a = formattedValue2
                  item.itemCost = formattedValue2
                  item.issuePrice = formattedValue2
                
                  return item;
                }
                return item;
              })
              //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
              setCostingRule(newData)

            return; 
        }
        const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
        console.log('formattedValue if',formattedValue)

        const newData = CostingRule.map(item => {
            if (item.id == rowId) {

              item.total_a = formattedValue
              item.itemCost = formattedValue
              item.issuePrice = formattedValue
            
              return item;
            }
            return item;
          })
          //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
          setCostingRule(newData)

        
        

        
    };

    const handleNumericInputChangeFinacal = (value) => {
        

    };

   

    //Stock Master Part 02
    const toggleDiv = () => {
        setIsOpenWork(!isOpenWork);
    }

    //Stock Master Part 03
    const toggleDiv2 = () => {
        setIsOpenWork2(!isOpenWork2);
    };

    //Stock Master Part 03
    const toggleDiv3 = () => {
        setIsOpenWork3(!isOpenWork3);
    };

    //Stock Menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    //Images
    const openSaveImg = () => {
        setShowdd2(true);
    };

    //Delete Image
    const handleDeleteImgApi = (ImgIDdlt) => {

        const updatedImages = getDbImg.filter((image) => image.RowID !== ImgIDdlt);

        // Update the state with the new array of images after the deletion
        setDbImg(updatedImages);
        setDbImgRowId(ImgIDdlt);
        setDisabledBtn(true);
        setImguploadStatus("NEW_SINGLE_IMG");
        setImageSelect({ name: "", path: "" });

    }

    //Clear Image
    const handleClearImg = (event) => {
        event.preventDefault();
        clearDataImg();
        setDisabledBtn(false);
    };

    const clearDataImg = () => {
        setImage("");
       
          if(Button_save === "Save"){
              setImageSelect({ name: "", path: "" });
            };
          }

    const handleImgChangeSingle2 = (e) => {
        setDisabledBtn(false);
    };

    //SnackBar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


    // Refrence Imge funcation
    const handleButtonClick = () => {

        fileInputRef.current.click();

    }

    const handleDeleteImg = (e) => {
        const s = selectedImages.filter((item, index) => index !== e);
        setSelectedImages(s);
    };

    const handleShowdata = (item) => {
        setSelectedImage(item.attachment);
        setShowdd(true);
    };

    const openPDFInNewTab = (fileName) => {
        const baseURL = httpCommon.defaults.baseURL;
        const fileURL = `${baseURL}${fileName}`
        // Open the file URL in a new tab
        window.open(fileURL, "_blank");
    };

    const openDocxInNewTab = (fileName) => {
        const baseURL = httpCommon.defaults.baseURL;
        const fileURL = `${baseURL}${fileName}`;
        window.open(fileURL, "_blank");
    };
    
    const openPhpInNewTab = (fileName) => {
        const baseURL = httpCommon.defaults.baseURL;
        const fileURL = `${baseURL}${fileName}`;
        window.open(fileURL, "_blank");
    };
    
    const openLogInNewTab = (fileName) => {
        const baseURL = httpCommon.defaults.baseURL;
        const fileURL = `${baseURL}${fileName}`;
        window.open(fileURL, "_blank");
    };
    
    const openXlsxInNewTab = (fileName) => {
        const baseURL = httpCommon.defaults.baseURL;
        const fileURL = `${baseURL}${fileName}`;
        window.open(fileURL, "_blank");
    };

    const handleDeleteReferenceApi = (RefImgDlt) => {
        const removedItem = RefImg.find((item) => item.RowID === RefImgDlt);
        const updatedRefImg = RefImg.filter((item) => item.RowID !== RefImgDlt);
        setRefImg(updatedRefImg);
        setRemovedRefItems((prevRemovedRefItems) => [ ...prevRemovedRefItems, removedItem, ]);
    };

    const handleShowdd = (e, rowData) => {
        const base64Data = rowData.base64.split(',')[1]; 
        const byteCharacters = atob(base64Data); 
        const byteArrays = [];
      
        // Create byte array from base64 data
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
      
        const blob = new Blob(byteArrays, { type: rowData.type });
        const objectURL = URL.createObjectURL(blob);
        sethandalImg(objectURL);
        setShowdd(true);
    };

    async function handleImageChange(event) {

        const files = Array.from(event.target.files);
        const selectedImagesArray = [...selectedImages2];
        const processedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let fileType = file.type.toLowerCase();

            // Check for HEIC/HEIF using the file name if type is empty
            if (!fileType) {
                const fileName = file.name.toLowerCase();
                if (fileName.endsWith(".heic") || fileName.endsWith(".heif")) {
                fileType = "image/heic"; // Manually set the type
                }
            }

            if (fileType === "image/heic" || fileType === "image/heif") {

                const processHEIC = async () => {
                    try {
                        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                        const convertedFile = new File([convertedBlob], file.name.replace(/\.\w+$/, ".jpg"), {
                          type: "image/jpeg",
                        });
              
                        // Read converted file as Base64
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            selectedImagesArray.push({
                              name: convertedFile.name,
                              type: convertedFile.type,
                              base64: e.target.result,
                            });
                            resolve();
                          };
                          reader.readAsDataURL(convertedFile);
                        });
                    } catch (error) {
                    console.error("Error converting HEIC image:", error);
                    }

                }

                processedFiles.push(processHEIC());

            }else{

                // Handle non-HEIC files
                const processOtherFile = new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                    selectedImagesArray.push({
                        name: file.name,
                        type: file.type,
                        base64: event.target.result,
                    });
                    resolve();
                    };
                    reader.readAsDataURL(file);
                });
                processedFiles.push(processOtherFile);

            }

        }

        await Promise.all(processedFiles);
        // Update state once all files are processed
        setSelectedImages2(selectedImagesArray);
        //setSelectedImages((prev) => [...prev, ...files]);
        setSelectedImages(selectedImagesArray); 
        setSelectedPdfFiles((prevSelectedPdfFiles) => [ ...prevSelectedPdfFiles, ...files, ]);
        setImguploadRefStatus("Ref_New_img");

    }
    const isMyStateEmpty = Object.keys(handalImg).length === 0 && handalImg.constructor === Object;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        // selectedImages.forEach((file) => {
        //   formData.append("files[]", file);
        // });
    };

    const handleImgChangeSingle = (e) => {
        const file = e.target.files[0];
        if (file) {
         
          if (!file.type.startsWith('image/')) {
            
            Swal.fire({
              title: "Opps..!",
              text: "You can upload only image files",
              icon: "warning",
              customClass: {
                container: "swalcontainercustom",
              },
            });
            return;
          }
        }
        if (e.target.files.length) {
          setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0],
          });
          setDisabledBtn(true);
          setImguploadStatus("NEW_SINGLE_IMG");
        }
        // Img set for data api
        if (getDbImg != "") {
          setDbImg("");
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSelect({ name: file.name, path: reader.result });
        };
    
        reader.readAsDataURL(file);
    };

    //SnackBar
    useEffect(() => {
        let timer;
        if (snackbarOpen) {
          timer = setInterval(() => {
            setProgress((oldProgress) => {
              if (oldProgress === 100) {
                clearInterval(timer);
                setSnackbarOpen(false);
                return 0;
              }
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 400);
        } else {
          setProgress(0);
        }
        return () => {
          clearInterval(timer);
        };
    }, [snackbarOpen]);
    


    return(
        <>
         <Helmet>
            <title> {RowID ? "Update Inventory" : DuplicatRowID ? "Duplicate Inventory" : "Create New Inventory"} </title>
            <meta name="description" content="Create New Inventory" />
         </Helmet>
         <Container maxWidth={settings.themeStretch ? false : "lg"}>
            <div
            className="CustomBreadAssetSaveWordOrder"
            style={{
                position: "-webkit-sticky",
                position: "sticky",
                top: "55px",
                backgroundColor: "white",
                zIndex: 1000,
                borderBottom: "1px solid #00000021",
                height: "60px !important",
            }}>
                <CustomBreadcrumbs

                    heading={RowID ? `Update ${InventoryNo} Inventory` : DuplicatRowID ? "Duplicate Inventory" : "Create New Inventory" }
                    action={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {(() => {

                                if ( DuplicatRowID !== undefined && DuplicatRowID !== null && DuplicatRowID !== "" ) {

                                    return (
                                        <div>
                                            <Button
                                                component={RouterLink}
                                                onClick={onClickDuplicate}
                                                variant="contained"
                                                className="SaveButton"
                                                startIcon={<Iconify icon="mingcute:save-fill" />}
                                                style={{
                                                    backgroundColor: "#4CAF50",
                                                    color: "white",
                                                    marginRight: "10px",
                                                }}>
                                                {Button_save === "Duplicate" ? "Save" : Button_save}
                                            </Button>
                                            <Button
                                                variant="soft"
                                                color="error"
                                                className="CloseButton"
                                                startIcon={<Iconify icon="jam:close" />}
                                                onClick={onClickCancel}
                                                > Close
                                            </Button>
                                        </div>
                                    )


                                }else{
                                    return (
                                        <div>
                                          <Button
                                            component={RouterLink}
                                            onClick={onClickChange}
                                            variant="contained"
                                            className="SaveButton"
                                            startIcon={<Iconify icon="mingcute:save-fill" />}
                                            style={{
                                              backgroundColor: "#4CAF50",
                                              color: "white",
                                              marginRight: "10px",
                                            }}
                                          >
                                            {Button_save}
                                          </Button>
                                          <Button
                                            variant="soft"
                                            color="error"
                                            className="CloseButton"
                                            startIcon={<Iconify icon="jam:close" />}
                                            onClick={onClickCancel}
                                          > Close
                                          </Button>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Tabs
                    value={Tabvalue}
                    onChange={handleChange}
                    aria-label="Basic tabs"
                    defaultValue={0}
                    sx={{
                        background: "#8080800d",
                        borderRadius: "5px",
                        marginTop:"10px",
                    '& .MuiTab-root': {
                        textTransform: 'none',
                    },
                    '& .Mui-selected': {
                        color: '#000',
                        fontWeight: 'bold',
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'blue',
                    },
                    }}
                >
                    <Tab
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify icon="fluent-mdl2:pen-workspace" style={{ marginRight: '5px', width: '17px' }} /> Stock Master
                            </div>
                        }
                    />
                    <Tab
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify icon="mdi:finance" style={{ marginRight: '4px' }} /> Financial
                            </div>
                        }
                    />
                    <Tab
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify icon="mdi:shop-location-outline" style={{ marginRight: '4px' }} /> Location
                            </div>
                        }
                    />
                    <Tab
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify icon="mdi:axis-arrow-info" style={{ marginRight: '4px' }} /> Supplier
                            </div>
                        }
                    />
                    <Tab
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify icon="codicon:references" style={{ marginRight: '4px' }} /> Attachment
                            </div>
                        }
                    />
                </Tabs>
            </div>

            <div>
            {loading ? (
                <p>Loading data...</p>
            ) : 
            (
                <>
                <Grid container spacing={2}>
                    <Grid xs={12} md={12}>
                        <Card className="mainAssetDiv">
                            <Grid container spacing={2}>
                                <Grid xs={12} md={12}>
                                    {/* Stock Master */}
                                    <Box
                                        role="tabpanel"
                                        hidden={Tabvalue !== 0}
                                        sx={{ marginTop: "16px" }}
                                    >
                                        <Grid container spacing={0}>
                                            <Grid xs={12} md={12}>
                                                <Card className="AssetFirstTab">
                                                    <Grid container spacing={0}>
                                                        <Grid xs={12} md={10}>
                                                            {/***** img mobile *****/}
                                                            <div className="col-md-2 mobileImgversion">
                                                                <div className="row">
                                                                    <div className="row ImgShowMobile">
                                                                        <div>
                                                                            <label htmlFor="upload-button">
                                                                                {getDbImg && getDbImg.length > 0 ? (
                                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                                        {/* File Display (Icon or Image) */}
                                                                                        {getDbImg[0].file_name.toLowerCase().endsWith(".pdf") ? (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faFilePdf}
                                                                                                onClick={() => openPDFInNewTab(getDbImg[0].attachment)}
                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                className="fntpdf"
                                                                                            />
                                                                                        ) : getDbImg[0].file_name.toLowerCase().endsWith(".docx") ? (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faFileWord}
                                                                                                onClick={() => openDocxInNewTab(getDbImg[0].attachment)}
                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                className="fntdocx"
                                                                                            />
                                                                                        ) : getDbImg[0].file_name.toLowerCase().endsWith(".php") ? (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faFileCode}
                                                                                                onClick={() => openPhpInNewTab(getDbImg[0].attachment)}
                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                className="fntphp"
                                                                                            />
                                                                                        ) : getDbImg[0].file_name.toLowerCase().endsWith(".log") ? (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faFileAlt}
                                                                                                onClick={() => openLogInNewTab(getDbImg[0].attachment)}
                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                className="fntlog"
                                                                                            />
                                                                                        ) : getDbImg[0].file_name.toLowerCase().endsWith(".xlsx") ? (
                                                                                            <FontAwesomeIcon
                                                                                                icon={faFileExcel}
                                                                                                onClick={() => openXlsxInNewTab(getDbImg[0].attachment)}
                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                className="fntxlsx"
                                                                                            />
                                                                                        ) : getDbImg[0].file_name.toLowerCase().endsWith(".txt") ? (
                                                                                            <span
                                                                                                style={{ fontSize: "14px", fontWeight: 600, }} > File preview not supported.
                                                                                            </span>
                                                                                        ) :  (
                                                                                            <img
                                                                                                src={ getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` : "" }
                                                                                                className="imgCurPont"
                                                                                                alt="File Thumbnail"
                                                                                                onClick={openSaveImg}
                                                                                                style={{ width: "auto", height: "150px", cursor: "pointer", }}
                                                                                            />
                                                                                        )}
                                                                                        
                                                                                        {/* Delete Button */}
                                                                                        <div className="col btnCenter">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn dlt"
                                                                                                onClick={() => {
                                                                                                    setIsFormFiled(true);
                                                                                                    handleDeleteImgApi(getDbImg[0].RowID);
                                                                                                }}
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "center",
                                                                                                    marginTop: "15px", // Adds space between the file and the delete button
                                                                                                }}
                                                                                            >
                                                                                                <Iconify icon="fluent:delete-48-filled" style={{ fontSize: "24px" }} /> Delete
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ):image?.preview ? (
                                                                                    <div>
                                                                                        {/* If the file is an image, show the image preview */}
                                                                                        {image.raw?.type?.startsWith("image/") ? (
                                                                                            <img
                                                                                                src={image.preview}
                                                                                                alt="preview"
                                                                                                className="imgCurPont"
                                                                                                onClick={openSaveImg}
                                                                                                style={{ width: "200px", height: "180px", cursor: "pointer" }} // Adjust size as needed
                                                                                            />
                                                                                        ) : (
                                                                                            // Handle non-image files (PDF, DOCX, XLSX, etc.)
                                                                                            <div>
                                                                                                {image.raw?.name?.toLowerCase().endsWith(".pdf") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFilePdf}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer", }}
                                                                                                    />
                                                                                                ) : image.raw?.name?.toLowerCase().endsWith(".docx") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFileWord}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                    />
                                                                                                ) : image.raw?.name?.toLowerCase().endsWith(".xlsx") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFileExcel}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <span style={{ fontSize: "14px", fontWeight: 600, }} > File preview not supported. </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    
                                                                                        {/* Delete button */}
                                                                                        <div className="col btnCenter">
                                                                                            <button
                                                                                            type="button"
                                                                                            className="btn dlt"
                                                                                            onClick={handleClearImg}
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                justifyContent: "center",
                                                                                                marginTop: "15px", // Adds space between the file and the delete button
                                                                                            }}
                                                                                            >
                                                                                            <Iconify icon="fluent:delete-48-filled" style={{ marginRight: "5px" }} />
                                                                                            Delete
                                                                                            </button>
                                                                                        </div>

                                                                                    </div>
                                                                                ): (
                                                                                    <>
                                                                                      <span className="fa-stack fa-2x mb-2">
                                                                                        <img
                                                                                          src={require("../../../../assets/img/Add_Image_icon.png")}
                                                                                          className="sliderimg2 ffff"
                                                                                          onClick={(e) => {
                                                                                            setIsFormFiled(true);
                                                                                            handleImgChangeSingle2(e);
                                                                                          }}
                                                                                          width="200"
                                                                                          height="180"
                                                                                          alt=""
                                                                                        />
                                                                                      </span>
                                                                                    </>
                                                                                )}

                                                                            </label>
                                                                            {getDbImg && getDbImg.length > 0 ? (
                                                                                <div></div>
                                                                            ) : (
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        id="upload-button"
                                                                                        accept="image/*"
                                                                                        disabled={disabledBtn}
                                                                                        style={{ display: "none" }}
                                                                                        onChange={handleImgChangeSingle}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <BootstrapDialog
                                                                            onClose={handleClosedd2}
                                                                            aria-labelledby="customized-dialog-title"
                                                                            open={showdd2}
                                                                        >
                                                                            <IconButton
                                                                                aria-label="close"
                                                                                onClick={handleClosedd2}
                                                                                sx={{
                                                                                position: "absolute",
                                                                                right: 8,
                                                                                top: 8,
                                                                                color: (theme) =>
                                                                                    theme.palette.grey[500],
                                                                                }}
                                                                            >
                                                                                X
                                                                            </IconButton>
                                                                            <DialogContent
                                                                                dividers
                                                                                style={{ display: "flex", justifyContent: "center", }}
                                                                            >
                                                                                {getDbImg && getDbImg.length > 0 ? (
                                                                                <div>
                                                                                    <img
                                                                                    src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
                                                                                    alt="dummy"
                                                                                    className="dummyImg"
                                                                                    onClick={openSaveImg}
                                                                                    />
                                                                                </div>
                                                                                ) : (
                                                                                <img
                                                                                    src={image.preview}
                                                                                    alt="dummy"
                                                                                    style={{ height: "50%", width: "50%", }}
                                                                                    onClick={openSaveImg}
                                                                                    className="dummyImg"
                                                                                />
                                                                                )}
                                                                            </DialogContent>
                                                                        </BootstrapDialog>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Box>
                                                                {/* Type & Master Location */}
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} md={6}>
                                                                        <Box
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            width="100%"
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel("itm_mst_type") || "Type"}
                                                                                </Typography>
                                                                                
                                                                                <Autocomplete
                                                                                    options={type}
                                                                                    value={ selected_Type ? (selected_Type.label || "").split(" : ").slice(0, 2).join(" : ") : "" }
                                                                                    onChange={(event, value) => { 
                                                                                        setSelected_Type(value); 
                                                                                        setIsTypeEmpty(false); 
                                                                                    }}
                                                                                    disableAnimation
                                                                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                        <TextField
                                                                                            {...params}
                                                                                            placeholder="Select..."
                                                                                            variant="outlined"
                                                                                            size="small"
                                                                                            className={`Extrasize ${ isTypeEmpty ? "errorEmpty" : "" }`}
                                                                                            fullWidth
                                                                                            ref={autocompleteRef}
                                                                                        />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </Stack>
                                                                            
                                                                        </Box>
                                                                       
                                                                    </Grid>
                                                                     {/* Master Location */}
                                                                    <Grid item xs={12} md={6}>
                                                                        <Box
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                            display="flex"
                                                                            alignItems="center" 
                                                                            width="100%"
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel("itm_mst_mstr_locn") || "Master Location"}
                                                                                </Typography>
                                                                                <div ref={MasterLocationCodeRef}>
                                                                                <CustomTextField
                                                                                    id="outlined-basic"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    className={`Extrasize ${ isMasterLocationEmpty ? "errorEmpty" : "" }`}
                                                                                
                                                                                    fullWidth
                                                                                    value={MasterLocationCode || ""}
                                                                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                                                                    placeholder="Select..."
                                                                                    rightIcons={[
                                                                                    <Iconify
                                                                                        icon="material-symbols:close"
                                                                                        onClick={handleCancelMasterLocation}
                                                                                    />,
                                                                                    <Iconify
                                                                                        icon="tabler:edit"
                                                                                        onClick={handleEditClickMasterLocation}
                                                                                    />,
                                                                                    
                                                                                    ]}
                                                                                />
                                                                                </div>
                                                                            </Stack>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>

                                                                {/* Stock No & Description */}
                                                                <Grid container spacing={2}>
                                                                   
                                                                    <Grid item xs={12} md={6}>
                                                                       
                                                                        <Box
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            width="100%"
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel("itm_mst_stockno") || "Stock No"}
                                                                                </Typography>
                                                                                {selected_Type?.label && selected_Type.label === "Serialize With Asset" ?
                                                                                (<Autocomplete
                                                                                    options={stockNo}
                                                                                    value = {stockNoText}
                                                                                    onChange={(event, value) => {
                                                                                        setStockNoText(value);
                                                                                        setIsStockNo(false);
                                                                                    }}
                                                                                    disableAnimation
                                                                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                                                                    renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                        {...params}
                                                                                        placeholder="Select..."
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                        className={`Extrasize ${
                                                                                            isStockNo
                                                                                            ? "errorEmpty"
                                                                                            : ""
                                                                                        }`}
                                                                                        style={{ width: "100%" }}
                                                                                        ref={autocompleteRef}
                                                                                        />
                                                                                    </div>
                                                                                    )}
                                                                                />
                                                                                )
                                                                                :
                                                                                (<TextField
                                                                                    id="outlined-basic"
                                                                                    size="small"
                                                                                    autoComplete="off"
                                                                                    variant="outlined"
                                                                                    value={(stockNoText ? stockNoText : "")}
                                                                                    onChange={(e) => {
                                                                                    const value = e.target.value.toUpperCase();
                                                                                    if (value.length <= 25) { setStockNoText(value); }
                                                                                        setIsStockNo(false);
                                                                                    }}
                                                                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                                                                    className={`Extrasize ${ isStockNo ? "errorEmpty" : "" }`}
                                                                                    fullWidth
                                                                                />
                                                                                )}
                                                                            </Stack>
                                                                            <Tooltip
                                                                                title="Asset History"
                                                                                placement="top"
                                                                                className="tooltipRht"
                                                                                disabled={Button_save == "Save"}
                                                                                arrow
                                                                                arrowTransform="translateY(4px)"
                                                                            >
                                                                                <IconButton onClick={handleToggle}>
                                                                                    <Iconify icon="pepicons-pencil:dots-y" />
                                                                                </IconButton>

                                                                            </Tooltip>
                                                                            <Menu
                                                                                anchorEl={anchorEl}
                                                                                open={Boolean(anchorEl)}
                                                                                className="AssetHistorycss"
                                                                                onClose={handleClose}
                                                                                anchorOrigin={{
                                                                                    vertical: 'bottom',
                                                                                    horizontal: 'right',
                                                                                }}
                                                                                transformOrigin={{
                                                                                    vertical: 'top',
                                                                                    horizontal: 'right',
                                                                                }}
                                                                            >
                                                                                <MenuItem >
                                                                                    <Iconify
                                                                                        icon="mingcute:time-fill" 
                                                                                        width={14} 
                                                                                        height={14}
                                                                                        style={{ marginRight: '5px' }}
                                                                                    /> Issue
                                                                                </MenuItem>
                                                                                <MenuItem >
                                                                                    <Iconify
                                                                                        icon="icon-park:history-query" 
                                                                                        width={14} 
                                                                                        height={14}
                                                                                        style={{ marginRight: '5px' }}
                                                                                    />Receive
                                                                                </MenuItem>
                                                                                <MenuItem >
                                                                                    <Iconify
                                                                                        icon="icon-park:history-query" 
                                                                                        width={14} 
                                                                                        height={14}
                                                                                        style={{ marginRight: '5px' }}
                                                                                    />Return to Store
                                                                                </MenuItem>
                                                                                <MenuItem >
                                                                                    <Iconify
                                                                                        icon="icon-park:history-query" 
                                                                                        width={14} 
                                                                                        height={14}
                                                                                        style={{ marginRight: '5px' }}
                                                                                    />Adjustment
                                                                                </MenuItem>
                                                                                <MenuItem >
                                                                                    <Iconify
                                                                                        icon="icon-park:history-query" 
                                                                                        width={14} 
                                                                                        height={14}
                                                                                        style={{ marginRight: '5px' }}
                                                                                    />Transfer
                                                                                </MenuItem>
                                                                                <MenuItem >
                                                                                    <Iconify
                                                                                        icon="icon-park:history-query" 
                                                                                        width={14} 
                                                                                        height={14}
                                                                                        style={{ marginRight: '5px' }}
                                                                                    />Reserve
                                                                                </MenuItem>
                                                                            </Menu>
                                                                            
                                                                        </Box>

                                                                        {/* Description*/}
                                                                        <Stack spacing={1}>
                                                                            <Typography 
                                                                                variant="subtitle2" 
                                                                                className="Requiredlabel">
                                                                                {findCustomizeLabel("itm_mst_desc") || "Description"}
                                                                            </Typography>
                                                                            <TextareaAutosize
                                                                                aria-label="empty textarea"
                                                                                minRows={6.5}
                                                                                value={Short_Description}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (value.length <= 80) {
                                                                                        setShort_Description(value);
                                                                                    }
                                                                                        setIsDescEmpty(false);
                                                                                }}

                                                                                //  className="TxtAra"
                                                                                className={`Extrasize ${ isDescEmpty ? "errorEmpty" : "TxtAra" }`}
                                                                            />

                                                                        </Stack>
                                                                       
                                                                    </Grid>
                                                                     
                                                                    <Grid item xs={12} md={6}>
                                                                        <Box
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                            display="flex"
                                                                            alignItems="center" 
                                                                            width="100%"
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" > 
                                                                                    {findCustomizeLabel("itm_mst_order_rule") || "Order Rule"} 
                                                                                </Typography>
                                                                                <Autocomplete
                                                                                    options={orderRule}
                                                                                    value={(selected_orderRule?.label || "") .split(" : ") .slice(0, 2) .join(" : ")}
                                                                                    onChange={(event, value) => {

                                                                                    console.log('Type 123:',value)
                                                                                    setSelected_orderRule(value);
                                                                                    setIsOrderRuleEmpty(false);
                                                                                    }}
                                                                                    disableAnimation
                                                                                    renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                        {...params}
                                                                                        placeholder="Select..."
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                        className={`Extrasize ${ isOrderRuleEmpty ? "errorEmpty" : "" }`}
                                                                                        style={{ width: "100%" }}
                                                                                        ref={autocompleteRef}
                                                                                        />
                                                                                    </div>
                                                                                    )}
                                                                                />
                                                                            </Stack>
                                                                        </Box>

                                                                        <Box
                                                                            rowGap={1}
                                                                            columnGap={1}
                                                                            display="grid"
                                                                            marginBottom={1}
                                                                        >
                                                                            <Stack spacing={1} sx={{ pb: 1.5 }}>

                                                                                <Typography variant="subtitle2" className="Requiredlabel">
                                                                                    {findCustomizeLabel("itm_mst_costcenter") || "Cost Center"}
                                                                                </Typography>
                                                                                <Autocomplete
                                                                                    options={costCenter}
                                                                                    value={(selected_costCenter?.label || "") .split(" : ") .slice(0, 2) .join(" : ")}
                                                                                    onChange={(event, value) => {
                                                                                        setSelected_costCenter(value);
                                                                                        setIsCostCenterEmpty(false);
                                                                                    }}
                                                                                    disableAnimation
                                                                                    renderInput={(params) => (
                                                                                    <div>
                                                                                        <TextField
                                                                                        {...params}
                                                                                        placeholder="Select..."
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                        className={`Extrasize ${
                                                                                            isCostCenterEmpty
                                                                                            ? "errorEmpty"
                                                                                            : ""
                                                                                        }`}
                                                                                        style={{ width: "100%" }}
                                                                                        ref={autocompleteRef}
                                                                                        />
                                                                                    </div>
                                                                                    )}
                                                                                />

                                                                            </Stack>
                                                                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel("itm_mst_account") || "Account"}
                                                                                </Typography>
                                                                                <Autocomplete
                                                                                    options={account}
                                                                                    value={(selected_account?.label || "") .split(" : ") .slice(0, 2) .join(" : ")}
                                                                                    onChange={(event, value) => {
                                                                                        setSelected_account(value);
                                                                                        setIsAccountEmpty(false);
                                                                                    }}
                                                                                    disableAnimation
                                                                                    renderInput={(params) => (
                                                                                        <div>
                                                                                        <TextField
                                                                                            {...params}
                                                                                            placeholder="Select..."
                                                                                            variant="outlined"
                                                                                            size="small"
                                                                                            className={`Extrasize ${
                                                                                            isAccountEmpty
                                                                                                ? "errorEmpty"
                                                                                                : ""
                                                                                            }`}
                                                                                            style={{ width: "100%" }}
                                                                                            ref={autocompleteRef}
                                                                                        />
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </Stack>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>

                                                                {/* Type & Master Location */}
                                                                <Grid container spacing={1}>
                                                                    {/* Type */}
                                                                    <Grid item xs={12} md={4}>
                                                                        {/* Type & Master Location */}
                                                                        <Box
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            width="100%"
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel("itm_det_issue_uom") || "Receive UOM"}
                                                                                </Typography>
                                                                                <Autocomplete
                                                                                options={issueUom}
                                                                                value={selected_issueUom?.label ?? ""}
                                                                                onChange={(event, value) => {
                                                                                    setSelected_IssueUom(value);
                                                                                    setIsIssueUomEmpty(false);
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                    {...params}
                                                                                    size="small"
                                                                                    placeholder="Select..."
                                                                                    variant="outlined"
                                                                                    fullWidth // Make it full-width
                                                                                    className={`Extrasize ${
                                                                                        isReciveUomEmpty ? "errorEmpty" : ""
                                                                                    }`}
                                                                                    />
                                                                                )}
                                                                                />
                                                                            </Stack>
                                                                        </Box>
                                                                       
                                                                    </Grid>
                                                                     {/* Master Location */}
                                                                    <Grid item xs={12} md={4}>
                                                                    <Box
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            width="100%"
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel("itm_det_rcv_uom") || "Receive UOM"}
                                                                                </Typography>
                                                                                <Autocomplete
                                                                                options={issueUom}
                                                                                value={selected_recivedUom?.label ?? ""}
                                                                                onChange={(event, value) => {
                                                                                    setSelected_RecivedUom(value);
                                                                                    setIsReciveUomEmpty(false);
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                    {...params}
                                                                                    size="small"
                                                                                    placeholder="Select..."
                                                                                    variant="outlined"
                                                                                    fullWidth // Make it full-width
                                                                                    className={`Extrasize ${
                                                                                        isIssueUomEmpty ? "errorEmpty" : ""
                                                                                    }`}
                                                                                    />
                                                                                )}
                                                                                />
                                                                            </Stack>
                                                                        </Box>
                                                                    </Grid>
                                                                    {/* Master Location */}
                                                                    <Grid item xs={12} md={4}>
                                                                        <Box
                                                                            rowGap={2}
                                                                            columnGap={1}
                                                                            display="flex"
                                                                            alignItems="center" 
                                                                            width="100%"
                                                                        >
                                                                            <Stack flexGrow={1} spacing={1} sx={{ pb: 1.5 }}>
                                                                                <Typography variant="subtitle2" className="Requiredlabel" >
                                                                                    {findCustomizeLabel( "itm_det_part_deac_status" ) || "Part Deac Status"}
                                                                                </Typography>
                                                                                <Autocomplete
                                                                                options={partDeacStatus}
                                                                                value={selected_partDeacStatus?.label ?? ""}
                                                                                onChange={(event, value) => {
                                                                                    setSelected_partDeacStatus(value);
                                                                                    setIsPartDeacEmpty(false);
                                                                                }}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                    {...params}
                                                                                    size="small"
                                                                                    placeholder="Select..."
                                                                                    variant="outlined"
                                                                                    fullWidth // Make it full-width
                                                                                    className={`Extrasize ${
                                                                                        isPartDeacEmpty ? "errorEmpty" : ""
                                                                                    }`}
                                                                                    />
                                                                                )}
                                                                                />
                                                                            </Stack>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>

                                                            
                                                        </Grid>
                                                        <Grid xs={12} md={2} className="imgGird">
                                                            <Card sx={{ pt: 2, pb: 0, px: 3 }}>
                                                                <Box
                                                                    sx={{
                                                                    mb: 5,
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <div className="col-md-2">
                                                                        <div className="row">
                                                                            <div className="row ImgShowMobile">
                                                                                <div>
                                                                                    <label htmlFor="upload-button">
                                                                                        {getDbImg && getDbImg.length > 0 ? (
                                                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                                                                                                {/* File Display (Icon or Image) */}
                                                                                                {getDbImg[0].file_name.toLowerCase().endsWith(".pdf") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFilePdf}
                                                                                                        onClick={() => openPDFInNewTab(getDbImg[0].attachment)}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                        className="fntpdf"
                                                                                                    />
                                                                                                ) : getDbImg[0].file_name.toLowerCase().endsWith(".docx") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFileWord}
                                                                                                        onClick={() => openDocxInNewTab(getDbImg[0].attachment)}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                        className="fntdocx"
                                                                                                    />
                                                                                                ) : getDbImg[0].file_name.toLowerCase().endsWith(".php") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFileCode}
                                                                                                        onClick={() => openPhpInNewTab(getDbImg[0].attachment)}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                        className="fntphp"
                                                                                                    />
                                                                                                ) : getDbImg[0].file_name.toLowerCase().endsWith(".log") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFileAlt}
                                                                                                        onClick={() => openLogInNewTab(getDbImg[0].attachment)}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                        className="fntlog"
                                                                                                    />
                                                                                                ) : getDbImg[0].file_name.toLowerCase().endsWith(".xlsx") ? (
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={faFileExcel}
                                                                                                        onClick={() => openXlsxInNewTab(getDbImg[0].attachment)}
                                                                                                        style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                        className="fntxlsx"
                                                                                                    />
                                                                                                ) : getDbImg[0].file_name.toLowerCase().endsWith(".txt") ? (
                                                                                                    <span style={{ fontSize: "14px", fontWeight: 600, }} > File preview not supported. </span>
                                                                                                ) :  
                                                                                                (
                                                                                                    <img
                                                                                                        src={ getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` : "" }
                                                                                                        className="imgCurPont"
                                                                                                        alt="File Thumbnail"
                                                                                                        onClick={openSaveImg}
                                                                                                        style={{ width: "auto", height: "150px", cursor: "pointer", }}
                                                                                                    />
                                                                                                )}
                                                                                        
                                                                                                {/* Delete Button */}
                                                                                                <div className="col btnCenter">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="btn dlt"
                                                                                                        // onClick={() => handleDeleteImgApi(getDbImg[0].RowID)}
                                                                                                        onClick={() => {
                                                                                                            setIsFormFiled(true);
                                                                                                            handleDeleteImgApi(getDbImg[0].RowID);
                                                                                                        }}
                                                                                                        style={{
                                                                                                            display: "flex",
                                                                                                            alignItems: "center",
                                                                                                            justifyContent: "center",
                                                                                                            marginTop: "15px", // Adds space between the file and the delete button
                                                                                                        }}
                                                                                                    >
                                                                                                        <Iconify icon="fluent:delete-48-filled" style={{ fontSize: "24px" }} /> Delete
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                            

                                                                                        ) : image.preview ? (
                                                                                            <div>
                                                                                                {image.raw?.type?.startsWith("image/") ? (
                                                                                                    <img
                                                                                                        src={image.preview}
                                                                                                        alt="preview"
                                                                                                        className="imgCurPont"
                                                                                                        onClick={openSaveImg}
                                                                                                        style={{ width: "200px", height: "180px", cursor: "pointer" }} // Adjust size as needed
                                                                                                    />

                                                                                                ):(
                                                                                                    <div>
                                                                                                        {image.raw?.name?.toLowerCase().endsWith(".pdf") ? (
                                                                                                        <FontAwesomeIcon
                                                                                                            icon={faFilePdf}
                                                                                                            style={{ width: "auto", height: "70px", cursor: "pointer", }}
                                                                                                        />
                                                                                                        ) : image.raw?.name?.toLowerCase().endsWith(".docx") ? (
                                                                                                            <FontAwesomeIcon
                                                                                                                icon={faFileWord}
                                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                            />
                                                                                                        ) : image.raw?.name?.toLowerCase().endsWith(".xlsx") ? (
                                                                                                            <FontAwesomeIcon
                                                                                                                icon={faFileExcel}
                                                                                                                style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <span style={{ fontSize: "14px", fontWeight: 600, }} > File preview not supported. </span>
                                                                                                        )}
                                                                                                    </div>

                                                                                                )}
                                                                                                {/* Delete button */}
                                                                                                <div className="col btnCenter">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="btn dlt"
                                                                                                        onClick={handleClearImg}
                                                                                                        style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px", }}
                                                                                                    >
                                                                                                        <Iconify icon="fluent:delete-48-filled" style={{ marginRight: "5px" }} /> Delete
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                            
                                                                                        ) : (
                                                                                            <>
                                                                                            <span className="fa-stack fa-2x mb-2">
                                                                                                <img
                                                                                                src={require("../../../../assets/img/Add_Image_icon.png")}
                                                                                                className="sliderimg2"
                                                                                                onClick={() => {
                                                                                                    setIsFormFiled(true);
                                                                                                    handleImgChangeSingle2();
                                                                                                }}
                                                                                                width="200"
                                                                                                height="180"
                                                                                                alt=""
                                                                                                />
                                                                                            </span>
                                                                                            </>
                                                                                        )}
                                                                                    </label>
                                                                                    {getDbImg && getDbImg.length > 0 ? (
                                                                                        <div>

                                                                                        </div>
                                                                                    ):(
                                                                                        <div>
                                                                                            <input
                                                                                                type="file"
                                                                                                id="upload-button"
                                                                                                accept="image/*"
                                                                                                disabled={disabledBtn}
                                                                                                style={{ display: "none" }}
                                                                                                onChange={handleImgChangeSingle}
                                                                                            />

                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <BootstrapDialog
                                                                                    onClose={handleClosedd2}
                                                                                    aria-labelledby="customized-dialog-title"
                                                                                    open={showdd2}
                                                                                >
                                                                                    <IconButton
                                                                                        aria-label="close"
                                                                                        onClick={handleClosedd2}
                                                                                        sx={{
                                                                                        position: "absolute",
                                                                                        right: 8,
                                                                                        top: 8,
                                                                                        color: (theme) =>
                                                                                            theme.palette.grey[500],
                                                                                        }}
                                                                                    >
                                                                                        X
                                                                                    </IconButton>
                                                                                    <DialogContent
                                                                                        dividers
                                                                                        style={{
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        {getDbImg && getDbImg.length > 0 ? (
                                                                                        <div>
                                                                                            <img
                                                                                            src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
                                                                                            alt="dummy"
                                                                                            className="dummyImg"
                                                                                            onClick={openSaveImg}
                                                                                            />
                                                                                        </div>
                                                                                        ) : (
                                                                                        <img
                                                                                            src={image.preview}
                                                                                            alt="dummy"
                                                                                            style={{ height: "50%", width: "50%", }}
                                                                                            onClick={openSaveImg}
                                                                                            className="dummyImg"
                                                                                        />
                                                                                        )}
                                                                                    </DialogContent>

                                                                                </BootstrapDialog>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>

                {Tabvalue === 0 &&  
                (   
                    <>
                        <div
                            className="MainOrderFromGdForm"
                            style={{ backgroundColor: "white",marginTop:"10px"}}
                        >
                            <Grid container spacing={0}>
                                <Grid xs={12} md={12}>
                                    <Card sx={{ padding: "10px 24px 10px 24px" }}>
                                        <div style={{ display: "flex" }}>
                                            <button className="ToggleBttnIcon" onClick={toggleDiv}>
                                                <Iconify
                                                icon="fluent-mdl2:pen-workspace"
                                                style={{ marginRight: "5px", width: "20px" }}
                                                />{" "}
                                                Inventory Details
                                                {isOpenWork ? (
                                                <Iconify
                                                    icon="ep:arrow-up-bold"
                                                    style={{ marginLeft: "4px", width: "12px" }}
                                                />
                                                ) : (
                                                <Iconify
                                                    icon="ep:arrow-down-bold"
                                                    style={{ marginLeft: "4px", width: "12px" }}
                                                />
                                                )}
                                            </button>
                                        </div>
                                        {isOpenWork && (
                                            <Grid container spacing={0}>
                                                <Grid xs={12} md={12}>

                                                    {/* Commodity & Prder Point */}
                                                    <Box
                                                        rowGap={2}
                                                        columnGap={2}
                                                        display="grid"
                                                        gridTemplateColumns={{
                                                            xs: "repeat(1, 1fr)",
                                                            sm: "repeat(2, 1fr)",
                                                        }}
                                                        width="100%"
                                                        marginBottom={1.5}
                                                    >
                                                        <Box
                                                            rowGap={2}
                                                            columnGap={1}
                                                            display="flex"
                                                            alignItems="center"
                                                            width="100%"
                                                        >
                                                            <Stack flexGrow={1} spacing={1}>
                                                                <Typography variant="subtitle2" className="" >
                                                                    {findCustomizeLabel("itm_mst_com_code") || "Commodity Code"}
                                                                </Typography>
                                                                <Autocomplete
                                                                options={commodity}
                                                                value={(selected_Commodity?.label || "") .split(" : ") .slice(0, 2) .join(" : ")}
                                                                onChange={handleStatusChange}
                                                                disableAnimation
                                                                renderInput={(params) => (
                                                                    <div>
                                                                        <TextField
                                                                            {...params}
                                                                            placeholder="Select..."
                                                                            variant="outlined"
                                                                            size="small"
                                                                            className={`Extrasize ${ isCommodityCodeEmpty ? "errorEmpty" : "" }`}
                                                                            ref={autocompleteRef}
                                                                        />
                                                                    </div>
                                                                )}
                                                                />

                                                            </Stack>
                                                        </Box>
                                                        <Box
                                                            rowGap={2}
                                                            columnGap={1}
                                                            display="flex"
                                                            alignItems="center"
                                                            width="100%"
                                                            >
                                                            <Stack flexGrow={1} spacing={1}>
                                                                <Typography variant="subtitle2" className="">
                                                                {findCustomizeLabel("itm_det_order_pt") || "Order Point"}
                                                                </Typography>

                                                                <TextField
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                                size="small"
                                                                value={orderPoint}
                                                                onChange={(e) => { handleNumericInputChange(e, setOrderPoint); }}
                                                                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                                fullWidth
                                                                />
                                                            </Stack>
                                                            
                                                        </Box>
                                                    </Box>

                                                    {/* Stock Group & Maximum */}
                                                    <Box
                                                        rowGap={2}
                                                        columnGap={2}
                                                        display="grid"
                                                        gridTemplateColumns={{
                                                            xs: "repeat(1, 1fr)",
                                                            sm: "repeat(2, 1fr)",
                                                        }}
                                                        marginBottom={0}
                                                    >
                            
                                                        <Box
                                                            rowGap={1}
                                                            columnGap={1}
                                                            display="grid"
                                                            marginBottom={1}
                                                        >
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" > 
                                                                    {findCustomizeLabel("itm_mst_itm_grp") || "Stock Group"} 
                                                                </Typography>
                                                                <Autocomplete
                                                                options={stockGroup}
                                                                value={(selected_stockGroup?.label || "") .split(" : ") .slice(0, 2) .join(" : ")}
                                                                onChange={(event, value) => {
                                                                    setSelected_stockGroup(value);
                                                                    setIsStockGroupEmpty(false);
                                                                }}
                                                                disableAnimation
                                                                renderInput={(params) => (
                                                                    <div>
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Select..."
                                                                        variant="outlined"
                                                                        size="small"
                                                                        className={`Extrasize ${ isStockGroupEmpty ? "errorEmpty" : "" }`}
                                                                        style={{ width: "100%" }}
                                                                        ref={autocompleteRef}
                                                                    />
                                                                    </div>
                                                                )}
                                                                />
                                                            </Stack>
                                                        </Box>

                                                        <Box
                                                        rowGap={1}
                                                        columnGap={1}
                                                        display="grid"
                                                        marginBottom={1}
                                                        >
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" className="" > 
                                                                    {findCustomizeLabel("itm_det_maximum") || "Maximum"} 
                                                                </Typography>
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={maximumInvtr}
                                                                    onChange={(e) => { handleNumericInputChange(e, setMaximumInvtr); }}
                                                                    InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                                    className={ errorField === "ast_det_mfg_cd" ? "erroBorderadd" : "" }
                                                                    fullWidth
                                                                />
                                                            </Stack>
                                                        </Box>
                                                    </Box>

                                                    {/* Part No & Storage Type */}
                                                    <Box
                                                        rowGap={2}
                                                        columnGap={2}
                                                        display="grid"
                                                        gridTemplateColumns={{
                                                        xs: "repeat(1, 1fr)",
                                                        sm: "repeat(2, 1fr)",
                                                        }}
                                                        marginBottom={0}
                                                    >
                            
                                                        <Box
                                                            rowGap={1}
                                                            columnGap={1}
                                                            display="grid"
                                                            marginBottom={1}
                                                        >
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" className="" > 
                                                                    {findCustomizeLabel("itm_mst_partno") || "Part No"} 
                                                                </Typography>
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    size="small"
                                                                    variant="outlined"
                                                                    value={PartNo}
                                                                    onChange={(e) => { const value = e.target.value; 
                                                                        if (value.length <= 25) 
                                                                        { 
                                                                            setPartNo(value); 

                                                                        } 
                                                                }}
                                                                    className={ errorField === "itm_mst_partno" ? "erroBorderadd" : "" }
                                                                    fullWidth
                                                                />
                                                            </Stack>
                                                        </Box>

                                                        <Box
                                                        rowGap={1}
                                                        columnGap={1}
                                                        display="grid"
                                                        marginBottom={1}
                                                        >
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" className="" > 
                                                                    {findCustomizeLabel("itm_det_storage_type") || "Storage Type"} 
                                                                </Typography>
                                                                <Autocomplete
                                                                    options={storageType}
                                                                    value={selected_storageType?.label ?? ""}
                                                                    onChange={(event, value) => {
                                                                        setSelected_StorageType(value);
                                                                        setIsisStorageTypeEmpty(false);
                                                                    }}
                                                                    renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        size="small"
                                                                        placeholder="Select..."
                                                                        variant="outlined"
                                                                        className={`Extrasize ${ isStorageTypeEmpty ? "errorEmpty" : "" }`}
                                                                        fullWidth // Make it full-width
                                                                    />
                                                                    )}
                                                                />
                                                            </Stack>
                                                        </Box>

                                
                                                    </Box>

                                                    {/* Description & Cost Center & Account */} 
                                                    <Box
                                                    rowGap={2}
                                                    columnGap={2}
                                                    display="grid"
                                                    gridTemplateColumns={{
                                                        xs: "repeat(1, 1fr)",
                                                        sm: "repeat(2, 1fr)",
                                                    }}
                                                    marginBottom={0}
                                                    >
                                                        <Stack spacing={1}>
                                                            <Typography variant="subtitle2" className="" > 
                                                                {findCustomizeLabel("itm_mst_ext_desc") || "Extended Description"} 
                                                            </Typography>
                                                            <TextareaAutosize
                                                            aria-label="empty textarea"
                                                            placeholder=""
                                                            minRows={6.5}
                                                            value={Long_Description}
                                                            onChange={(e) => { const value = e.target.value; 
                                                                if (value.length <= 3200) { 
                                                                    setLong_Description(value); 
                                                                } setErrorField(false); 
                                                            }}
                                                            className={ errorField === "itm_mst_ext_desc" ? "erroBorderadd" : "TxtAra" }
                                                            />
                                                        </Stack>
                                                        <Box
                                                            rowGap={1}
                                                            columnGap={1}
                                                            display="grid"
                                                            marginBottom={1}
                                                        >
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" className="" > 
                                                                    {findCustomizeLabel("itm_det_cube") || "Cube"} 
                                                                </Typography>
                                                                <TextField
                                                                    id="outlined-basic"
                                                                    size="small"
                                                                    placeholder=""
                                                                    variant="outlined"
                                                                    value={Cube}
                                                                    onChange={(e) => { handleNumericInputChange(e, setCube); }}
                                                                    InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                                    className={ errorField === "itm_det_cube" ? "erroBorderadd" : "" }
                                                                    fullWidth
                                                                />
                                    
                                                            </Stack>
                                                            <Stack spacing={1}>
                                                                <Typography variant="subtitle2" className="" >
                                                                {findCustomizeLabel("itm_det_shelf_life") || "Shelf Life"}
                                                                </Typography>
                                                                <TextField
                                                                id="outlined-basic"
                                                                size="small"
                                                                variant="outlined"
                                                                value={shelfLife}
                                                                onChange={(e) => { handleNumericInputChange(e, setshelfLife); }}
                                                                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                                className={ errorField === "itm_det_shelf_life" ? "erroBorderadd" : "" }
                                                                fullWidth
                                                                />
                                                            </Stack>
                                                        </Box>
                                                    </Box>

                                                </Grid>
                                            </Grid>
                                        )}
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                        <Grid container spacing={0} sx={{pb:1.5,pt:1.5}}>
                            <Grid xs={12} md={12}>
                                <Card sx={{ padding: "10px 24px 10px 24px" }}>
                                    <div style={{ display: "flex",marginTop:"10px"}}>
                                        <button className="ToggleBttnIcon" onClick={toggleDiv2}>
                                            <Iconify
                                                className="IconCss"
                                                icon="tdesign:calculation-1"
                                                style={{ marginRight: "4px" }}
                                            />
                                            Reorder Calculation
                                            {isOpenWork2 ? (
                                            <Iconify
                                                icon="ep:arrow-up-bold"
                                                style={{ marginLeft: "4px", width: "12px" }}
                                            />
                                            ) : (
                                            <Iconify
                                                icon="ep:arrow-down-bold"
                                                style={{ marginLeft: "4px", width: "12px" }}
                                            />
                                            )}
                                        </button>
                                    </div>
                                    {isOpenWork2 && (
                                        <Grid container spacing={2} sx={{ mt: 1.5, mb: 2.5 }}>
                                            <TableContainer component={Paper} sx={{ border: 1, borderColor: "grey.400" }} >
                                                <Table sx={{ minWidth: 700, borderCollapse: "collapse",marginTop:2 }} aria-label="spanning table" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="left" colSpan={1} sx={{ borderBottom: "1px solid #00000017" }} >Details </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >Price </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} > Total On-Hand: </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >{TotalOnHand}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} >Reserved:</TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >{Reserved +' (-)'}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} > Shortage: </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} > {Shortage +' (-)'}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} > Quantity Available: </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >{Qty_Available}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} > PR Outstanding: </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >{PR_Outstanding +' (+)'}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} > PO Outstanding: </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >{PO_Outstanding +' (+)'}</TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell sx={{ borderBottom: "1px solid #00000017" }} > Reorder SubTotal: </TableCell>
                                                            <TableCell align="right" sx={{ borderBottom: "1px solid #00000017" }} >{Reoreder_SubTotal} </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            
                                        </Grid>
                                    )}

                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                {/* Financial */}
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 1}
                >
                    <Grid container>
                        <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                            <Card className="AssetDetail">
                                <Grid container spacing={2}>
                                    {/* Financial Part 1 */}
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700,mt:2 }} aria-label="spanning table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Costing Rule</TableCell>
                                                    <TableCell align="center">Item Cost (A)</TableCell>
                                                    <TableCell align="center">Total On Hand (B)</TableCell>
                                                    <TableCell align="center">Total Repair Location (C)</TableCell>
                                                    <TableCell align="center">Value A*(B-C)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {CostingRule.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>
                                                    <Radio
                                                        checked={selectedRowd === row.id}
                                                        onChange={() => handleRadioChange(row.id,row.code)}
                                                        value={row.id}
                                                        name="costing-rule-radio"
                                                        inputProps={{ 'aria-label': row.costingRule }}
                                                    />
                                                    {row.costingRule}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            value={row.total_a}
                                                            onChange={(e) => handleInputChange(row.id, e.target.value)}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            type="text"
                                                            disabled={selectedRowd !== row.id}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            value={row.total_b}
                                                            defaultValue={row.totalOnHand}
                                                            type="number"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                value={row.total_c}
                                                                defaultValue={row.totalRepairLocation}
                                                                type="number"
                                                                disabled
                                                            />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            value={row.total}
                                                            defaultValue={row.value}
                                                            type="number"
                                                            disabled
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                
                                            ))}
                                            {selectedRowd && (
                                                <>
                                                    <TableRow>
                                                        <TableCell colSpan={4}>Surcharge</TableCell>
                                                        <TableCell align="right">Surcharge Value</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell colSpan={4}>0%</TableCell>
                                                        <TableCell align="right">0.00</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell colSpan={4}>Item Cost:</TableCell>
                                                        <TableCell align="right">
                                                        {CostingRule.find(item => item.id === selectedRowd) ? CostingRule.find(item => item.id === selectedRowd).itemCost : "0.00"}

                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell colSpan={4}>Issue Price:</TableCell>
                                                        <TableCell align="right">
                                                        {CostingRule.find(item => item.id === selectedRowd) ? CostingRule.find(item => item.id === selectedRowd).issuePrice : "0.00"}</TableCell>
                                                    </TableRow>
                                                </>
                                            )}

                                            </TableBody>
                                        </Table>

                                    </TableContainer>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Financial Part 2 */}
                    <Grid container spacing={0} sx={{pb:1.5}}>
                        <Grid xs={12} md={12}>
                            <Card sx={{ padding: "10px 24px 10px 24px"}}>
                                <div style={{ display: "flex",marginTop:"10px"}}>
                                    <button className="ToggleBttnIcon" onClick={toggleDiv}>
                                        <Iconify
                                            icon="fluent-mdl2:pen-workspace"
                                            style={{ marginRight: "5px", width: "20px" }}
                                        />Additional Information
                                        {isOpenWork ? (
                                        <Iconify
                                            icon="ep:arrow-up-bold"
                                            style={{ marginLeft: "4px", width: "12px" }}
                                        />
                                        ) : (
                                        <Iconify
                                            icon="ep:arrow-down-bold"
                                            style={{ marginLeft: "4px", width: "12px" }}
                                        />
                                        )}
                                    </button>
                                </div>
                                {isOpenWork && (
                                    <Grid container spacing={3}>

                                        <Grid item xs={12} md={6}>
                                            <Stack
                                                spacing={1}
                                                sx={{
                                                pb: 2,
                                                display: "flex",
                                                flexDirection: "row", // Set the flex direction to row
                                                alignItems: "center", // Center items vertically
                                                justifyContent: "space-between", // Create space between items
                                                }}
                                            >
                                                <Typography variant="subtitle2" className="" > 
                                                    {findCustomizeLabel("itm_det_auto_spare") || "Auto Spare"} 
                                                </Typography>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={!!autoSpare}
                                                        onChange={(e) => { setAutoSpare(e.target.checked ? 1 : 0); }}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                                
                                            </Stack>

                                            <Stack
                                                spacing={1}
                                                sx={{
                                                pb: 2,
                                                display: "flex",
                                                flexDirection: "row", // Set the flex direction to row
                                                alignItems: "center", // Center items vertically
                                                justifyContent: "space-between", // Create space between items
                                                }}
                                            >
                                                <Typography variant="subtitle2" className="" > 
                                                    {findCustomizeLabel("itm_det_critical_spare") || "Critical Spare"} 
                                                </Typography>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={criticalSpare}
                                                        onChange={(e) => { setcriticalSpare(e.target.checked ? 1 : 0); }}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                                
                                            </Stack>

                                            <Stack
                                                spacing={1}
                                                sx={{
                                                pb: 2,
                                                display: "flex",
                                                flexDirection: "row", // Set the flex direction to row
                                                alignItems: "center", // Center items vertically
                                                justifyContent: "space-between", // Create space between items
                                                }}
                                            >
                                                <Typography variant="subtitle2" className="" > 
                                                    {findCustomizeLabel("itm_det_hzd_mtl") || "Hazardous Material"} 
                                                </Typography>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={HazardousMaterial}
                                                        onChange={(e) => { setHazardousMaterial(e.target.checked ? 1 : 0); }}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                                
                                            </Stack>

                                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                <Typography variant="subtitle2" className="Requiredlabel" > 
                                                    {findCustomizeLabel("itm_det_abc_class") || "ABC Class"} 
                                                </Typography>
                                                <TextField
                                                id="outlined-basic"
                                                size="small"
                                                value={abcClass}
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase().slice(0, 1);
                                                    if (value.length <= 1) {
                                                        setAbcClass(value);
                                                    }
                                                }}
                                                className={ errorField === "itm_det_abc_class" ? "erroBorderadd" : "TxtAra" }
                                                variant="outlined"
                                                fullWidth
                                                inputProps={{ maxLength: 1, style: { textTransform: 'uppercase' } }}
                                                />
                                            </Stack>

                                        </Grid>

                                        <Grid item xs={12} md={6}>

                                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                <Typography variant="subtitle2" className="">
                                                    {findCustomizeLabel("itm_det_tax_cd") || "Tax Code"}
                                                </Typography>
                                                <div ref={MasterLocationCodeRef}>
                                                <CustomTextField
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    size="small"
                                                    className={`ExtrasizeDisable ${ isTaxCodeEmpty ? "errorEmpty" : "" }`}
                                                    fullWidth
                                                    value={taxCode || ""}
                                                    disabled
                                                    placeholder="Select..."
                                                    rightIcons={[
                                                    <Iconify
                                                        icon="material-symbols:close"
                                                        onClick={handleCancelTaxCode}
                                                    />,
                                                    <Iconify
                                                        icon="tabler:edit"
                                                        onClick={handleEditClickTaxCode}
                                                    />,
                                                    ]}
                                                />
                                                </div>
                                            </Stack>

                                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                <Typography variant="subtitle2" className="" >
                                                    {findCustomizeLabel( "itm_det_acct_type" ) || "Account Type"}
                                                </Typography>
                                                <Autocomplete   
                                                    options={accountType}
                                                    value={selected_AccountType?.label ?? ""}
                                                    onChange={(event, value) => { setSelected_AccountType(value) }}
                                                    disabled={RowID !== "" && RowID !== null && RowID !== undefined}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            placeholder="Select..."
                                                            variant="outlined"
                                                            fullWidth 
                                                            className={`Extrasize ${ isAccountTypeEmpty ? "errorEmpty" : "" }`}
                                                        />
                                                    )}
                                                />
                                            </Stack>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={1}>
                                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                        <Typography variant="subtitle2">
                                                            {findCustomizeLabel("itm_det_ytd_usage") || "YTD Usage:"}
                                                        </Typography>
                                                    
                                                        <TextField
                                                            name="name"
                                                            size="small"
                                                            disabled
                                                            value={ytdUsage}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            className="ExtrasizeDisable"
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12} md={1}>
                                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                        <Typography variant="subtitle2">
                                                            {findCustomizeLabel("itm_det_ytd_turns") || "YTD Turns:"}
                                                        </Typography>
                                                        
                                                        <TextField
                                                            name="name"
                                                            size="small"
                                                            disabled
                                                            value={ytdTurns}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            className="ExtrasizeDisable"
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12} md={1}>
                                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                        <Typography variant="subtitle2">
                                                            {findCustomizeLabel("itm_det_ytd_stockouts") || "YTD Stockouts:"}
                                                        </Typography>
                                                        <TextField
                                                            name="name"
                                                            size="small"
                                                            disabled
                                                            value={ytdStockouts}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            className="ExtrasizeDisable"
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={1}>
                                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                        <Typography variant="subtitle2">
                                                            {findCustomizeLabel("itm_det_lastyr_usage") || "Last Year Usage:"}
                                                        </Typography>
                                                    
                                                        <TextField
                                                            name="name"
                                                            size="small"
                                                            disabled
                                                            value={lastyrUsage}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            className="ExtrasizeDisable"
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12} md={1}>
                                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                        <Typography variant="subtitle2">
                                                            {findCustomizeLabel("itm_det_lastyr_turns") || "Last Year Turns:"}
                                                        </Typography>
                                                        
                                                        <TextField
                                                            name="name"
                                                            size="small"
                                                            disabled
                                                            value={lastyrTurns}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            className="ExtrasizeDisable"
                                                        />
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12} md={1}>
                                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                        <Typography variant="subtitle2">
                                                            {findCustomizeLabel("itm_det_lastyr_stkouts") || "Last Year Stockouts:"}
                                                        </Typography>
                                                        <TextField
                                                            name="name"
                                                            size="small"
                                                            disabled
                                                            value={lastyrStkouts}
                                                            InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                            className="ExtrasizeDisable"
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                )}
                            </Card>
                        </Grid>

                    </Grid>

                    {/* Financial Part 3 */}
                    <Grid container spacing={0} sx={{pb:1.5}}>
                        <Grid xs={12} md={12}>
                            <Card sx={{ padding: "10px 24px 10px 24px"}}>
                                <div style={{ display: "flex",marginTop:"10px"}}>
                                    <button className="ToggleBttnIcon" onClick={toggleDiv2}>
                                        <Iconify
                                            icon="fluent-mdl2:pen-workspace"
                                            style={{ marginRight: "5px", width: "20px" }}
                                        />UDF – Text
                                        {isOpenWork2 ? (
                                        <Iconify
                                            icon="ep:arrow-up-bold"
                                            style={{ marginLeft: "4px", width: "12px" }}
                                        />
                                        ) : (
                                        <Iconify
                                            icon="ep:arrow-down-bold"
                                            style={{ marginLeft: "4px", width: "12px" }}
                                        />
                                        )}
                                    </button>
                                </div>
                                {isOpenWork2 && (

                                    <Grid>
                                        <Grid container spacing={2}>
                                            {/* UDF Text 02 - 03 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar1") || "UDF Text1"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        
                                                        fullWidth
                                                        value={UDFText_1}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_1(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar1" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar2") || "UDF Text2"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_2}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_2(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar2" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>
                                            
                                            {/* UDF Text 07 - 08 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar6") || "UDF Text6"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_6}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_6(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar6" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar7") || "UDF Text7"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_7}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_7(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar7" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>
                                        
                                            {/* UDF Text 04- 05 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar3") || "UDF Text3"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_3}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_3(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar3" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar4") || "UDF Text4"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_4}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_4(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar4" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>

                                            {/* UDF Text 09 - 10 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar8") || "UDF Text8"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_8}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_8(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar1" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar9") || "UDF Text9"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_9}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_9(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar9" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>
                                            {/* UDF Text 05*/}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar5") || "UDF Text5"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_5}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_5(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar1" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>
                                            {/* UDF Text 11*/}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_varchar10") || "UDF Text10"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={UDFText_10}
                                                        onChange={(e) => {
                                                        const value = e.target.value;
                                                            if (value.length <= 100) {
                                                                setUDFText_10(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                        errorField === "itm_det_varchar1" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2}>
                                            {/* UDF Text 11*/}
                                            <Grid item xs={12}>
                                            <Box
                                                rowGap={0}
                                                columnGap={0}
                                                display="grid"
                                                marginBottom={1}
                                            >
                                                <Stack spacing={1}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_note1") || "UDF Note1"} 
                                                    </Typography>
                                                    <TextareaAutosize
                                                        aria-label="empty textarea"
                                                        placeholder=""
                                                        minRows={6.5}
                                                        value={UDFNote_1}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value.length <= 1000) {
                                                                setUDFNote_1(value);
                                                            }
                                                        
                                                        }}
                                                        className={
                                                            errorField === "ast_mst_asset_longdesc"
                                                            ? "erroBorderadd"
                                                            : "TxtAra"
                                                        }
                                                    />
                                                </Stack>
                                            </Box>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                )}
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Financial Part 4 */}
                    <Grid container spacing={0} sx={{pb:1.5}}>
                        <Grid xs={12} md={12}>
                            <Card sx={{ padding: "10px 24px 10px 24px"}}>
                                <div style={{ display: "flex",marginTop:"10px"}}>
                                    <button className="ToggleBttnIcon" onClick={toggleDiv3}>
                                        <Iconify
                                            icon="fluent-mdl2:pen-workspace"
                                            style={{ marginRight: "5px", width: "20px" }}
                                        />UDF – Datetime & numberic
                                        {isOpenWork3 ? (
                                        <Iconify
                                            icon="ep:arrow-up-bold"
                                            style={{ marginLeft: "4px", width: "12px" }}
                                        />
                                        ) : (
                                        <Iconify
                                            icon="ep:arrow-down-bold"
                                            style={{ marginLeft: "4px", width: "12px" }}
                                        />
                                        )}
                                    </button>
                                </div>
                                {isOpenWork3 && (

                                    <Grid>
                                        <Grid container spacing={2}>
                                            {/* UDF Number 01 - 02 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_numeric1") || "UDF Numeric1"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder=".0000"
                                                        autoComplete="off"
                                                        fullWidth
                                                        value={UDFNumeric_1}
                                                        onChange={(e) => {
                                                            handleNumericInputChange(e, setUDFNumeric_1);
                                                            setErrorField(null); 
                                                        }}
                                                        InputProps={{
                                                            inputProps: { style: { textAlign: 'right' } }
                                                        }}
                                                        className={
                                                        errorField === "itm_det_numeric1" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_numeric2") || "UDF Numeric2"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder=".0000"
                                                        autoComplete="off"
                                                        fullWidth
                                                        value={UDFNumeric_2}
                                                        onChange={(e) => {
                                                            handleNumericInputChange(e, setUDFNumeric_2);
                                                            setErrorField(null); 
                                                        }}
                                                        InputProps={{
                                                            inputProps: { style: { textAlign: 'right' } }
                                                        }}
                                                        className={
                                                        errorField === "itm_det_numeric2" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                            </Grid>
                                            
                                            {/* UDF DateTime 01 - 02 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_datetime1") || "UDF Date1"} 
                                                    </Typography>

                                                    <AntDatePicker
                                                        value={UDFDateTime_1 ? dayjs(UDFDateTime_1) : null}
                                                        format="DD/MM/YYYY HH:mm" 
                                                        placeholder="DD/MM/YYYY HH:mm"
                                                        showTime
                                                        allowClear={false}
                                                        onChange={(newDate) => {
                                                        if (newDate && newDate.isValid()) {
                                                            const nativeDate = newDate.toDate(); 
                                                            setUDFDateTime_1(nativeDate);
                                                        } else {
                                                            setUDFDateTime_1(null);
                                                        }
                                                        setErrorField(null);
                                                        
                                                        }}
                                                    
                                                    />
                                                    
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_datetime2") || "UDF Date2"} 
                                                    </Typography>

                                                    <AntDatePicker
                                                        value={UDFDateTime_2 ? dayjs(UDFDateTime_2) : null}
                                                        format="DD/MM/YYYY HH:mm" 
                                                        placeholder="DD/MM/YYYY HH:mm"
                                                        showTime
                                                        allowClear={false}
                                                        onChange={(newDate) => {
                                                        if (newDate && newDate.isValid()) {
                                                            const nativeDate = newDate.toDate(); 
                                                            setUDFDateTime_2(nativeDate);
                                                        } else {
                                                            setUDFDateTime_2(null);
                                                        }
                                                        setErrorField(null);
                                                        
                                                        }}
                                                    
                                                    />

                                                    
                                                </Stack>
                                            </Grid>
                                        
                                            {/* UDF Number 03- 04 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_numeric3") || "UDF Numeric3"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder=".0000"
                                                        autoComplete="off"
                                                        fullWidth
                                                        value={UDFNumeric_3}
                                                        onChange={(e) => {
                                                            handleNumericInputChange(e, setUDFNumeric_3);
                                                            setErrorField(null); 
                                                        }}
                                                        InputProps={{
                                                            inputProps: { style: { textAlign: 'right' } }
                                                        }}
                                                        className={
                                                        errorField === "itm_det_numeric3" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_numeric4") || "UDF Numeric4"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder=".0000"
                                                        autoComplete="off"
                                                        fullWidth
                                                        value={UDFNumeric_4}
                                                        onChange={(e) => {
                                                            handleNumericInputChange(e, setUDFNumeric_4);
                                                            setErrorField(null); 
                                                        }}
                                                        InputProps={{
                                                            inputProps: { style: { textAlign: 'right' } }
                                                        }}
                                                        className={
                                                        errorField === "itm_det_numeric4" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>

                                                
                                            </Grid>

                                            {/* UDF SateTIme 03 - 04 */}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_datetime3") || "UDF Date3"} 
                                                    </Typography>
                                                    <AntDatePicker
                                                        value={UDFDateTime_3 ? dayjs(UDFDateTime_3) : null}
                                                        format="DD/MM/YYYY HH:mm" 
                                                        placeholder="DD/MM/YYYY HH:mm"
                                                        showTime
                                                        allowClear={false}
                                                        onChange={(newDate) => {
                                                        if (newDate && newDate.isValid()) {
                                                            const nativeDate = newDate.toDate(); 
                                                            setUDFDateTime_3(nativeDate);
                                                        } else {
                                                            setUDFDateTime_3(null);
                                                        }
                                                        setErrorField(null);
                                                        
                                                        }}
                                                    
                                                    />
                                                    
                                                </Stack>

                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_datetime4") || "UDF Date4"} 
                                                    </Typography>
                                                    
                                                    <AntDatePicker
                                                        value={UDFDateTime_4 ? dayjs(UDFDateTime_4) : null}
                                                        format="DD/MM/YYYY HH:mm" 
                                                        placeholder="DD/MM/YYYY HH:mm"
                                                        showTime
                                                        allowClear={false}
                                                        onChange={(newDate) => {
                                                        if (newDate && newDate.isValid()) {
                                                            const nativeDate = newDate.toDate(); 
                                                            setUDFDateTime_4(nativeDate);
                                                        } else {
                                                            setUDFDateTime_4(null);
                                                        }
                                                        setErrorField(null);
                                                        
                                                        }}
                                                    
                                                    />
                                                </Stack>
                                            </Grid>

                                            {/*Empty*/}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_numeric5") || "UDF Numeric5"} 
                                                    </Typography>
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder=".0000"
                                                        autoComplete="off"
                                                        fullWidth
                                                        value={UDFNumeric_4}
                                                        onChange={(e) => {
                                                            handleNumericInputChange(e, setUDFNumeric_5);
                                                            setErrorField(null); 
                                                        }}
                                                        InputProps={{
                                                            inputProps: { style: { textAlign: 'right' } }
                                                        }}
                                                        className={
                                                        errorField === "itm_det_numeric4" ? "erroBorderadd" : "" }
                                                    />
                                                </Stack>
                                                
                                            </Grid>
                                            {/* UDF DateTime 05*/}
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                                    <Typography variant="subtitle2" className="" > 
                                                        {findCustomizeLabel("itm_det_datetime5") || "UDF Date5"} 
                                                    </Typography>
                                                    <AntDatePicker
                                                        value={UDFDateTime_5 ? dayjs(UDFDateTime_5) : null}
                                                        format="DD/MM/YYYY HH:mm" 
                                                        placeholder="DD/MM/YYYY HH:mm"
                                                        showTime
                                                        allowClear={false}
                                                        onChange={(newDate) => {
                                                        if (newDate && newDate.isValid()) {
                                                            const nativeDate = newDate.toDate(); 
                                                            setUDFDateTime_5(nativeDate);
                                                        } else {
                                                            setUDFDateTime_5(null);
                                                        }
                                                        setErrorField(null);
                                                        
                                                        }}
                                                    
                                                    />
                                                    
                                                </Stack>
                                            </Grid>
                                        </Grid>

                                        
                                    </Grid>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Location */}
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 2}
                >
                    <Grid container>
                        
                        <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                            <Card className="AssetDetail">
                                {RowID && ( <Inventory_location data={{ RowID: RowID}}/> )}
                            </Card>

                        </Grid>

                    </Grid>

                </Box>

                {/* Supplier */}
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 3}
                >
                    <Grid container>
                        <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                            <Card className="AssetDetail">
                                {RowID && ( <Inventory_Supplier data={{ RowID: RowID }}/> )}
                            </Card>
                        </Grid>
                    </Grid>

                </Box>

                {/* Attachment */}
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 4}
                >
                    <Grid container>
                        <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                            <Card className="AssetDetail">
                                <div>
                                    <div style={{ paddingBottom: "20px", backgroundColor: "white", }} >
                                        <div
                                            className="template-demo"
                                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "nowrap", width: "100%", }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ marginRight: "5px" }}>
                                                    <Iconify
                                                        icon="codicon:references"
                                                        width="30px"
                                                        height="30px"
                                                        style={{ fontSize: "45px" }}
                                                    />
                                                </div>
                                                <div
                                                    className="template-demo"
                                                    style={{ display: "flex", flexDirection: "column" }}>
                                                    <div style={{ marginRight: "10px", fontWeight: "bold" }}> 
                                                        Reference 
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ marginLeft: "auto" }} >
                                                <Button  type="submit"   className="AddNewButton"  
                                                    onClick={ () => {
                                                        setIsFormFiled(true)
                                                        handleButtonClick()
                                                    }}>
                                                    + Add Attachment 
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover mt-2 col-sm-12 astFimg">
                                            <thead>
                                                <tr>
                                                <th>Image</th>
                                                <th>File Name</th>
                                                <th>Audit User</th>
                                                <th>Audit Date</th>
                                                <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {RefImg !== "" && RefImg !== null && RefImg.map((item, index) => 
                                                    <tr key={index} className="tableRow_Attachment_hover">
                                                        <td>
                                                            {item.file_name
                                                                .toLowerCase()
                                                                .endsWith(".pdf") ? (
                                                                <FontAwesomeIcon
                                                                    icon={faFilePdf}
                                                                    onClick={() =>
                                                                    openPDFInNewTab(item.attachment)
                                                                    }
                                                                    style={{
                                                                    width: "35px",
                                                                    height: "35px",
                                                                    cursor:"pointer",
                                                                    }}
                                                                    className="fntpdf"
                                                                />
                                                                ) : item.file_name.toLowerCase().endsWith(".docx") ? (
                                                                <FontAwesomeIcon
                                                                    icon={faFileWord}
                                                                    onClick={() => openDocxInNewTab(item.attachment)}
                                                                    style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                                                    className="fntdocx"
                                                                />
                                                                ) : item.file_name.toLowerCase().endsWith(".php") ? (
                                                                <FontAwesomeIcon
                                                                    icon={faFileCode} 
                                                                    onClick={() => openPhpInNewTab(item.attachment)}
                                                                    style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                                                    className="fntphp"
                                                                />
                                                                ) : item.file_name.toLowerCase().endsWith(".log") ? (
                                                                <FontAwesomeIcon
                                                                    icon={faFileAlt} 
                                                                    onClick={() => openLogInNewTab(item.attachment)}
                                                                    style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                                                    className="fntlog"
                                                                />
                                                                ) : item.file_name.toLowerCase().endsWith(".xlsx") ? (
                                                                <FontAwesomeIcon
                                                                    icon={faFileExcel} 
                                                                    onClick={() => openXlsxInNewTab(item.attachment)}
                                                                    style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                                                    className="fntxlsx"
                                                                />
                                                                ) : item.file_name.toLowerCase().endsWith(".txt") ? (
                                                                <FontAwesomeIcon
                                                                    icon={faFileAlt} 
                                                                    onClick={() => openLogInNewTab(item.attachment)}
                                                                    style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                                                    className="fntxlsx"
                                                                />
                                                                ) : (
                                                                
                                                                <img
                                                                    key={index}
                                                                    //src={item.attachment}
                                                                    src={item.attachment ? `${httpCommon.defaults.baseURL}${item.attachment}` :""}
                                                                    style={{
                                                                    width: "35px",
                                                                    height: "35px",
                                                                    cursor:"pointer",
                                                                    }}
                                                                    onClick={() => handleShowdata(item)}
                                                                />
                                                            )}

                                                        </td>
                                                        <td>{item.file_name}</td>
                                                        <td>{item.audit_user}</td>
                                                        <td>
                                                            {new Date(
                                                            item.audit_date.date
                                                            ).toLocaleString("en-US", {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                            // Show milliseconds with 3 digits
                                                            })}
                                                        </td>
                                                        <td>
                                                            <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsFormFiled(true);
                                                                handleDeleteReferenceApi(item.RowID)
                                                            }}
                                                            className="btn multiplsimg"
                                                            >
                                                            <Iconify icon="carbon:close-outline" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}

                                                {selectedImages.map((image, index) =>
                                                    image && index === undefined ? (
                                                        <tr>
                                                            <td>
                                                                <img
                                                                    src={RefImg[0].attachment ? `${httpCommon.defaults.baseURL}${RefImg[0].attachment}` :""}
                                                                    style={{ width: "35px", height: "35px", }}
                                                                />
                                                            </td>
                                                        </tr>

                                                    ): image.name .toLowerCase() .endsWith(".pdf") ? (
                                                        <tr key={index}>
                                                            <td>
                                                                <FontAwesomeIcon
                                                                    icon={faFilePdf}
                                                                    style={{ width: "35px", height: "35px", }}
                                                                />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteImg(index);
                                                                    }}
                                                                    >
                                                                    <Iconify icon="carbon:close-outline" />
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    ): image.name.toLowerCase().endsWith(".xlsx") ? (

                                                        <tr key={index}>
                                                            <td>
                                                                <FontAwesomeIcon
                                                                    icon={faFileExcel}
                                                                    style={{ width: "35px", height: "35px", }}
                                                                />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteImg(index);
                                                                    }}
                                                                >
                                                                    <Iconify icon="carbon:close-outline" />
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    ): image.name.toLowerCase().endsWith(".docx") ? (
                                                        <tr key={index}>
                                                            <td>
                                                            <FontAwesomeIcon
                                                                icon={faFileWord}
                                                                style={{ width: "35px", height: "35px", }}
                                                            />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteImg(index);
                                                                    }}
                                                                >
                                                                    <Iconify icon="carbon:close-outline" />
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    ): image.name.toLowerCase().endsWith(".log") ? (
                                                        <tr key={index}>
                                                            <td>
                                                            <FontAwesomeIcon
                                                                icon={faFileAlt}
                                                                style={{ width: "35px", height: "35px", }}
                                                            />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteImg(index);
                                                                    }}
                                                                >
                                                                    <Iconify icon="carbon:close-outline" />
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    ): image.name.toLowerCase().endsWith(".txt") ? (

                                                        <tr key={index}>
                                                            <td>
                                                            <FontAwesomeIcon
                                                                icon={faFileAlt}
                                                                style={{ width: "35px", height: "35px", }}
                                                            />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteImg(index);
                                                                    }}
                                                                >
                                                                    <Iconify icon="carbon:close-outline" />
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    ): image.name.toLowerCase().endsWith(".php") ? (

                                                        <tr key={index}>
                                                            <td>
                                                            <FontAwesomeIcon
                                                                icon={faFileCode}
                                                                style={{ width: "35px", height: "35px", }}
                                                            />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                                                            <td>
                                                            <button
                                                                type="button"
                                                                className="btn"
                                                                onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteImg(index);
                                                                }}
                                                            >
                                                                <Iconify icon="carbon:close-outline" />
                                                            </button>
                                                            </td>
                                                        </tr>

                                                    ):(
                                                        <tr key={index}>
                                                            <td>
                                                            <img
                                                                key={index}
                                                                //src={URL.createObjectURL(image)}
                                                                src={image.base64 || URL.createObjectURL(image)}
                                                                alt="Uploaded image"
                                                                onClick={(e) => handleShowdd(e, image)}
                                                                style={{ width: "35px", height: "35px", }}
                                                            />
                                                            </td>
                                                            <td>{image.name}</td>
                                                            <td>Admin</td>
                                                            <td>{new Date().toLocaleString() + ""}</td>
                        
                                                            <td>
                                                            <button
                                                                type="button"
                                                                className="btn"
                                                                onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteImg(index);
                                                                }}
                                                            >
                                                                <Iconify icon="carbon:close-outline" />
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                            {isMyStateEmpty ? (
                                                <BootstrapDialog
                                                    onClose={handleClosedd}
                                                    aria-labelledby="customized-dialog-title"
                                                    open={showdd}
                                                >
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={handleClosedd}
                                                        sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                                                    >
                                                        <Iconify
                                                            icon="carbon:close-outline"
                                                            style={{ marginRight: "4px" }}
                                                        />
                                                    </IconButton>

                                                    <DialogContent dividers>
                                                        <Typography gutterBottom>
                                                        <img
                                                            // src={selectedImage}
                                                            src={selectedImage ? `${httpCommon.defaults.baseURL}${selectedImage}` :""}
                                                            style={{ width: "100%", height: "auto" }}
                                                        />
                                                        </Typography>
                                                    </DialogContent>

                                                </BootstrapDialog>

                                            ):(
                                                <BootstrapDialog
                                                    onClose={handleClosedd}
                                                    aria-labelledby="customized-dialog-title"
                                                    open={showdd}
                                                >
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={handleClosedd}
                                                        sx={{
                                                            position: "absolute",
                                                            right: 8,
                                                            top: 8,
                                                            color: "#000",
                                                            background:"#fff",   
                                                            border: "1px solid #fff", "&:hover": { color: "#000", background:"#fff", borderColor: "#fff",
                                                        },
                                                        }}
                                                    >
                                                        <Iconify icon="carbon:close-outline" />
                                                    </IconButton>
                                                    <DialogContent dividers>
                                                        <Typography gutterBottom>
                                                            <img
                                                                style={{ height: "100%", width: "100%" }}
                                                                src={handalImg}
                                                                alt="Uploaded image"
                                                            />
                                                        </Typography>
                                                    </DialogContent>
                                                </BootstrapDialog>
                                            )}
                                        </table>
                                    </div>
                                    <div
                                        style={{ display: "flex", justifyContent: "center", marginTop: "20px", }}
                                    >
                                        <form onSubmit={handleSubmit} className="row">
                                            <div className="col-sm-10 text-center">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: "none" }}
                                                multiple
                                                onChange={(e) => {
                                                    handleImageChange(e);    // Call the function with the event
                                                    setIsFormFiled(true);     // Set the form field status
                                                }}
                                                className="form-control form-control-lg"
                                                id="formFileMultiple"
                                            />

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* SnackBar */}
                <div className="AssetFromSnackbar">
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={null}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        sx={{
                            boxShadow:
                            "0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)",
                            "& .MuiAlert-filledError": {
                            backgroundColor: "#fff",
                            color: "#000",
                            fontWeight: "600",
                            position: "relative",
                            animation: snackbarOpen ? "bounce-in 0.5s ease-out" : "none", },
                        }}
                    >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="error"
                        variant="filled"
                        sx={{
                        "@keyframes bounce-in": {
                            "0%": { transform: "scale(0.9)" },
                            "50%": { transform: "scale(1.05)" },
                            "100%": { transform: "scale(1)" },
                        },
                        }}
                     >
                    {snackbarMessage}

                    <LinearProgress
                      variant="determinate"
                      value={snackbarOpen ? 100 - progress : 0}
                      style={{
                        width: "99%",
                        position: "absolute",
                        bottom: "0",
                        marginLeft: "-50px",
                      }}
                      sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "green", }, }}
                    />
                  </Alert>
                </Snackbar>

                </div>

                {/* POP UP Master */}
                <BootstrapDialog
                    onClose={handleCloseModalMasterLocation}
                    aria-labelledby="customized-dialog-title"
                    open={open_MasterLocation}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle
                        sx={{ m: 0, p: 2 }}
                        id="customized-dialog-title"
                        className="dailogTitWork"
                        >
                        Master Location
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalMasterLocation}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                     >
                    <Iconify icon="material-symbols:close" />
                    </IconButton>
                    <DialogContent dividers>
                        <div className="TblSelect">
                            <InventoryMasterLocation
                                onRowClick={handleRowData3}
                                onChangePage={handleRowDataPagechg}
                                onSearchChange={handelRowSearch}
                            />
                        </div>
                    </DialogContent>

                </BootstrapDialog>

                </>
            )}
            </div>
         </Container>
        </>
    );

}