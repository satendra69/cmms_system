import http from "src/http-common";

// Site Code List

const get_sitecode = () => http.get("/get_sitecode.php?");

// Login API
const authenticate_login = (Username, Password, site_ID) =>
  http.get(
    `/authenticate_login.php?login_id=${Username}&password=${Password}&site_cd=${site_ID}`
  );


// DropDown API
const get_dropdown = (site_cd, type) => 
   http.get(`/get_dropdown.php?site_cd=${site_cd}&type=${type}`);


const get_dropdown_ParentFlag = (site_cd, ast_mst_asset_no) => 
   http.get(
    `/get_dropdown_ParentFlag.php?site_cd=${site_cd}&ast_mst_asset_no=${ast_mst_asset_no}`
  );

// ----------------------------------------------------------------------% Master File %-----------------------------------------------------------------

//  System Default Setting Status
const get_systemdefaultsetting_status = (site_cd) =>  http.get(`/get_systemdefaultsetting_status.php?site_cd=${site_cd}`);


//  System Default Setting
const get_systemdefaultsetting_select = (site_cd) =>  http.get(
    `/get_systemdefaultsetting_select.php?site_cd=${site_cd}`
  );


// Update System Default Setting
const update_systemdefaultsetting = (data) =>  http.post(`/update_systemdefaultsetting.php?`, data);



// Master User Group
const get_master_usergroup = (site_cd) =>  http.get(`/get_master_usergroup.php?site_cd=${site_cd}`);

// Master User Group Group List
const get_master_usergroup_select = (site_cd, rowid) =>  http.get(
    `/get_master_usergroup_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );

// Master User Group insert list
const get_master_usergroup_insert = (data) =>  http.post(`/get_master_usergroup_insert.php?`, data);

// Master User Group Update List
const get_master_usergroup_update = (data) =>  http.post(`/get_master_usergroup_update.php?`, data);

// Master User Group Delete List
const get_master_usergroup_delete = (site_cd, rowid) =>  http.get(
    `/get_master_usergroup_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );

// Master Auto Number
const get_master_autonumber = (site_cd) =>  http.get(`/get_master_autonumber.php?site_cd=${site_cd}`);

// Master Auto Number List
const get_master_autonumber_select = (site_cd, rowid) =>  http.get(
    `/get_master_autonumber_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );

// Master Auto Number Update List
const get_master_autonumber_update = (data) =>  http.post(`/get_master_autonumber_update.php?`, data);


// Master Craft Code
const get_master_craftcode = (site_cd) =>  http.get(`/get_master_craftcode.php?site_cd=${site_cd}`);

// Master Craft Code List
const get_master_craftcode_select = (site_cd, rowid) =>  http.get(
    `/get_master_craftcode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );

// Master Craft Code insert list
const get_master_craftcode_insert = (data) => 
   http.post(`/get_master_craftcode_insert.php?`, data);

// Master Craft Code Update List
const get_master_craftcode_update = (data) =>  http.post(`/get_master_craftcode_update.php?`, data);

// Master Craft Code Delete List
const get_master_craftcode_delete = (site_cd, rowid) =>  http.get(
    `/get_master_craftcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );


// Master Status Category
const get_master_statuscategory = (site_cd) => {
   http.get(`/get_master_statuscategory.php?site_cd=${site_cd}`);
};
// Master Status Category List
const get_master_statuscategory_select = (site_cd, rowid) => {
   http.get(
    `/get_master_statuscategory_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Status Category Update List
const get_master_statuscategory_update = (data) => {
   http.post(`/get_master_statuscategory_update.php?`, data);
};

// Master Status Type
const get_master_statustype = (site_cd) => {
   http.get(`/get_master_statustype.php?site_cd=${site_cd}`);
};
// Master Status Type List
const get_master_statustype_select = (site_cd, rowid) => {
   http.get(
    `/get_master_statustype_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Status Type Update List
const get_master_statustype_update = (data) => {
   http.post(`/get_master_statustype_update.php?`, data);
};

// Master Cost Center
const get_master_costcenter = (site_cd) => {
   http.get(`/get_master_costcenter.php?site_cd=${site_cd}`);
};
// Master Cost Center List
const get_master_costcenter_select = (site_cd, rowid) => {
   http.get(
    `/get_master_costcenter_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Cost Center insert list
const get_master_costcenter_insert = (data) => {
   http.post(`/get_master_costcenter_insert.php?`, data);
};
// Master Cost Center Update List
const get_master_costcenter_update = (data) => {
   http.post(`/get_master_costcenter_update.php?`, data);
};
// Master Cost Center Delete List
const get_master_costcenter_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_costcenter_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Account
const get_master_account = (site_cd) => {
   http.get(`/get_master_account.php?site_cd=${site_cd}`);
};
// Master Account List
const get_master_account_select = (site_cd, rowid) => {
   http.get(
    `/get_master_account_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Account insert list
const get_master_account_insert = (data) => {
   http.post(`/get_master_account_insert.php?`, data);
};
// Master Account Update List
const get_master_account_update = (data) => {
   http.post(`/get_master_account_update.php?`, data);
};
// Master Account Delete List
const get_master_account_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_account_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Currency Code
const get_master_currencycode = (site_cd) => {
   http.get(`/get_master_currencycode.php?site_cd=${site_cd}`);
};
// Master Currency Code List
const get_master_currencycode_select = (site_cd, rowid) => {
   http.get(
    `/get_master_currencycode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Currency Code insert list
const get_master_currencycode_insert = (data) => {
   http.post(`/get_master_currencycode_insert.php?`, data);
};
// Master Currency Code Update List
const get_master_currencycode_update = (data) => {
   http.post(`/get_master_currencycode_update.php?`, data);
};
// Master Currency Code Delete List
const get_master_currencycode_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_currencycode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Tax Code
const get_master_taxcode = (site_cd) => {
   http.get(`/get_master_taxcode.php?site_cd=${site_cd}`);
};
// Master Tax Code List
const get_master_taxcode_select = (site_cd, rowid) => {
   http.get(
    `/get_master_taxcode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Tax Code insert list
const get_master_taxcode_insert = (data) => {
   http.post(`/get_master_taxcode_insert.php?`, data);
};
// Master Tax Code Update List
const get_master_taxcode_update = (data) => {
   http.post(`/get_master_taxcode_update.php?`, data);
};
// Master Tax Code Delete List
const get_master_taxcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_taxcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Uom Type
const get_master_uomtype = (site_cd) => {
   http.get(`/get_master_uomtype.php?site_cd=${site_cd}`);
};
// Master Uom Type List
const get_master_uomtype_select = (site_cd, rowid) => {
   http.get(
    `/get_master_uomtype_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master UOM Type Update List
const get_master_uomtype_update = (data) => {
   http.post(`/get_master_uomtype_update.php?`, data);
};

// Master Uom Master
const get_master_uommaster = (site_cd) => {
   http.get(`/get_master_uommaster.php?site_cd=${site_cd}`);
};
// Master Uom Master List
const get_master_uommaster_select = (site_cd, rowid) => {
   http.get(
    `/get_master_uommaster_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master UOM Master insert list
const get_master_uommaster_insert = (data) => {
   http.post(`/get_master_uommaster_insert.php?`, data);
};
// Master UOM Master Update List
const get_master_uommaster_update = (data) => {
   http.post(`/get_master_uommaster_update.php?`, data);
};
// Master UOM Master Delete List
const get_master_uommaster_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_uommaster_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master UOM Con Factor
const get_master_uomconfactor = (site_cd) => {
   http.get(`/get_master_uomconfactor.php?site_cd=${site_cd}`);
};
// Master Uom Con Factor List
const get_master_uomconfactor_select = (site_cd, rowid) => {
   http.get(
    `/get_master_uomconfactor_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master UOM Con Factor insert list
const get_master_uomconfactor_insert = (data) => {
   http.post(`/get_master_uomconfactor_insert.php?`, data);
};
// Master UOM Con Factor Update List
const get_master_uomconfactor_update = (data) => {
   http.post(`/get_master_uomconfactor_update.php?`, data);
};
// Master UOM Con Factor Delete List
const get_master_uomconfactor_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_uomconfactor_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Bill To
const get_master_billto = (site_cd) => {
   http.get(`/get_master_billto.php?site_cd=${site_cd}`);
};
// Master Bill To List
const get_master_billto_select = (site_cd, rowid) => {
   http.get(
    `/get_master_billto_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Bill To insert list
const get_master_billto_insert = (data) => {
   http.post(`/get_master_billto_insert.php?`, data);
};
// Master Bill To Update List
const get_master_billto_update = (data) => {
   http.post(`/get_master_billto_update.php?`, data);
};
// Master Bill To Delete List
const get_master_billto_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_billto_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Ship To
const get_master_shipto = (site_cd) => {
   http.get(`/get_master_shipto.php?site_cd=${site_cd}`);
};
// Master Ship To List
const get_master_shipto_select = (site_cd, rowid) => {
   http.get(
    `/get_master_shipto_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Ship To insert list
const get_master_shipto_insert = (data) => {
   http.post(`/get_master_shipto_insert.php?`, data);
};
// Master Ship To Update List
const get_master_shipto_update = (data) => {
   http.post(`/get_master_shipto_update.php?`, data);
};
// Master Ship To Delete List
const get_master_shipto_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_shipto_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Supplier Status
const get_master_supplierstatus = (site_cd) => {
   http.get(`/get_master_supplierstatus.php?site_cd=${site_cd}`);
};
// Master Supplier List
const get_master_supplierstatus_select = (site_cd, rowid) => {
   http.get(
    `/get_master_supplierstatus_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Supplier Status insert list
const get_master_supplierstatus_insert = (data) => {
   http.post(`/get_master_supplierstatus_insert.php?`, data);
};
// Master Supplier Status Update List
const get_master_supplierstatus_update = (data) => {
   http.post(`/get_master_supplierstatus_update.php?`, data);
};
// Master Supplier Status Delete List
const get_master_supplierstatus_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_supplierstatus_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Project Master
const get_master_projectmaster = (site_cd) => {
   http.get(`/get_master_projectmaster.php?site_cd=${site_cd}`);
};
// Master Project Master List
const get_master_projectmaster_select = (site_cd, rowid) => {
   http.get(
    `/get_master_projectmaster_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Project Master insert list
const get_master_projectmaster_insert = (data) => {
   http.post(`/get_master_projectmaster_insert.php?`, data);
};
// Master Project Master Update List
const get_master_projectmaster_update = (data) => {
   http.post(`/get_master_projectmaster_update.php?`, data);
};
// Master Project Master Delete List
const get_master_projectmaster_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_projectmaster_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Master Customer Status
const get_master_customerstatus = (site_cd) => {
   http.get(`/get_master_customerstatus.php?site_cd=${site_cd}`);
};
// Master Customer Status List
const get_master_customerstatus_select = (site_cd, rowid) => {
   http.get(
    `/get_master_customerstatus_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Master Customer Status insert list
const get_master_customerstatus_insert = (data) => {
   http.post(`/get_master_customerstatus_insert.php?`, data);
};
// Master Customer Status update list
const get_master_customerstatus_update = (data) => {
   http.post(`/get_master_customerstatus_update.php?`, data);
};
// Master Customer Status Delete List
const get_master_customerstatus_delete = (site_cd, rowid) => {
   http.get(
    `/get_master_customerstatus_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// ----------------------------------------------------------------------% Master Employee %-----------------------------------------------------------------
// Employee Master List
const get_employeemaster = (site_cd, page, pageSize) => {
   http.get(
    `/get_employeemaster.php?site_cd=${site_cd}&page=${page}&pageSize=${pageSize}`
  );
};

// Employee Master Select List
const get_employeemaster_select = (RowID) => {
   http.get(`/get_employeemaster_select.php?RowID=${RowID}`);
};

// Insert Employee Master
const insert_new_employee = (data) => {
   http.post(`/insert_new_employee.php?`, data);
};

// Update Employee Master
const update_employee = (data) => {
   http.post(`/update_employee.php?`, data);
};



// Employee Type List
const get_employee_type = (site_cd) => {
   http.get(`/get_employee_type.php?site_cd=${site_cd}`);
};

// Employee Type select List
const get_employee_type_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_type_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Employee Type
const get_employee_type_insert = (data) => {
   http.post(`/get_employee_type_insert.php?`, data);
};

// Update Employee Type
const get_employee_type_update = (data) => {
   http.post(`/get_employee_type_update.php?`, data);
};

// Delete Employee Type
const get_employee_type_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_type_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Employee GroupCode List
const get_employee_group_code = (site_cd) => {
   http.get(`/get_employee_group_code.php?site_cd=${site_cd}`);
};

// Employee Group Code select List
const get_employee_group_cd_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_group_cd_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert GroupCode
const get_employee_groupcode_insert = (data) => {
   http.post(`/get_employee_groupcode_insert.php?`, data);
};

// Update GroupCode
const get_employee_groupcode_update = (data) => {
   http.post(`/get_employee_groupcode_update.php?`, data);
};

// Delete GroupCode
const get_employee_groupcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_groupcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Employee Code List
const get_employee_code = (site_cd) => {
   http.get(`/get_employee_code.php?site_cd=${site_cd}`);
};

// Employee Code select List
const get_employee_code_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_code_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Employee Code
const get_employee_code_insert = (data) => {
   http.post(`/get_employee_code_insert.php?`, data);
};

// Update Employee Code
const get_employee_code_update = (data) => {
   http.post(`/get_employee_code_update.php?`, data);
};

// Delete Employee Code
const get_employee_code_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_code_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Critical Factor List
const get_employee_critical_factor = (site_cd) => {
   http.get(`/get_employee_critical_factor.php?site_cd=${site_cd}`);
};

// Critical Factor select List
const get_employee_critical_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_critical_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Critical Factor
const get_employee_criticalfactor_insert = (data) => {
   http.post(`/get_employee_criticalfactor_insert.php?`, data);
};

// Update Critical Factor
const get_employee_criticalfactor_update = (data) => {
   http.post(`/get_employee_criticalfactor_update.php?`, data);
};

// Delete Critical Factor List
const get_employee_criticalfactor_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_criticalfactor_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Employee Status List
const get_employee_status = (site_cd) => {
   http.get(`/get_employee_status.php?site_cd=${site_cd}`);
};

// Employee select List
const get_employee_status_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_status_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Status Type List
const get_employee_status_type = (site_cd) => {
   http.get(`/get_employee_status_type.php?site_cd=${site_cd}`);
};

// Insert Employee Status
const get_employee_status_insert = (data) => {
   http.post(`/get_employee_status_insert.php?`, data);
};

// Update Employee Status
const get_employee_status_update = (data) => {
   http.post(`/get_employee_status_update.php?`, data);
};

// Delete Employee Status
const get_employee_status_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_status_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Work Area List
const get_employee_work_area = (site_cd) => {
   http.get(`/get_employee_work_area.php?site_cd=${site_cd}`);
};

// Work Area select List
const get_employee_workarea_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_workarea_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Employee Status
const get_employee_workarea_insert = (data) => {
   http.post(`/get_employee_workarea_insert.php?`, data);
};

// Update Employee Status
const get_employee_workarea_update = (data) => {
   http.post(`/get_employee_workarea_update.php?`, data);
};

// Delete Employee Status
const get_employee_workarea_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_workarea_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Employee Location
const get_employee_location = (site_cd) => {
   http.get(`/get_employee_location.php?site_cd=${site_cd}`);
};

// Employee Location select List
const get_employee_location_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_location_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Employee Location
const get_employee_location_insert = (data) => {
   http.post(`/get_employee_location_insert.php?`, data);
};

// Update Employee Location
const get_employee_location_update = (data) => {
   http.post(`/get_employee_location_update.php?`, data);
};

// Delete Employee Location
const get_employee_location_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_location_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Employee Level
const get_employee_level = (site_cd) => {
   http.get(`/get_employee_level.php?site_cd=${site_cd}`);
};

// Employee Level select List
const get_employee_level_select = (site_cd, rowid) => {
   http.get(
    `/get_employee_level_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Employee Level
const get_employee_level_insert = (data) => {
   http.post(`/get_employee_level_insert.php?`, data);
};

// Update Employee Level
const get_employee_level_update = (data) => {
   http.post(`/get_employee_level_update.php?`, data);
};

// Delete Employee Level
const get_employee_level_delete = (site_cd, rowid) => {
   http.get(
    `/get_employee_level_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// EmployeeMaster Maintenance
const get_employeemaster_maintenance = (site_cd, RowID) => {
   http.get(`/get_employeemaster_maintenance.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// EmployeeMaster Pr Approval
const get_employeemaster_pr_approval = (site_cd, RowID) => {
   http.get(`/get_employeemaster_pr_approval.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// EmployeeMaster Mr Approval
const get_employeemaster_mr_approval = (site_cd, RowID) => {
   http.get(`/get_employeemaster_mr_approval.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// EmployeeMaster Stock Location
const get_employeemaster_stock_location = (site_cd, RowID) => {
   http.get(`/get_employeemaster_stock_location.php?site_cd=${site_cd}&RowID=${RowID}`);
};


// ----------------------------------------------------------------------% Master Asset %-----------------------------------------------------------------
// Asset Master List
const get_assetmaster = (site_cd, page, pageSize) => {
   http.get(
    `/get_assetmaster.php?site_cd=${site_cd}&page=${page}&pageSize=${pageSize}`
  );
};
// Asset Master List Old
const get_assetmaster_old = (site_cd, page, pageSize) => {
   http.get(
    `/get_assetmaster_old.php?site_cd=${site_cd}&page=${page}&pageSize=${pageSize}`
  );
};

// Asset Master Select List
const get_assetmaster_select = (data) => {
   http.post(`/get_assetmaster_select.php?`, data);
};
// Insert Asset Master
const insert_new_asset = (data) => {
   http.post(`/insert_new_asset.php?`, data);
};
// Update Asset Master
const update_asset = (data) => {
   http.post(`/update_asset.php?`, data);
};

// Asset Type List
const get_asset_type = (site_cd) => {
   http.get(`/get_asset_type.php?site_cd=${site_cd}`);
};
// Asset Type select List
const get_asset_type_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_type_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert Asset Type
const get_asset_type_insert = (data) => {
   http.post(`/get_asset_type_insert.php?`, data);
};
// Update Asset Type
const get_asset_type_update = (data) => {
   http.post(`/get_asset_type_update.php?`, data);
};
// Delete Asset Type
const get_asset_type_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_type_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Asset GroupCode List
const get_asset_group_code = (site_cd) => {
   http.get(`/get_asset_group_code.php?site_cd=${site_cd}`);
};
// Asset Group Code select List
const get_asset_group_cd_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_group_cd_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert GroupCode
const get_asset_groupcode_insert = (data) => {
   http.post(`/get_asset_groupcode_insert.php?`, data);
};
// Update GroupCode
const get_asset_groupcode_update = (data) => {
   http.post(`/get_asset_groupcode_update.php?`, data);
};
// Delete GroupCode
const get_asset_groupcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_groupcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Asset Code List
const get_asset_code = (site_cd) => {
   http.get(`/get_asset_code.php?site_cd=${site_cd}`);
};
// Asset Code select List
const get_asset_code_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_code_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert Asset Code
const get_asset_code_insert = (data) => {
   http.post(`/get_asset_code_insert.php?`, data);
};
// Update Asset Code
const get_asset_code_update = (data) => {
   http.post(`/get_asset_code_update.php?`, data);
};
// Delete Asset Code
const get_asset_code_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_code_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Critical Factor List
const get_asset_critical_factor = (site_cd) => {
   http.get(`/get_asset_critical_factor.php?site_cd=${site_cd}`);
};
// Critical Factor select List
const get_asset_critical_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_critical_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert Critical Factor
const get_asset_criticalfactor_insert = (data) => {
   http.post(`/get_asset_criticalfactor_insert.php?`, data);
};
// Update Critical Factor
const get_asset_criticalfactor_update = (data) => {
   http.post(`/get_asset_criticalfactor_update.php?`, data);
};
// Delete Critical Factor   List
const get_asset_criticalfactor_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_criticalfactor_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Asset Status List
const get_asset_status = (site_cd) => {
   http.get(`/get_asset_status.php?site_cd=${site_cd}`);
};
// Asset Status select List
const get_asset_status_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_status_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Status Type List
const get_status_type = (site_cd) => {
   http.get(`/get_status_type.php?site_cd=${site_cd}`);
};
// Insert Asset Status
const get_asset_status_insert = (data) => {
   http.post(`/get_asset_status_insert.php?`, data);
};
// Update Asset Status
const get_asset_status_update = (data) => {
   http.post(`/get_asset_status_update.php?`, data);
};
// Delete Asset Status
const get_asset_status_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_status_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Area List
const get_asset_work_area = (site_cd) => {
   http.get(`/get_asset_work_area.php?site_cd=${site_cd}`);
};
// Work Area select List
const get_asset_workarea_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_workarea_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert Asset Status
const get_asset_workarea_insert = (data) => {
   http.post(`/get_asset_workarea_insert.php?`, data);
};
// Update Asset Status
const get_asset_workarea_update = (data) => {
   http.post(`/get_asset_workarea_update.php?`, data);
};
// Delete Asset Status
const get_asset_workarea_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_workarea_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Asset Location
const get_asset_location = (site_cd) => {
   http.get(`/get_asset_location.php?site_cd=${site_cd}`);
};
// Asset Location select List
const get_asset_location_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_location_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert Asset Location
const get_asset_location_insert = (data) => {
   http.post(`/get_asset_location_insert.php?`, data);
};
// Update Asset Location
const get_asset_location_update = (data) => {
   http.post(`/get_asset_location_update.php?`, data);
};
// Delete Asset Location
const get_asset_location_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_location_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Asset Level
const get_asset_level = (site_cd) => {
   http.get(`/get_asset_level.php?site_cd=${site_cd}`);
};
// Asset Level select List
const get_asset_level_select = (site_cd, rowid) => {
   http.get(
    `/get_asset_level_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Insert Asset Level
const get_asset_level_insert = (data) => {
   http.post(`/get_asset_level_insert.php?`, data);
};
// Update Asset Level
const get_asset_level_update = (data) => {
   http.post(`/get_asset_level_update.php?`, data);
};
// Delete Asset Level
const get_asset_level_delete = (site_cd, rowid) => {
   http.get(
    `/get_asset_level_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Asset Pm Setup
const get_assetpmsetup = (site_cd, RowID) => {
   http.get(`/get_assetpmsetup.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Asset Wo History
const get_assetwohistory = (site_cd, RowID) => {
   http.get(`/get_assetwohistory.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Asset Relocation History
const get_assetrelocationhistory = (site_cd, RowID) => {
   http.get(`/get_assetrelocationhistory.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Asset Check List
const get_assetchecklist = (site_cd, RowID) => {
   http.get(`/get_assetchecklist.php?site_cd=${site_cd}&RowID=${RowID}`);
};


// Asset Spares
const get_assetspares = (site_cd, RowID) => {
   http.get(`/get_assetspares.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Asset Usage
const get_assetusage = (site_cd, RowID) => {
   http.get(`/get_assetusage.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Asset Specification
const get_assetspecification = (site_cd, RowID) => {
   http.get(`/get_assetspecification.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Asset Master Status Audit
const get_assetmaster_statusaudit = (site_cd, ast_aud_asset_no, RowID) => {
   http.get(`/get_assetmaster_statusaudit.php?site_cd=${site_cd}&ast_aud_asset_no=${ast_aud_asset_no}&RowID=${RowID}`);
};

// ----------------------------------------------------------------------% Master Work %-----------------------------------------------------------------

// Work Status
const get_work_workstatus = (site_cd) => {
   http.get(`/get_work_workstatus.php?site_cd=${site_cd}`);
};
// Work Status select List
const get_work_workstatus_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workstatus_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work status insert list
const get_work_workstatus_insert = (data) => {
   http.post(`/get_work_workstatus_insert.php?`, data);
};
// Work Status Update List
const get_work_workstatus_update = (data) => {
   http.post(`/get_work_workstatus_update.php?`, data);
};
// Work Status Delete List
const get_work_workstatus_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workstatus_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Priority
const get_work_workpriority = (site_cd) => {
   http.get(`/get_work_workpriority.php?site_cd=${site_cd}`);
};
// Work Status Priority select List
const get_work_workpriority_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workpriority_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Priority insert list
const get_work_workpriority_insert = (data) => {
   http.post(`/get_work_workpriority_insert.php?`, data);
};
// Work Priority Update List
const get_work_workpriority_update = (data) => {
   http.post(`/get_work_workpriority_update.php?`, data);
};
// Work Priority Delete List
const get_work_workpriority_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workpriority_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Group
const get_work_workgroup = (site_cd) => {
   http.get(`/get_work_workgroup.php?site_cd=${site_cd}`);
};
// Work Group select List
const get_work_workgroup_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workgroup_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Group insert list
const get_work_workgroup_insert = (data) => {
   http.post(`/get_work_workgroup_insert.php?`, data);
};
// Work Group Update List
const get_work_workgroup_update = (data) => {
   http.post(`/get_work_workgroup_update.php?`, data);
};
// Work Group Delete List
const get_work_workgroup_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workgroup_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Class
const get_work_workclass = (site_cd) => {
   http.get(`/get_work_workclass.php?site_cd=${site_cd}`);
};
// Work Class select List
const get_work_workclass_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workclass_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Class insert list
const get_work_workclass_insert = (data) => {
   http.post(`/get_work_workclass_insert.php?`, data);
};
// Work Class Update List
const get_work_workclass_update = (data) => {
   http.post(`/get_work_workclass_update.php?`, data);
};
// Work Class Delete List
const get_work_workclass_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workclass_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Type
const get_work_worktype = (site_cd) => {
   http.get(`/get_work_worktype.php?site_cd=${site_cd}`);
};
// Work Type select List
const get_work_worktype_select = (site_cd, rowid) => {
   http.get(
    `/get_work_worktype_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Type insert list
const get_work_worktype_insert = (data) => {
   http.post(`/get_work_worktype_insert.php?`, data);
};
// Work Type Update List
const get_work_worktype_update = (data) => {
   http.post(`/get_work_worktype_update.php?`, data);
};
// Work Type Delete List
const get_work_worktype_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_worktype_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Fault Code
const get_work_workfaultcode = (site_cd) => {
   http.get(`/get_work_workfaultcode.php?site_cd=${site_cd}`);
};
// Work Fault Code select List
const get_work_workfaultcode_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workfaultcode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Fault Code insert list
const get_work_workfaultcode_insert = (data) => {
   http.post(`/get_work_workfaultcode_insert.php?`, data);
};
// Work Fault Code Update List
const get_work_workfaultcode_update = (data) => {
   http.post(`/get_work_workfaultcode_update.php?`, data);
};
// Work Fault Code Delete List
const get_work_workfaultcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workfaultcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Cause Code
const get_work_workcausecode = (site_cd) => {
   http.get(`/get_work_workcausecode.php?site_cd=${site_cd}`);
};
// Work Cause Code select List
const get_work_workcausecode_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workcausecode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Cause Code insert list
const get_work_workcausecode_insert = (data) => {
   http.post(`/get_work_workcausecode_insert.php?`, data);
};
// Work Cause Code Update List
const get_work_workcausecode_update = (data) => {
   http.post(`/get_work_workcausecode_update.php?`, data);
};
// Work Cause Code Delete List
const get_work_workcausecode_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workcausecode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Action Code
const get_work_workactioncode = (site_cd) => {
   http.get(`/get_work_workactioncode.php?site_cd=${site_cd}`);
};
// Work Action Code select List
const get_work_workactioncode_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workactioncode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Action Code insert list
const get_work_workactioncode_insert = (data) => {
   http.post(`/get_work_workactioncode_insert.php?`, data);
};
// Work Action Code Update List
const get_work_workactioncode_update = (data) => {
   http.post(`/get_work_workactioncode_update.php?`, data);
};
// Work Action Code Delete List
const get_work_workactioncode_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workactioncode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Work Delay Code
const get_work_workdelaycode = (site_cd) => {
   http.get(`/get_work_workdelaycode.php?site_cd=${site_cd}`);
};
// Work Delay Code select List
const get_work_workdelaycode_select = (site_cd, rowid) => {
   http.get(
    `/get_work_workdelaycode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Work Delay Code insert list
const get_work_workdelaycode_insert = (data) => {
   http.post(`/get_work_workdelaycode_insert.php?`, data);
};
// Work Delay Code Update List
const get_work_workdelaycode_update = (data) => {
   http.post(`/get_work_workdelaycode_update.php?`, data);
};
// Work Delay Code Delete List
const get_work_workdelaycode_delete = (site_cd, rowid) => {
   http.get(
    `/get_work_workdelaycode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// ----------------------------------------------------------------------% Master Material %-----------------------------------------------------------------

// Material Location Category
const get_material_locationcategory = (site_cd) => {
   http.get(`/get_material_locationcategory.php?site_cd=${site_cd}`);
};
// Material Location Category List
const get_material_locationcategory_select = (site_cd, rowid) => {
   http.get(
    `/get_material_locationcategory_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Material Location Category insert list
const get_material_locationcategory_insert = (data) => {
   http.post(`/get_material_locationcategory_insert.php?`, data);
};
// Master Location Category update list
const get_material_locationcategory_update = (data) => {
   http.post(`/get_material_locationcategory_update.php?`, data);
};
// Material Location Category Delete List
const get_material_locationcategory_delete = (site_cd, rowid) => {
   http.get(
    `/get_material_locationcategory_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Material Location
const get_material_location = (site_cd) => {
   http.get(`/get_material_location.php?site_cd=${site_cd}`);
};
// Material Location List
const get_material_location_select = (site_cd, rowid) => {
   http.get(
    `/get_material_location_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Material Location  insert list
const get_material_location_insert = (data) => {
   http.post(`/get_material_location_insert.php?`, data);
};
// Material Location Update List
const get_material_location_update = (data) => {
   http.post(`/get_material_location_update.php?`, data);
};
// Material Location Delete List
const get_material_location_delete = (site_cd, rowid) => {
   http.get(
    `/get_material_location_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Material Status
const get_material_status = (site_cd) => {
   http.get(`/get_material_status.php?site_cd=${site_cd}`);
};
// Material Status List
const get_material_status_select = (site_cd, rowid) => {
   http.get(
    `/get_material_status_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Material Status  insert list
const get_material_status_insert = (data) => {
   http.post(`/get_material_status_insert.php?`, data);
};
// Material Status Update List
const get_material_status_update = (data) => {
   http.post(`/get_material_status_update.php?`, data);
};
// Material Status Delete List
const get_material_status_delete = (site_cd, rowid) => {
   http.get(
    `/get_material_status_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Material Commodity Code
const get_material_commoditycode = (site_cd) => {
   http.get(`/get_material_commoditycode.php?site_cd=${site_cd}`);
};
// Material Commodity Code List
const get_material_commoditycode_select = (site_cd, rowid) => {
   http.get(
    `/get_material_commoditycode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Material Commodity Code  insert list
const get_material_commoditycode_insert = (data) => {
   http.post(`/get_material_commoditycode_insert.php?`, data);
};
// Material Commodity Code Update List
const get_material_commoditycode_update = (data) => {
   http.post(`/get_material_commoditycode_update.php?`, data);
};
// Material Commodity Code Delete List
const get_material_commoditycode_delete = (site_cd, rowid) => {
   http.get(
    `/get_material_commoditycode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Material Group Code
const get_material_groupcode = (site_cd) => {
   http.get(`/get_material_groupcode.php?site_cd=${site_cd}`);
};
// Material Group Code List
const get_material_groupcode_select = (site_cd, rowid) => {
   http.get(
    `/get_material_groupcode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Material Group Code  insert list
const get_material_groupcode_insert = (data) => {
   http.post(`/get_material_commoditycode_insert.php?`, data);
};
// Material Group Code Update List
const get_material_groupcode_update = (data) => {
   http.post(`/get_material_groupcode_update.php?`, data);
};
// Material Group Code Delete List
const get_material_groupcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_material_groupcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// ----------------------------------------------------------------------% Master PM %-----------------------------------------------------------------

// Pm Frequency Code
const get_pm_frequencycode = (site_cd) => {
   http.get(`/get_pm_frequencycode.php?site_cd=${site_cd}`);
};
// Pm Frequency Code List
const get_pm_frequencycode_select = (site_cd, rowid) => {
   http.get(
    `/get_pm_frequencycode_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// PM Frequency Code insert list
const get_pm_frequencycode_insert = (data) => {
   http.post(`/get_pm_frequencycode_insert.php?`, data);
};
// PM Frequency Code Update List
const get_pm_frequencycode_update = (data) => {
   http.post(`/get_pm_frequencycode_update.php?`, data);
};
// PM Frequency Code Delete List
const get_pm_frequencycode_delete = (site_cd, rowid) => {
   http.get(
    `/get_pm_frequencycode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Pm Group Master
const get_pm_groupmaster = (site_cd) => {
   http.get(`/get_pm_groupmaster.php?site_cd=${site_cd}`);
};
// Pm Group Master List
const get_pm_groupmaster_select = (site_cd, rowid) => {
   http.get(
    `/get_pm_groupmaster_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// PM Group Master insert list
const get_pm_groupmaster_insert = (data) => {
   http.post(`/get_pm_groupmaster_insert.php?`, data);
};
// PM Group Master Update List
const get_pm_groupmaster_update = (data) => {
   http.post(`/get_pm_groupmaster_update.php?`, data);
};
// PM Group Master Delete List
const get_pm_groupmaster_delete = (site_cd, rowid) => {
   http.get(
    `/get_pm_groupmaster_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Pm Task Group
const get_pm_taskgroup = (site_cd) => {
   http.get(`/get_pm_taskgroup.php?site_cd=${site_cd}`);
};
// Pm Task Group list
const get_pm_taskgroup_select = (site_cd, rowid) => {
   http.get(
    `/get_pm_taskgroup_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// PM Task Group insert list
const get_pm_taskgroup_insert = (data) => {
   http.post(`/get_pm_taskgroup_insert.php?`, data);
};
// PM Task Group Update List
const get_pm_taskgroup_update = (data) => {
   http.post(`/get_pm_taskgroup_update.php?`, data);
};
// PM Task Group Delete List
const get_pm_taskgroup_delete = (site_cd, rowid) => {
   http.get(
    `/get_pm_taskgroup_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// ----------------------------------------------------------------------% Master Purchasing %-----------------------------------------------------------------

// Purchasing PR Status
const get_purchasing_prstatus = (site_cd) => {
   http.get(`/get_purchasing_prstatus.php?site_cd=${site_cd}`);
};
// Purchasing PR Status List
const get_purchasing_prstatus_select = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_prstatus_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Purchasing PR Status Insert
const get_purchasing_prstatus_insert = (data) => {
   http.post(`/get_purchasing_prstatus_insert.php?`, data);
};
// Purchasing PR Status Update List
const get_purchasing_prstatus_update = (data) => {
   http.post(`/get_purchasing_prstatus_update.php?`, data);
};
// Purchasing PR Status Delete List
const get_purchasing_prstatus_delete = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_prstatus_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Purchasing PO Status
const get_purchasing_postatus = (site_cd) => {
   http.get(`/get_purchasing_postatus.php?site_cd=${site_cd}`);
};
// Purchasing PO Status List
const get_purchasing_postatus_select = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_postatus_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Purchasing PO Status Insert
const get_purchasing_postatus_insert = (data) => {
   http.post(`/get_purchasing_postatus_insert.php?`, data);
};
// Purchasing PO Status Update List
const get_purchasing_postatus_update = (data) => {
   http.post(`/get_purchasing_postatus_update.php?`, data);
};
// Purchasing PO Status Delete List
const get_purchasing_postatus_delete = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_postatus_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Purchasing Contract Status
const get_purchasing_contractstatus = (site_cd) => {
   http.get(`/get_purchasing_contractstatus.php?site_cd=${site_cd}`);
};
// Purchasing Contract Status List
const get_purchasing_contractstatus_select = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_contractstatus_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Purchasing Contract Status Insert
const get_purchasing_contractstatus_insert = (data) => {
   http.post(`/get_purchasing_contractstatus_insert.php?`, data);
};
// Purchasing Contract Status Update List
const get_purchasing_contractstatus_update = (data) => {
   http.post(`/get_purchasing_contractstatus_update.php?`, data);
};
// Purchasing Contract Status Delete List
const get_purchasing_contractstatus_delete = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_contractstatus_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Purchasing Contract Group
const get_purchasing_contractgroup = (site_cd) => {
   http.get(`/get_purchasing_contractgroup.php?site_cd=${site_cd}`);
};
// Purchasing Contract Group List
const get_purchasing_contractgroup_select = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_contractgroup_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Purchasing Contract Group Insert
const get_purchasing_contractgroup_insert = (data) => {
   http.post(`/get_purchasing_contractgroup_insert.php?`, data);
};
// Purchasing Contract Group Update List
const get_purchasing_contractgroup_update = (data) => {
   http.post(`/get_purchasing_contractgroup_update.php?`, data);
};
// Purchasing Contract Group Delete List
const get_purchasing_contractgroup_delete = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_contractgroup_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Purchasing Type
const get_purchasing_type = (site_cd) => {
   http.get(`/get_purchasing_type.php?site_cd=${site_cd}`);
};
// Purchasing Type List
const get_purchasing_type_select = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_type_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Purchasing Type  Insert
const get_purchasing_type_insert = (data) => {
   http.post(`/get_purchasing_type_insert.php?`, data);
};
// Purchasing Type Update List
const get_purchasing_type_update = (data) => {
   http.post(`/get_purchasing_type_update.php?`, data);
};
// Purchasing Type Delete List
const get_purchasing_type_delete = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_type_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Purchasing Priority
const get_purchasing_priority = (site_cd) => {
   http.get(`/get_purchasing_priority.php?site_cd=${site_cd}`);
};
// Purchasing Priority List
const get_purchasing_priority_select = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_priority_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};
// Purchasing Priority Insert
const get_purchasing_priority_insert = (data) => {
   http.post(`/get_purchasing_priority_insert.php?`, data);
};
// Purchasing Priority Update List
const get_purchasing_priority_update = (data) => {
   http.post(`/get_purchasing_priority_update.php?`, data);
};
// Purchasing Priority Delete List
const get_purchasing_priority_delete = (site_cd, rowid) => {
   http.get(
    `/get_purchasing_priority_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// ----------------------------------------------------------------------% Master Purchasing %-----------------------------------------------------------------

// ----------------------------------------------------------------------% WorkRequest %-----------------------------------------------------------------

// WorkRequest Master List
const get_WorkRequestmaster = (site_cd, page, pageSize) => {
   http.get(
    `/get_workrequestmaster.php?site_cd=${site_cd}&page=${page}&pageSize=${pageSize}`
  );
};

// WorkRequest Master Select List
const get_workrequest_select = (RowID) => {
   http.get(
    `/get_workrequest_select.php?RowID=${RowID}`
  );
};

// Insert WorkRequest Master
const insert_new_workrequest = (data) => {
   http.post(`/insert_new_workrequest.php?`, data);
};

// Update WorkRequest Master
const update_workrequest = (data) => {
   http.post(`/update_workrequest.php?`, data);
};

// Insert WorkRequest Approval
const insert_work_request_approval = (data) => {
   http.post(`/insert_work_request_approval.php?`,data);
};

// Insert WorkRequest Disapproval
const insert_work_request_disapproval = (data) => {
   http.post(`/insert_work_request_disapproval.php?`,data);
};



// WorkRequest Type List
const get_workrequest_type = (site_cd) => {
   http.get(`/get_workrequest_type.php?site_cd=${site_cd}`);
};

// WorkRequest Type select List
const get_workrequest_type_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_type_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkRequest Type
const get_workrequest_type_insert = (data) => {
   http.post(`/get_workrequest_type_insert.php?`, data);
};

// Update WorkRequest Type
const get_workrequest_type_update = (data) => {
   http.post(`/get_workrequest_type_update.php?`, data);
};

// Delete WorkRequest Type
const get_workrequest_type_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_type_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkRequest GroupCode List
const get_workrequest_group_code = (site_cd) => {
   http.get(`/get_workrequest_group_code.php?site_cd=${site_cd}`);
};

// WorkRequest Group Code select List
const get_workrequest_group_cd_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_group_cd_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert GroupCode
const get_workrequest_groupcode_insert = (data) => {
   http.post(`/get_workrequest_groupcode_insert.php?`, data);
};

// Update GroupCode
const get_workrequest_groupcode_update = (data) => {
   http.post(`/get_workrequest_groupcode_update.php?`, data);
};

// Delete GroupCode
const get_workrequest_groupcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_groupcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkRequest Code List
const get_workrequest_code = (site_cd) => {
   http.get(`/get_workrequest_code.php?site_cd=${site_cd}`);
};

// WorkRequest Code select List
const get_workrequest_code_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_code_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkRequest Code
const get_workrequest_code_insert = (data) => {
   http.post(`/get_workrequest_code_insert.php?`, data);
};

// Update WorkRequest Code
const get_workrequest_code_update = (data) => {
   http.post(`/get_workrequest_code_update.php?`, data);
};

// Delete WorkRequest Code
const get_workrequest_code_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_code_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Critical Factor List
const get_workrequest_critical_factor = (site_cd) => {
   http.get(`/get_workrequest_critical_factor.php?site_cd=${site_cd}`);
};

// Critical Factor select List
const get_workrequest_critical_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_critical_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Critical Factor
const get_workrequest_criticalfactor_insert = (data) => {
   http.post(`/get_workrequest_criticalfactor_insert.php?`, data);
};

// Update Critical Factor
const get_workrequest_criticalfactor_update = (data) => {
   http.post(`/get_workrequest_criticalfactor_update.php?`, data);
};

// Delete Critical Factor List
const get_workrequest_criticalfactor_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_criticalfactor_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};


// WorkRequest Status List
const get_workrequest_status = (site_cd) => {
   http.get(`/get_workrequest_status.php?site_cd=${site_cd}`);
};

// WorkRequest select List
const get_workrequest_status_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_status_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Status Type List
const get_workrequest_status_type = (site_cd) => {
   http.get(`/get_workrequest_status_type.php?site_cd=${site_cd}`);
};

// Insert WorkRequest Status
const get_workrequest_status_insert = (data) => {
   http.post(`/get_workrequest_status_insert.php?`, data);
};

// Update WorkRequest Status
const get_workrequest_status_update = (data) => {
   http.post(`/get_workrequest_status_update.php?`, data);
};

// Delete WorkRequest Status
const get_workrequest_status_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_status_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Work Area List
const get_workrequest_work_area = (site_cd) => {
   http.get(`/get_workrequest_work_area.php?site_cd=${site_cd}`);
};

// Work Area select List
const get_workrequest_workarea_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_workarea_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkRequest Status
const get_workrequest_workarea_insert = (data) => {
   http.post(`/get_workrequest_workarea_insert.php?`, data);
};

// Update WorkRequest Status
const get_workrequest_workarea_update = (data) => {
   http.post(`/get_workrequest_workarea_update.php?`, data);
};

// Delete WorkRequest Status
const get_workrequest_workarea_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_workarea_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkRequest Location
const get_workrequest_location = (site_cd) => {
   http.get(`/get_workrequest_location.php?site_cd=${site_cd}`);
};

// WorkRequest Location select List
const get_workrequest_location_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_location_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkRequest Location
const get_workrequest_location_insert = (data) => {
   http.post(`/get_workrequest_location_insert.php?`, data);
};

// Update WorkRequest Location
const get_workrequest_location_update = (data) => {
   http.post(`/get_workrequest_location_update.php?`, data);
};

// Delete WorkRequest Location
const get_workrequest_location_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_location_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkRequest Level
const get_workrequest_level = (site_cd) => {
   http.get(`/get_workrequest_level.php?site_cd=${site_cd}`);
};

// WorkRequest Level select List
const get_workrequest_level_select = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_level_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkRequest Level
const get_workrequest_level_insert = (data) => {
   http.post(`/get_workrequest_level_insert.php?`, data);
};

// Update WorkRequest Level
const get_workrequest_level_update = (data) => {
   http.post(`/get_workrequest_level_update.php?`, data);
};

// Delete WorkRequest Level
const get_workrequest_level_delete = (site_cd, rowid) => {
   http.get(
    `/get_workrequest_level_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// WorkRequest Master Maintenance 1
const get_workrequestmaster_list1 = (site_cd, RowID) => {
   http.get(`/get_workrequestmaster_list1.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// WorkRequest Master Maintenance 2
const get_workrequestmaster_list2 = (site_cd, RowID) => {
   http.get(`/get_workrequestmaster_list2.php?site_cd=${site_cd}&RowID=${RowID}`);
};


// ----------------------------------------------------------------------% Work Order %-----------------------------------------------------------------

// WorkOrder Master List
const get_workordermaster = (site_cd, page, pageSize) => {
   http.get(
    `/get_workordermaster.php?site_cd=${site_cd}&page=${page}&pageSize=${pageSize}`
  );
};

// WorkOrder Master Select List
const get_workordermaster_select = (RowID) => {
   http.get(`/get_workordermaster_select.php?RowID=${RowID}`);
};

// Insert WorkOrder Master
const insert_new_workorder = (data) => {
   http.post(`/insert_new_workorder.php?`, data);
};

// Update WorkOrder Master
const update_workorder = (data) => {
   http.post(`/update_workorder.php?`, data);
};



// WorkOrder Type List
const get_workorder_type = (site_cd) => {
   http.get(`/get_workorder_type.php?site_cd=${site_cd}`);
};

// WorkOrder Type select List
const get_workorder_type_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_type_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkOrder Type
const get_workorder_type_insert = (data) => {
   http.post(`/get_workorder_type_insert.php?`, data);
};

// Update WorkOrder Type
const get_workorder_type_update = (data) => {
   http.post(`/get_workorder_type_update.php?`, data);
};

// Delete WorkOrder Type
const get_workorder_type_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_type_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkOrder GroupCode List
const get_workorder_group_code = (site_cd) => {
   http.get(`/get_workorder_group_code.php?site_cd=${site_cd}`);
};

// WorkOrder Group Code select List
const get_workorder_group_cd_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_group_cd_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert GroupCode
const get_workorder_groupcode_insert = (data) => {
   http.post(`/get_workorder_groupcode_insert.php?`, data);
};

// Update GroupCode
const get_workorder_groupcode_update = (data) => {
   http.post(`/get_workorder_groupcode_update.php?`, data);
};

// Delete GroupCode
const get_workorder_groupcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_groupcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkOrder Code List
const get_workorder_code = (site_cd) => {
   http.get(`/get_workorder_code.php?site_cd=${site_cd}`);
};

// WorkOrder Code select List
const get_workorder_code_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_code_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkOrder Code
const get_workorder_code_insert = (data) => {
   http.post(`/get_workorder_code_insert.php?`, data);
};

// Update WorkOrder Code
const get_workorder_code_update = (data) => {
   http.post(`/get_workorder_code_update.php?`, data);
};

// Delete WorkOrder Code
const get_workorder_code_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_code_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Critical Factor List
const get_workorder_critical_factor = (site_cd) => {
   http.get(`/get_workorder_critical_factor.php?site_cd=${site_cd}`);
};

// Critical Factor select List
const get_workorder_critical_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_critical_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Critical Factor
const get_workorder_criticalfactor_insert = (data) => {
   http.post(`/get_workorder_criticalfactor_insert.php?`, data);
};

// Update Critical Factor
const get_workorder_criticalfactor_update = (data) => {
   http.post(`/get_workorder_criticalfactor_update.php?`, data);
};

// Delete Critical Factor List
const get_workorder_criticalfactor_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_criticalfactor_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkOrder Status List
const get_workorder_status = (site_cd) => {
   http.get(`/get_workorder_status.php?site_cd=${site_cd}`);
};

// WorkOrder select List
const get_workorder_status_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_status_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Status Type List
const get_workorder_status_type = (site_cd) => {
   http.get(`/get_workorder_status_type.php?site_cd=${site_cd}`);
};

// Insert WorkOrder Status
const get_workorder_status_insert = (data) => {
   http.post(`/get_workorder_status_insert.php?`, data);
};

// Update WorkOrder Status
const get_workorder_status_update = (data) => {
   http.post(`/get_workorder_status_update.php?`, data);
};

// Delete WorkOrder Status
const get_workorder_status_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_status_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Work Area List
const get_workorder_work_area = (site_cd) => {
   http.get(`/get_workorder_work_area.php?site_cd=${site_cd}`);
};

// Work Area select List
const get_workorder_workarea_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_workarea_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkOrder Status
const get_workorder_workarea_insert = (data) => {
   http.post(`/get_workorder_workarea_insert.php?`, data);
};

// Update WorkOrder Status
const get_workorder_workarea_update = (data) => {
   http.post(`/get_workorder_workarea_update.php?`, data);
};

// Delete WorkOrder Status
const get_workorder_workarea_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_workarea_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkOrder Location
const get_workorder_location = (site_cd) => {
   http.get(`/get_workorder_location.php?site_cd=${site_cd}`);
};

// WorkOrder Location select List
const get_workorder_location_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_location_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkOrder Location
const get_workorder_location_insert = (data) => {
   http.post(`/get_workorder_location_insert.php?`, data);
};

// Update WorkOrder Location
const get_workorder_location_update = (data) => {
   http.post(`/get_workorder_location_update.php?`, data);
};

// Delete WorkOrder Location
const get_workorder_location_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_location_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// WorkOrder Level
const get_workorder_level = (site_cd) => {
   http.get(`/get_workorder_level.php?site_cd=${site_cd}`);
};

// WorkOrder Level select List
const get_workorder_level_select = (site_cd, rowid) => {
   http.get(
    `/get_workorder_level_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert WorkOrder Level
const get_workorder_level_insert = (data) => {
   http.post(`/get_workorder_level_insert.php?`, data);
};

// Update WorkOrder Level
const get_workorder_level_update = (data) => {
   http.post(`/get_workorder_level_update.php?`, data);
};

// Delete WorkOrder Level
const get_workorder_level_delete = (site_cd, rowid) => {
   http.get(
    `/get_workorder_level_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// WorkOrder Master Material
const get_workordermaster_material = (site_cd, RowID) => {
   http.get(`/get_workordermaster_material.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// WorkOrder Master Special Order
const get_workordermaster_specialorder = (site_cd, RowID) => {
   http.get(`/get_workordermaster_specialorder.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// WorkOrder Master Out Source Contract
const get_workordermaster_outsourcecontract = (site_cd, RowID) => {
   http.get(`/get_workordermaster_outsourcecontract.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// WorkOrder Master Time Card
const get_workordermaster_timecard = (site_cd, RowID) => {
   http.get(`/get_workordermaster_timecard.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// WorkOrder Master New Time Card
const insert_new_workorder_timecard = (data) => {
   http.get(`/insert_new_workorder_timecard.php?`, data);
};

// WorkOrder Master Misc
const get_workordermaster_misc = (site_cd, RowID) => {
   http.get(`/get_workordermaster_misc.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// WorkOrder Master Status Audit
const get_workordermaster_statusaudit = (site_cd, wko_sts_wo_no, RowID) => {
   http.get(`/get_workordermaster_statusaudit.php?site_cd=${site_cd}&wko_sts_wo_no=${wko_sts_wo_no}&RowID=${RowID}`);
};


// ----------------------------------------------------------------------% WorkRequest %-----------------------------------------------------------------

// Inventory  Master List
const get_inventorymaster = (site_cd, page, pageSize) => {
   http.get(
    `/get_inventorymaster.php?site_cd=${site_cd}&page=${page}&pageSize=${pageSize}`
  );
};

// Inventory Master Select List
const get_inventorymaster_select = (RowID) => {
   http.get(`/get_inventorymaster_select.php?RowID=${RowID}`);
};

// Insert Inventory Master
const insert_new_inventory = (data) => {
   http.post(`/insert_new_inventory.php?`, data);
};

// Update Inventory Master
const update_inventory = (data) => {
   http.post(`/update_inventory.php?`, data);
};



// Inventory Type List
const get_inventory_type = (site_cd) => {
   http.get(`/get_inventory_type.php?site_cd=${site_cd}`);
};

// Inventory Type select List
const get_inventory_type_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_type_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Inventory Type
const get_inventory_type_insert = (data) => {
   http.post(`/get_inventory_type_insert.php?`, data);
};

// Update Inventory Type
const get_inventory_type_update = (data) => {
   http.post(`/get_inventory_type_update.php?`, data);
};

// Delete Inventory Type
const get_inventory_type_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_type_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Inventory GroupCode List
const get_inventory_group_code = (site_cd) => {
   http.get(`/get_inventory_group_code.php?site_cd=${site_cd}`);
};

// Inventory Group Code select List
const get_inventory_group_cd_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_group_cd_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Inventory
const get_inventory_groupcode_insert = (data) => {
   http.post(`/get_inventory_groupcode_insert.php?`, data);
};

// Update Inventory
const get_inventory_groupcode_update = (data) => {
   http.post(`/get_inventory_groupcode_update.php?`, data);
};

// Delete Inventory
const get_inventory_groupcode_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_groupcode_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Inventory Code List
const get_inventory_code = (site_cd) => {
   http.get(`/get_inventory_code.php?site_cd=${site_cd}`);
};

// Inventory Code select List
const get_inventory_code_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_code_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Inventory Code
const get_inventory_code_insert = (data) => {
   http.post(`/get_inventory_code_insert.php?`, data);
};

// Update Inventory Code
const get_inventory_code_update = (data) => {
   http.post(`/get_inventory_code_update.php?`, data);
};

// Delete Inventory Code
const get_inventory_code_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_code_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Critical Factor List
const get_inventory_critical_factor = (site_cd) => {
   http.get(`/get_inventory_critical_factor.php?site_cd=${site_cd}`);
};

// Critical Factor select List
const get_inventory_critical_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_critical_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Critical Factor
const get_inventory_criticalfactor_insert = (data) => {
   http.post(`/get_inventory_criticalfactor_insert.php?`, data);
};

// Update Critical Factor
const get_inventory_criticalfactor_update = (data) => {
   http.post(`/get_inventory_criticalfactor_update.php?`, data);
};

// Delete Critical Factor List
const get_inventory_criticalfactor_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_criticalfactor_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Inventory Status List
const get_inventory_status = (site_cd) => {
   http.get(`/get_inventory_status.php?site_cd=${site_cd}`);
};

// Inventory select List
const get_inventory_status_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_status_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Status Type List
const get_inventory_status_type = (site_cd) => {
   http.get(`/get_inventory_status_type.php?site_cd=${site_cd}`);
};

// Insert Inventory Status
const get_inventory_status_insert = (data) => {
   http.post(`/get_inventory_status_insert.php?`, data);
};

// Update Inventory Status
const get_inventory_status_update = (data) => {
   http.post(`/get_inventory_status_update.php?`, data);
};

// Delete Inventory Status
const get_inventory_status_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_status_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Work Area List
const get_inventory_work_area = (site_cd) => {
   http.get(`/get_inventory_work_area.php?site_cd=${site_cd}`);
};

// Work Area select List
const get_inventory_workarea_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_workarea_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Inventory Status
const get_inventory_workarea_insert = (data) => {
   http.post(`/get_inventory_workarea_insert.php?`, data);
};

// Update Inventory Status
const get_inventory_workarea_update = (data) => {
   http.post(`/get_inventory_workarea_update.php?`, data);
};

// Delete Inventory Status
const get_inventory_workarea_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_workarea_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Inventory Location
const get_inventory_location = (site_cd) => {
   http.get(`/get_inventory_location.php?site_cd=${site_cd}`);
};

// Inventory Location select List
const get_inventory_location_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_location_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Inventory Location
const get_inventory_location_insert = (data) => {
   http.post(`/get_inventory_location_insert.php?`, data);
};

// Update Inventory Location
const get_inventory_location_update = (data) => {
   http.post(`/get_inventory_location_update.php?`, data);
};

// Delete Inventory Location
const get_inventory_location_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_location_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};



// Inventory Level
const get_inventory_level = (site_cd) => {
   http.get(`/get_inventory_level.php?site_cd=${site_cd}`);
};

// Inventory Level select List
const get_inventory_level_select = (site_cd, rowid) => {
   http.get(
    `/get_inventory_level_select.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Insert Inventory Level
const get_inventory_level_insert = (data) => {
   http.post(`/get_inventory_level_insert.php?`, data);
};

// Update Inventory Level
const get_inventory_level_update = (data) => {
   http.post(`/get_inventory_level_update.php?`, data);
};

// Delete Inventory Level
const get_inventory_level_delete = (site_cd, rowid) => {
   http.get(
    `/get_inventory_level_delete.php?site_cd=${site_cd}&RowID=${rowid}`
  );
};

// Inventory Master Location
const get_inventorymaster_location = (site_cd, RowID) => {
   http.get(`/get_inventorymaster_location.php?site_cd=${site_cd}&RowID=${RowID}`);
};

// Inventory Master Location
const get_inventorymaster_supplier = (site_cd, RowID) => {
   http.get(`/get_inventorymaster_supplier.php?site_cd=${site_cd}&RowID=${RowID}`);
};



const APIServices = {

  
  get_employeemaster,
  get_employeemaster_select,
  insert_new_employee,
  update_employee,

  get_employee_type,
  get_employee_type_select,
  get_employee_type_insert,
  get_employee_type_update,
  get_employee_type_delete,

  get_employee_group_code,
  get_employee_group_cd_select,
  get_employee_groupcode_insert,
  get_employee_groupcode_update,
  get_employee_groupcode_delete,

  get_employee_code,
  get_employee_code_select,
  get_employee_code_insert,
  get_employee_code_update,
  get_employee_code_delete,

  get_employee_critical_factor,
  get_employee_critical_select,
  get_employee_criticalfactor_insert,
  get_employee_criticalfactor_update,
  get_employee_criticalfactor_delete,

  get_employee_status,
  get_employee_status_select,
  get_employee_status_type,
  get_employee_status_insert,
  get_employee_status_update,
  get_employee_status_delete,

  get_employee_work_area,
  get_employee_workarea_select,
  get_employee_workarea_insert,
  get_employee_workarea_update,
  get_employee_workarea_delete,

  get_employee_location,
  get_employee_location_select,
  get_employee_location_insert,
  get_employee_location_update,
  get_employee_location_delete,

  get_employee_level,
  get_employee_level_select,
  get_employee_level_insert,
  get_employee_level_update,
  get_employee_level_delete,

  get_employeemaster_maintenance,
  get_employeemaster_pr_approval,
  get_employeemaster_mr_approval,
  get_employeemaster_stock_location,

  get_sitecode,
  authenticate_login,
  get_dropdown,
  get_dropdown_ParentFlag,
  get_assetmaster,
  get_assetmaster_old,
  get_assetmaster_select,
  insert_new_asset,
  update_asset,

  get_systemdefaultsetting_status,
  get_systemdefaultsetting_select,
  update_systemdefaultsetting,

  get_master_usergroup,
  get_master_usergroup_select,
  get_master_usergroup_insert,
  get_master_usergroup_update,
  get_master_usergroup_delete,

  get_master_autonumber,
  get_master_autonumber_select,
  get_master_autonumber_update,

  get_master_craftcode,
  get_master_craftcode_select,
  get_master_craftcode_insert,
  get_master_craftcode_update,
  get_master_craftcode_delete,

  get_master_statuscategory,
  get_master_statuscategory_select,
  get_master_statuscategory_update,

  get_master_statustype,
  get_master_statustype_select,
  get_master_statustype_update,

  get_master_costcenter,
  get_master_costcenter_insert,
  get_master_costcenter_select,
  get_master_costcenter_update,
  get_master_costcenter_delete,

  get_master_account,
  get_master_account_select,
  get_master_account_insert,
  get_master_account_update,
  get_master_account_delete,

  get_master_currencycode,
  get_master_currencycode_select,
  get_master_currencycode_insert,
  get_master_currencycode_update,
  get_master_currencycode_delete,

  get_master_taxcode,
  get_master_taxcode_select,
  get_master_taxcode_insert,
  get_master_taxcode_update,
  get_master_taxcode_delete,

  get_master_uomtype,
  get_master_uomtype_select,
  get_master_uomtype_update,

  get_master_uommaster,
  get_master_uommaster_select,
  get_master_uommaster_insert,
  get_master_uommaster_update,
  get_master_uommaster_delete,

  get_master_uomconfactor,
  get_master_uomconfactor_select,
  get_master_uomconfactor_insert,
  get_master_uomconfactor_update,
  get_master_uomconfactor_delete,

  get_master_billto,
  get_master_billto_select,
  get_master_billto_insert,
  get_master_billto_update,
  get_master_billto_delete,

  get_master_shipto,
  get_master_shipto_select,
  get_master_shipto_insert,
  get_master_shipto_update,
  get_master_shipto_delete,

  get_master_supplierstatus,
  get_master_supplierstatus_select,
  get_master_supplierstatus_insert,
  get_master_supplierstatus_update,
  get_master_supplierstatus_delete,

  get_master_projectmaster,
  get_master_projectmaster_select,
  get_master_projectmaster_insert,
  get_master_projectmaster_update,
  get_master_projectmaster_delete,

  get_master_customerstatus,
  get_master_customerstatus_select,
  get_master_customerstatus_insert,
  get_master_customerstatus_update,
  get_master_customerstatus_delete,

  get_material_locationcategory,
  get_material_locationcategory_select,
  get_material_locationcategory_insert,
  get_material_locationcategory_update,
  get_material_locationcategory_delete,

  get_material_location,
  get_material_location_select,
  get_material_location_insert,
  get_material_location_update,
  get_material_location_delete,

  get_material_status,
  get_material_status_select,
  get_material_status_insert,
  get_material_status_update,
  get_material_status_delete,

  get_material_commoditycode,
  get_material_commoditycode_select,
  get_material_commoditycode_insert,
  get_material_commoditycode_update,
  get_material_commoditycode_delete,

  get_material_groupcode,
  get_material_groupcode_select,
  get_material_groupcode_insert,
  get_material_groupcode_update,
  get_material_groupcode_delete,

  get_asset_type,
  get_asset_type_select,
  get_asset_type_update,
  get_asset_type_insert,
  get_asset_type_delete,

  get_asset_group_code,
  get_asset_group_cd_select,
  get_asset_groupcode_insert,
  get_asset_groupcode_update,
  get_asset_groupcode_delete,

  get_asset_code,
  get_asset_code_select,
  get_asset_code_insert,
  get_asset_code_update,
  get_asset_code_delete,

  get_asset_critical_factor,
  get_asset_critical_select,
  get_asset_criticalfactor_insert,
  get_asset_criticalfactor_update,
  get_asset_criticalfactor_delete,

  get_asset_status,
  get_asset_status_select,
  get_status_type,
  get_asset_status_insert,
  get_asset_status_update,
  get_asset_status_delete,

  get_asset_work_area,
  get_asset_workarea_select,
  get_asset_workarea_insert,
  get_asset_workarea_update,
  get_asset_workarea_delete,

  get_asset_location,
  get_asset_location_select,
  get_asset_location_insert,
  get_asset_location_update,
  get_asset_location_delete,

  get_asset_level,
  get_asset_level_select,
  get_asset_level_insert,
  get_asset_level_update,
  get_asset_level_delete,
  
  get_assetpmsetup,
  get_assetwohistory,
  get_assetrelocationhistory,
  get_assetchecklist,
  
  get_assetspares,
  get_assetusage,
  get_assetspecification,
  get_assetmaster_statusaudit,

  get_work_workstatus,
  get_work_workstatus_select,
  get_work_workstatus_insert,
  get_work_workstatus_update,
  get_work_workstatus_delete,

  get_work_workpriority,
  get_work_workpriority_select,
  get_work_workpriority_insert,
  get_work_workpriority_update,
  get_work_workpriority_delete,

  get_work_workgroup,
  get_work_workgroup_select,
  get_work_workgroup_insert,
  get_work_workgroup_update,
  get_work_workgroup_delete,

  get_work_workclass,
  get_work_workclass_select,
  get_work_workclass_insert,
  get_work_workclass_update,
  get_work_workclass_delete,

  get_work_worktype,
  get_work_worktype_select,
  get_work_worktype_insert,
  get_work_worktype_update,
  get_work_worktype_delete,

  get_work_workfaultcode,
  get_work_workfaultcode_select,
  get_work_workfaultcode_insert,
  get_work_workfaultcode_update,
  get_work_workfaultcode_delete,

  get_work_workcausecode,
  get_work_workcausecode_select,
  get_work_workcausecode_insert,
  get_work_workcausecode_update,
  get_work_workcausecode_delete,

  get_work_workactioncode,
  get_work_workactioncode_select,
  get_work_workactioncode_insert,
  get_work_workactioncode_update,
  get_work_workactioncode_delete,

  get_work_workdelaycode,
  get_work_workdelaycode_select,
  get_work_workdelaycode_insert,
  get_work_workdelaycode_update,
  get_work_workdelaycode_delete,

  get_pm_frequencycode,
  get_pm_frequencycode_select,
  get_pm_frequencycode_insert,
  get_pm_frequencycode_update,
  get_pm_frequencycode_delete,

  get_pm_groupmaster,
  get_pm_groupmaster_select,
  get_pm_groupmaster_insert,
  get_pm_groupmaster_update,
  get_pm_groupmaster_delete,

  get_pm_taskgroup,
  get_pm_taskgroup_select,
  get_pm_taskgroup_insert,
  get_pm_taskgroup_update,
  get_pm_taskgroup_delete,

  get_purchasing_prstatus,
  get_purchasing_prstatus_select,
  get_purchasing_prstatus_insert,
  get_purchasing_prstatus_update,
  get_purchasing_prstatus_delete,

  get_purchasing_postatus,
  get_purchasing_postatus_select,
  get_purchasing_postatus_insert,
  get_purchasing_postatus_update,
  get_purchasing_postatus_delete,

  get_purchasing_contractstatus,
  get_purchasing_contractstatus_select,
  get_purchasing_contractstatus_insert,
  get_purchasing_contractstatus_update,
  get_purchasing_contractstatus_delete,

  get_purchasing_contractgroup,
  get_purchasing_contractgroup_select,
  get_purchasing_contractgroup_insert,
  get_purchasing_contractgroup_update,
  get_purchasing_contractgroup_delete,

  get_purchasing_type,
  get_purchasing_type_select,
  get_purchasing_type_insert,
  get_purchasing_type_update,
  get_purchasing_type_delete,

  get_purchasing_priority,
  get_purchasing_priority_select,
  get_purchasing_priority_insert,
  get_purchasing_priority_update,
  get_purchasing_priority_delete,

  get_WorkRequestmaster,
  get_workrequest_select,
  insert_new_workrequest,
  update_workrequest,

  insert_work_request_approval,
  insert_work_request_disapproval,

  get_workrequest_type,
  get_workrequest_type_select,
  get_workrequest_type_insert,
  get_workrequest_type_update,
  get_workrequest_type_delete,

  get_workrequest_group_code,
  get_workrequest_group_cd_select,
  get_workrequest_groupcode_insert,
  get_workrequest_groupcode_update,
  get_workrequest_groupcode_delete,

  get_workrequest_code,
  get_workrequest_code_select,
  get_workrequest_code_insert,
  get_workrequest_code_update,
  get_workrequest_code_delete,

  get_workrequest_critical_factor,
  get_workrequest_critical_select,
  get_workrequest_criticalfactor_insert,
  get_workrequest_criticalfactor_update,
  get_workrequest_criticalfactor_delete,

  get_workrequest_status,
  get_workrequest_status_select,
  get_workrequest_status_type,
  get_workrequest_status_insert,
  get_workrequest_status_update,
  get_workrequest_status_delete,

  get_workrequest_work_area,
  get_workrequest_workarea_select,
  get_workrequest_workarea_insert,
  get_workrequest_workarea_update,
  get_workrequest_workarea_delete,

  get_workrequest_location,
  get_workrequest_location_select,
  get_workrequest_location_insert,
  get_workrequest_location_update,
  get_workrequest_location_delete,
  
  get_workrequest_level,
  get_workrequest_level_select,
  get_workrequest_level_insert,
  get_workrequest_level_update,
  get_workrequest_level_delete,

  get_workrequestmaster_list1,
  get_workrequestmaster_list2,

  get_workordermaster,
  get_workordermaster_select,
  insert_new_workorder,
  update_workorder,
    
  get_workorder_type,
  get_workorder_type_select,
  get_workorder_type_insert,
  get_workorder_type_update,
  get_workorder_type_delete,

  get_workorder_group_code,
  get_workorder_group_cd_select,
  get_workorder_groupcode_insert,
  get_workorder_groupcode_update,
  get_workorder_groupcode_delete,

  get_workorder_code,
  get_workorder_code_select,
  get_workorder_code_insert,
  get_workorder_code_update,
  get_workorder_code_delete,

  get_workorder_critical_factor,
  get_workorder_critical_select,
  get_workorder_criticalfactor_insert,
  get_workorder_criticalfactor_update,
  get_workorder_criticalfactor_delete,

  get_workorder_status,
  get_workorder_status_select,
  get_workorder_status_type,
  get_workorder_status_insert,
  get_workorder_status_update,
  get_workorder_status_delete,

  get_workorder_work_area,
  get_workorder_workarea_select,
  get_workorder_workarea_insert,
  get_workorder_workarea_update,
  get_workorder_workarea_delete,

  get_workorder_location,
  get_workorder_location_select,
  get_workorder_location_insert,
  get_workorder_location_update,
  get_workorder_location_delete,

  get_workorder_level,
  get_workorder_level_select,
  get_workorder_level_insert,
  get_workorder_level_update,
  get_workorder_level_delete,

  get_workordermaster_material,
  get_workordermaster_specialorder,
  get_workordermaster_outsourcecontract,
  get_workordermaster_timecard,
  insert_new_workorder_timecard,
  get_workordermaster_misc,
  get_workordermaster_statusaudit,

  get_inventorymaster,
  get_inventorymaster_select,
  insert_new_inventory,
  update_inventory,
  
  get_inventory_type,
  get_inventory_type_select,
  get_inventory_type_insert,
  get_inventory_type_update,
  get_inventory_type_delete,
  
  get_inventory_group_code,
  get_inventory_group_cd_select,
  get_inventory_groupcode_insert,
  get_inventory_groupcode_update,
  get_inventory_groupcode_delete,
  
  get_inventory_code,
  get_inventory_code_select,
  get_inventory_code_insert,
  get_inventory_code_update,
  get_inventory_code_delete,
  
  get_inventory_critical_factor,
  get_inventory_critical_select,
  get_inventory_criticalfactor_insert,
  get_inventory_criticalfactor_update,
  get_inventory_criticalfactor_delete,
  
  get_inventory_status,
  get_inventory_status_select,
  get_inventory_status_type,
  get_inventory_status_insert,
  get_inventory_status_update,
  get_inventory_status_delete,
  
  get_inventory_work_area,
  get_inventory_workarea_select,
  get_inventory_workarea_insert,
  get_inventory_workarea_update,
  get_inventory_workarea_delete,
  
  get_inventory_location,
  get_inventory_location_select,
  get_inventory_location_insert,
  get_inventory_location_update,
  get_inventory_location_delete,
  
  get_inventory_level,
  get_inventory_level_select,
  get_inventory_level_insert,
  get_inventory_level_update,
  get_inventory_level_delete,

  get_inventorymaster_location,
  get_inventorymaster_supplier,


};

export default APIServices;
