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
        console.log("response", response);
        setAgentValue(response.response["interface"])
      }) 
      .catch(err => console.log("api Error: ", err));
  }
  
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
        console.log("response", response);
        setFrequency(response.response["time"])
      }) 
      .catch(err => console.log("api Error: ", err));
  }