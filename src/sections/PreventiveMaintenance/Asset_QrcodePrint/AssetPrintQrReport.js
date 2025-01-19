/* eslint react/prop-types: 0 */
import React, { useRef , forwardRef ,useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import QRCode from "react-qr-code";

const DataToPrint = React.forwardRef(({ data }, ref) => {
    
    function truncateText(text, maxLength) {
        if (text && text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        } else {
          return text;
        }
      }
    return (
      <div ref={ref}>
     
        {data.map((item, index) => (
           <div key={index} className='AssetPrintmainDiv'>
        
           <div className='AssetPrintfirstDiv'>
               {/* <QRCode value="1111" size={item.FontSize !== "undefined" ? item.FontSize : 100} /> */}
               <QRCode value={item.ast_mst_asset_no} size={60} width={100}/>

           </div>
           <div className='AssetPrintsecondDiv'>
               <div style={{ marginBottom: '10px' }}>
                   <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600"  }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}># :</span> {item.ast_mst_asset_no}</span>
                   <span style={{ display: 'block',fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>C :</span> {item.ast_mst_cost_center}</span>
                   <span style={{ display: 'block',fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>L :</span> {item.ast_mst_asset_locn}</span>
                   <span style={{ display: 'block',fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>D :</span> {truncateText(item.ast_mst_asset_shortdesc, 25)}</span>
               </div>
           </div>
       </div>
       
        ))}
      
      </div>
    );
  });
const AssetPrintQrReport = React.memo(({data}) => {
    const componentRef = useRef();
     
  return (
    <>
    <div>
    <div>
      <ReactToPrint
        trigger={() => <button style={{
        background: "#252c46",
        color: "#fff",
        cursor: "pointer",
        border: "none",
        fontSize: "16px"
        }}>Print</button>}
        content={() => componentRef.current}
        pageStyle="@page { size: A4; }"
        bodyClass="print-body"
        bodyStyle={{ width: '500px', height: '500px' }}
      />
      <div style={{ display: 'none' }}>
      {/* <DataToPrint ref={componentRef} data={data} /> */}
      <DataToPrint
            ref={componentRef}
            data={data}
            
          />
      </div>
    </div>
    </div>
    </>
  )
});

export default AssetPrintQrReport
