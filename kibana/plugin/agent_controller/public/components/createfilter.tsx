//create the filter drop down for agent interface
export const onChangeFilter_interface = (e, current_url, setAgentValue) => { // catch selected item of Interface Filter
    fetch(current_url+"/interface", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "kbn-xsrf" : "reporting"
      },
      body: JSON.stringify({
        interface: e.target.value
      }) 
    })
      .then(response => response.json())
      .then(response => {
        setAgentValue(response.response["interface"]) //set new inteface value after POST
      }) 
      .catch(err => console.log("api Error: ", err));
}

//create the filter drop down for agent's frequency
export const onChangeFilter_frequency = (e, current_url, setFrequency) => {// catch selected item of Frequency filter
  fetch(current_url+"/time", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf" : "reporting"
    },
    body: JSON.stringify({
      time: e.target.value
    }) 
  })
    .then(response => response.json())
    .then(response => {
      setFrequency(response.response["time"])//set the new frequency after POST
    }) 
    .catch(err => console.log("api Error: ", err));
}