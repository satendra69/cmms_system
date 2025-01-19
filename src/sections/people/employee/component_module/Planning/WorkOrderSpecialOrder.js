import React, { useState, useEffect } from "react";

import WorkOrderMaterial from "./WorkOrderMaterial";
import WorkorderSpecial  from "./WorkOrderSpecial";
import WorkOrderOutsource from "./WorkOrderOutsource";
import WorkOrderMisc from "./WorkOrderMisc";
// import WorkOrderMaterial from "../tables/WorkOrderMaterial";
// import WorkOrderOutsourceContract from "../tables/WorkOrderOutsourceContract";
// import WorkOrderMisc from "../tables/WorkOrderMisc";

const WorkOrderSpecialOrder = ({ data }) => {
 // console.log("RowID____", data);
  return (
    <div>
      {/*************************************** Material **************************************************/}
      <div>

        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <WorkOrderMaterial
              data={data}
            />
          </div>
        </div>
      </div>

      <br />

      {/*************************************** Special Order **************************************************/}

      <br />
      <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <WorkorderSpecial
              data={data}
            />
          </div>
        </div>
      {/*************************************** Outsource Contract (PR) **************************************************/}
      
      <br />
      <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <WorkOrderOutsource
              data={data}
            />
          </div>
        </div>

      {/*************************************** Misc **************************************************/}
      <div>
        {/* <div style={{ paddingBottom: '20px', backgroundColor: 'white' }}>
                <h3 className="page-title">Misc</h3>
            </div> */}

        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <WorkOrderMisc
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderSpecialOrder;
