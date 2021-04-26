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


const saveModal = (current_url, currentService, getID, ruleID, ruleName, setruleName, setRuleID, setRuleLength, setIsModalVisible, modalTitle, valueRule) => {
  let data;
  if(modalTitle == "Add"){
      data = {
          rule : valueRule,
          service : currentService
      }
  }
  else if(modalTitle == "Edit"){
    data = {
        rule : valueRule,
        service : currentService,
        id : getID + 1
    }
  }
  fetch(current_url+"/"+modalTitle.toLowerCase(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf" : "reporting"
    },
    body: JSON.stringify(data) 
  })
    .then(response => response.json())
    .then(response => {
        if(response.response["id"]){
          let detailArr = [...ruleName];
          detailArr[response.response["id"] - 1] = response.response["rule"]
          setruleName(detailArr);
        }
        else{
          let ruleArr = [...ruleID];
          let detailArr = [...ruleName];
          detailArr.push(response.response["rule"]);
          ruleArr.push(ruleID[ruleID.length - 1] + 1);
          setRuleID(ruleArr);
          setruleName(detailArr);
          setRuleLength(ruleArr.length);
        }
    }) 
    .catch(err => console.log("api Error: ", err));

setIsModalVisible(false);

} 

export const myModal = (current_url, currentService, getID, ruleID, ruleName, setruleName, setRuleID, setRuleLength, isModalVisible, setIsModalVisible, modalTitle, setValueRule, valueRule) => {
  let modal;
  const closeModal = () => {
    setIsModalVisible(false);
  }
  const onChangeText = (e) => {
    setValueRule(e.target.value);
  };
  if (isModalVisible) {
    modal = (
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