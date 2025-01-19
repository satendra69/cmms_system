import PmLabor from "./PmLabor";
import PmMaterial from "./PmMaterial";
import PmSpecialOrder from "./PmSpecialOrder";
import PmContreact from "./PmContract";
import PmTool from "./PmTool";

const AllPlanningModule = ({ data }) => {
 // console.log("RowID____", data);
  return (
    <div>
      {/*************************************** Labor **************************************************/}
      <div>

        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <PmLabor
              data={data}
            />
          </div>
        </div>
      </div>
      <br/ >
      {/*************************************** Material **************************************************/}

      <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <PmMaterial
              data={data}
            />
          </div>
        </div>
        <br/ >
      {/*************************************** Special Order **************************************************/}
      
      <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <PmSpecialOrder
              data={data}
            />
          </div>
        </div>
        <br/ >
      {/*************************************** Contract **************************************************/}
      <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <PmContreact
              data={data}
            />
          </div>
        </div>
        <br/ >
        {/*************************************** Pm Tool **************************************************/}
        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "4px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
            }}
          >
            <PmTool
              data={data}
            />
          </div>
        </div>
    </div>
  );
};

export default AllPlanningModule;
