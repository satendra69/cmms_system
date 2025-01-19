import React, { useState } from 'react'
import OpenVSClose from './OpenVSClose'

import PreventiveAndComperitive from './PreventiveAndComperitive'
import OpenVsCloseRoot from '../../tables/OpenVsClose/OpenVsCloseRoot'

function ReportCard({seriesData,seriesDataLoc,setLoading}) {
  const [showTableOpen,setShowTable] = useState(false)
  const [showTablePmCm,setShowTablePmCm] = useState(false)
  return (
    <div className='reportCard'>
        {/* div 1 */}
        <div className='div1 w50per' >

          {!showTableOpen?
          
          <div><OpenVSClose seriesData={seriesData} seriesDataLoc={seriesDataLoc} setShowTable={setShowTable} setLoading={setLoading}/></div>:<div><OpenVsCloseRoot seriesData={seriesData} seriesDataLoc={seriesDataLoc} setShowTable={setShowTable} /></div>}
        
 

        </div>

        {/* div2 */}
        <div className='div2 w50per'>
        <PreventiveAndComperitive seriesData={seriesData} seriesDataLoc={seriesDataLoc} />
        </div>
        
    </div>
  )
}

export default ReportCard