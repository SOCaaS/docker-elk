import React from 'react';

import {
  EuiSwitch,
  EuiSpacer,
} from '@elastic/eui';

//function for agent activation switch
export const setActive_on_change = (e, current_url, setActive) => {
  fetch(current_url+"/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf" : "reporting"
    },
    body: JSON.stringify({
      status: e.target.checked
    }) 
  })
    .then(response => response.json())
    .then(response => {
      setActive(response.response["status"])
    }) 
    .catch(err => console.log("api Error: ", err));
}
//function for service activation switch
export const setServiceStatus_onchange = (e, current_url, setservicestatus, currentService) => {
  fetch(current_url+"/activeService", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf" : "reporting"
    },
    body: JSON.stringify({
      status : e.target.checked,
      service : currentService
    }) 
  })
    .then(response => response.json())
    .then(response => {
      setservicestatus(response.response["status"])//set service status after POST
    }) 
    .catch(err => console.log("api Error: ", err));
}
//function for Rule activation Switch
const setRuleStatus_on_change = (e, x, current_url, currentService, setAgentStatus, agentStatus) => {
  fetch(current_url+"/activeRule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf" : "reporting"
    },
    body: JSON.stringify({
      status: e.target.checked,
      id : x+1,
      service : currentService
    }) 
  })
    .then(response => response.json())
    .then(response => {
      setAgentStatus({ ...agentStatus, [x]: response.response["status"] }) //set Agent Status after POST
    }) 
    .catch(err => console.log("api Error: ", err));
}

//create switch for each rules 
export const controlCenter = (ruleID, ruleName, current_url, currentService, setAgentStatus, agentStatus) => {
    let centerArr = [];
    let size  = 0;
    //ensures that only 3 switches maximum are created
    if(ruleID.length >= 3){
      size = 3;
    }
    else{
      size = ruleID.length;
    }
    //loop that generates the switch based on size
    for (let x = 0; x < size; x++){
      let modal = ( 
          <EuiSwitch
          label={ruleID[x]+": "+ruleName[x]}
          checked={agentStatus[x]}
          onChange={(e) => setRuleStatus_on_change(e, x, current_url, currentService, setAgentStatus, agentStatus)}
          />
      );
      centerArr.push(modal);
      centerArr.push(<EuiSpacer/>);
    }
  return centerArr;
  }