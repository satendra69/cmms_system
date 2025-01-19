
import WorkOrderMaterial from "./WorkOrderMaterial";
import WorkorderSpecial  from "./WorkOrderSpecial";
import WorkOrderOutsource from "./WorkOrderOutsource";
import WorkOrderMisc from "./WorkOrderMisc";


const WorkOrderSpecialOrder = ({ data }) => {
 // console.log("RowID____", data);
  return (
    <div>
      {/*************************************** Material **************************************************/}
      <div>

        <div className="card">
          <div
            className="card-body SubModule"
           
          >
            <WorkOrderMaterial
              data={data}
            />
          </div>
        </div>
      </div>

      <br />

      {/*************************************** Special Order **************************************************/}

   
      <div className="card">
          <div
            className="card-body SubModule"
            
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
            className="card-body SubModule"
           
          >
            <WorkOrderOutsource
              data={data}
            />
          </div>
        </div>

      {/*************************************** Misc **************************************************/}
      <br />
      <div>
        {/* <div style={{ paddingBottom: '20px', backgroundColor: 'white' }}>
                <h3 className="page-title">Misc</h3>
            </div> */}

        <div className="card">
          <div
            className="card-body SubModule"
           
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
