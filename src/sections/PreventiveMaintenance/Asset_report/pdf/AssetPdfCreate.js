import React, { useState, useEffect } from 'react';
import {  Document, Page, Text, Image, View, StyleSheet, PDFViewer, } from '@react-pdf/renderer';
//import logo from '../../assets/images/logo.png';
import logo from '../../../../assets/img/logo.png';

const AssetPdfCreate = React.memo(({pdfDetails}) => {
   // console.log("pdfDetails__",pdfDetails);
    const date = new Date().toLocaleString();
     const  str = date.slice(0, -3);
     const [viewerWidth, setViewerWidth] = useState(window.innerWidth / 1.3);
     useEffect(() => {
        const handleResize = () => {
          setViewerWidth(window.innerWidth / 1.3); // Update width on resize
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      const styles = StyleSheet.create({
        body: {
          width: '100%',
          height: '100%',
          paddingTop: 20,
          fontFamily: 'Helvetica',
          paddingBottom: 50,
          paddingHorizontal: 10,
        },
        table: { 
          display: "table", 
          width: "100%", 
          borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderWidth: 1, 
          borderRightWidth: 0, 
          borderBottomWidth: 0,
        }, 
        tableRow: { 
          margin: "auto", 
          flexDirection: "row" 
        }, 
        tableColHeader: { 
          width: "10%", 
         // borderStyle: "solid", 
          backgroundColor:"#1190cb",
          color:"#fff",
          borderColor: '#bfbfbf',
          borderBottomColor: '#fff',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0,
          
        },   
        tableColHeader2: { 
          width: "13%", 
          backgroundColor:"#1190cb",
          color:"#fff",
         // borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderBottomColor: '#fff',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0
        },  
        tableColHeader3: { 
          width: "6%", 
          backgroundColor:"#1190cb",
          color:"#fff",
         // borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderBottomColor: '#fff',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0
        },  
        tableColHeader4: { 
          width: "12%", 
          backgroundColor:"#1190cb",
          color:"#fff",
          //borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderBottomColor: '#fff',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0
        }, 
        tableCol: {
          width: "10%", 
          //borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0,
          marginBottom:"1px",
          //padding:"2px",
          borderBottomWidth:1,
        }, 
        tableCol2: {
          width: "6%", 
         // borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0,
          marginBottom:"1px",
          //padding:"2px",
        }, 
        tableCol3: {
          width: "13%", 
         // borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0,
          marginBottom:"1px",
          //padding:"2px", 
        }, 
        tableCol4: {
          width: "12%", 
          //borderStyle: "solid", 
          borderColor: '#bfbfbf',
          borderWidth: 1, 
          borderLeftWidth: 0, 
          borderTopWidth: 0,
          marginBottom:"1px",
        }, 
        tableCellHeader: {
          margin: 3, 
          //padding:2,
         //margin: 'auto', 
         textAlign:"center",
          fontSize: 10,
          textBaseline: "baseline"
        },  
        tableCell: { 
         // display:"inline-block",
          //wordBreak: "break-word",
          margin: "auto",
         // padding:"2.5px", 
          //margin: "3.5px", 
          fontSize: 8,
          marginTop: "3px",
          marginBottom:"4px",
          //padding: 3,
        
        }, 
        viewer: {
         // width: window.innerWidth / 1.3,
         // height: window.innerHeight / 1,
         width: '100%', 
         height: '100vh',
        },
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          paddingLeft: 20,
          paddingTop: 10,
          paddingRight: 20,
        },
        headerText: {
          flex: 1,
          textAlign: 'left',
          fontSize: 16,
        },
        headerText2: {
          flex: 1,
          textAlign: 'center',
          fontSize: 16,
        },
        headerText3: {
          fontSize: 12,
          flex: 1,
          textAlign: 'right',
          //fontSize: 16,
        },
        logo: {
          marginRight: 10,
          width:50,
          height:50,
        },
        pageNumbers: {
          position: 'absolute',
          bottom: 20,
          left: 0,
          fontSize:12,
          right: 0,
          textAlign: 'center'
        },
      });
  return (
    <>
    <div>
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
      <Page style={styles.body} wrap>
       
        <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} / ${totalPages}`
      )} fixed /> 
        <View style={styles.container}>
          <Text style={styles.headerText}><Image style={styles.logo} src={logo} /></Text>
          <Text style={styles.headerText2}>Asset List</Text>
          <Text style={styles.headerText3}>Date : {str}</Text>
        </View>
        <View style={styles.table}> 
          <View style={styles.tableRow} fixed> 
            <View style={styles.tableColHeader2}> 
              <Text style={styles.tableCellHeader}>Asset No</Text>
            </View> 
            <View style={styles.tableColHeader3}> 
              <Text style={styles.tableCellHeader}>Work Group</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Asset Code</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Asset Type</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Asset Group Code</Text> 
            </View> 
            <View style={styles.tableColHeader4}> 
              <Text style={styles.tableCellHeader}>Cost Center</Text> 
            </View> 
            <View style={styles.tableColHeader3}> 
              <Text style={styles.tableCellHeader}>Zone</Text> 
            </View> 
            <View style={styles.tableColHeader2}> 
              <Text style={styles.tableCellHeader}>Asset Location</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Leval</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Asset {<br />}Cost</Text> 
            </View> 
          </View> 
          {pdfDetails.map((item) => (
          <View style={styles.tableRow}> 
            <View style={styles.tableCol3}> 
               <Text style={styles.tableCell}>{item.ast_mst_asset_no}</Text> 
            </View> 
            <View style={styles.tableCol2}> 
              <Text style={styles.tableCell}>{item.ast_mst_wrk_grp}</Text> 
            </View> 
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.ast_mst_asset_code}</Text> 
            </View>
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{item.ast_mst_asset_type}</Text> 
            </View> 
             <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{item.ast_mst_asset_grpcode}</Text> 
            </View> 
            <View style={styles.tableCol4}> 
              <Text style={styles.tableCell}>{item.ast_mst_cost_center}</Text> 
            </View> 
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{item.ast_mst_work_area}</Text> 
            </View>
            <View style={styles.tableCol3}> 
              <Text style={styles.tableCell}>{item.ast_mst_asset_locn}</Text> 
            </View> 
             <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{item.ast_mst_ast_lvl}</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{item.ast_det_repl_cost}</Text> 
            </View> 
          </View>
           ))} 
        </View>
      </Page>
    </Document>
    </PDFViewer>
    </div>
    </>
  )
});

export default AssetPdfCreate
