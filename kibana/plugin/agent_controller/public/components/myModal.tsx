import React from 'react';

import {
    EuiText,
    EuiSpacer,
    EuiButton,
    EuiTextArea,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle

} from '@elastic/eui';

//saving modal function
const saveModal = (current_url, currentService, getID, ruleID, ruleName, setruleName, setRuleID, setRuleLength, setIsModalVisible, modalTitle, valueRule) => {
  let data;
  if(modalTitle == "Add"){//rule add modal
      data = {
          rule : valueRule,
          service : currentService//get service
      }
  }
  else if(modalTitle == "Edit"){// rule edit modal
    data = {
        rule : valueRule,
        service : currentService,//get service
        id : getID + 1//id to be edited (parameter to be passed)
    }
  }
  fetch(current_url+"/"+modalTitle.toLowerCase(), { //post to edit or add API based on the modalTitle
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf" : "reporting"
    },
    body: JSON.stringify(data) 
  })
    .then(response => response.json())
    .then(response => {
      //update rule into rule table array
        if(response.response["id"]){//if id exists in response indicate the update id
          let detailArr = [...ruleName];
          detailArr[response.response["id"] - 1] = response.response["rule"]
          setruleName(detailArr);
        }
        //add rule into rule table array
        else{//no id's in response indicate a response from add api
          let ruleArr = [...ruleID]; //copy 
          let detailArr = [...ruleName];
          detailArr.push(response.response["rule"]);
          let length = Math.abs(ruleArr.length - 1);
          if(ruleArr.length <= 0){
            ruleArr.push(1);
          }
          else{
            ruleArr.push(ruleID[length] + 1);
          }
          setRuleID(ruleArr);
          setruleName(detailArr);
          setRuleLength(ruleArr.length);
        }
    }) 
    .catch(err => console.log("api Error: ", err));

setIsModalVisible(false);

} 
// Class for Modal
export const myModal = (current_url, currentService, getID, ruleID, ruleName, setruleName, setRuleID, setRuleLength, isModalVisible, setIsModalVisible, modalTitle, setValueRule, valueRule) => {
  let modal;
  const closeModal = () => {
    setIsModalVisible(false);//modal to close 
  }
  const onChangeText = (e) => {
    setValueRule(e.target.value);
  };
  if (isModalVisible) {
    modal = ( // Modal HTML structure
      <EuiModal
        onClose={() => {
          closeModal();
        }}
      >
        <EuiModalHeader>
          <EuiModalHeaderTitle>{modalTitle} Rule Name</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiText>
            <EuiTextArea
              placeholder="Rule Command"
              aria-label="Rule Command"
              value={valueRule}
              onChange={(e) => onChangeText(e)}
            />
          </EuiText>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiButton
            onClick={() => {
              saveModal(current_url, currentService, getID, ruleID, ruleName, setruleName, setRuleID, setRuleLength, setIsModalVisible, modalTitle, valueRule);
            }}
          >
            Save
          </EuiButton>
          <EuiSpacer />
          <EuiButton
            onClick={() => {
              closeModal();
            }}
            fill
          >
            Close
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }
  return modal;
}