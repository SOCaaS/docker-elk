//activate Active switch
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
      // console.log("response", response);
      setActive(response.response["status"])
    }) 
    .catch(err => console.log("api Error: ", err));
}

//activate Active Rule Switch
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
      setAgentStatus({ ...agentStatus, [x]: response.response["status"] })
    }) 
    .catch(err => console.log("api Error: ", err));
}

//loop rule switch
export const controlCenter = (ruleID, ruleName, current_url, currentService, setAgentStatus, agentStatus) => {
    let centerArr = [];
    let size  = 0;
    if(ruleID.length >= 3){
      size = 3;
    }
    else{
      size = ruleID.length;
    }

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