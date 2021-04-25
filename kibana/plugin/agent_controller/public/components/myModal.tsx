import React, { useState, useEffect } from 'react';

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

export class myModal {
    constructor(
      isModalVisible,
      setIsModalVisible,
      valueRule,
      setValueRule,
      text
    ) {
      this.isModalVisible = isModalVisible;
      this.setIsModalVisible = setIsModalVisible;
      this.valueRule = valueRule;
      this.setValueRule = setValueRule;
      let modal;
      this.modal = modal;
      this.text = text;
    }
    onChangeText = (e) => {
      this.setValueRule(e.target.valueRule);
    };
    closeModal() {
      this.setIsModalVisible(false);
    }
    saveModal() {
      this.setIsModalVisible(false);
    }
    showModal(rule) {
      this.setIsModalVisible(true);
      this.setValueRule(rule);
    }
    checkModalvisible() {
      if (this.isModalVisible) {
        this.modal = (
          <EuiModal
            onClose={() => {
              this.closeModal();
            }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle>{this.text} Rule Name</EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
              <EuiText>
                <EuiTextArea
                  placeholder="Rule Command"
                  aria-label="Rule Command"
                  value={this.valueRule}
                  onChange={(e) => this.onChangeText(e)}
                />
              </EuiText>
            </EuiModalBody>
            <EuiModalFooter>
              <EuiButton
                onClick={() => {
                  this.saveModal();
                }}
              >
                Save
              </EuiButton>
              <EuiSpacer />
              <EuiButton
                onClick={() => {
                  this.closeModal();
                }}
                fill
              >
                Close
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        );
      }
      return this.modal;
    }
  }