import axios from "axios";

export default axios.create({
   baseURL: "http://evantage.ddns.net/react_web/", 
  // baseURL: "https://evantage-cmms.com.my/cmms_ktmb/Api",  
 // baseURL: "https://evantage-cmms.com.my/react_web",
  // baseURL: "http://evantage.ddns.net/React_helpDesk_web/",
  // baseURL: "http://192.168.0.34:8080/react_web/",
  // baseURL: "http://142.93.213.221/api",
  //  baseURL: "http://localhost:8080/react_web/",

  //  UI url : http://evantage.ddns.net/cmms_helpdesk
  // UI "http://evantage.ddns.net/cmms_desktop",
   
  headers: {
    "Content-type": "application/json",
  },
});
