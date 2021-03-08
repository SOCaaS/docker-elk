import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiSideNav,
  EuiIcon,
  EuiPageTemplate,
  EuiPageSideBar,
  EuiSpacer,
  EuiHeader,
  EuiHeaderLogo,
  EuiSwitch,
  EuiFlexGrid,
  EuiFlexItem,
  EuiPanel,
  EuiCode,
  EuiFlexGroup,
  EuiTextAlign,
  EuiSelect
  
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface AgentControllerAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const AgentControllerApp = ({
  basename,
  notifications,
  http,
  navigation,
}: AgentControllerAppDeps) => {
  // Use React hooks to manage state.
  const [timestamp, setTimestamp] = useState<string | undefined>();

  const onClickHandler = () => {
    // Use the core http service to make a response to the server API.
    http.get('/api/agent_controller/example').then((res) => {
      setTimestamp(res.time);
      // Use the core notifications service to display a success message.
      notifications.toasts.addSuccess(
        i18n.translate('agentController.dataUpdated', {
          defaultMessage: 'Data updated',
        })
      );
    });
  };

  const [position, setPosition] = useState("fixed");

  const sections = [
    {
      items: [<EuiHeaderLogo>Agent Controller</EuiHeaderLogo>],
      borders: "right"
    }
  ];
  //switch
  const [checked, setChecked] = useState(false);

  const onChange = (e) => {
    setChecked(e.target.checked);
  };
  const options = [
    { value: "option_one", text: "Option one" },
    { value: "option_two", text: "Option two" },
    { value: "option_three", text: "Option three" }
  ];

  const [value, setValue] = useState(options[1].value);

  const onChangeFilter = (e) => {
    setValue(e.target.value);
  };

  const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
  const [selectedItemName, setSelectedItem] = useState(null);
  console.log(setSelectedItem);
  const toggleOpenOnMobile = () => {
    setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
  };

  const selectItem = (name) => {
    setSelectedItem(name);
  };

  const createItem = (name, data = {}, id) => {
    // NOTE: Duplicate `name` values will cause `id` collisions.
    return {
      ...data,
      id: id,
      name,
      isSelected: selectedItemName === id,
      onClick: () => selectItem(id)
    };
  };

  const sideNav = [
    createItem('Navigation', {
      icon: <EuiIcon type="menu" />,
      items: [
          createItem('Default', {
            items: [createItem('TShark', {}, "tshark"), createItem('Suricata', {},  "suricata")],
          },"default"),
        ],
    }, "nav1"),
  ];

  // Generate the agent service to side navigation
  for (let i = 1; i < 20; i++) {
    sideNav[0].items.push(
      createItem(
        'Agent Service '+i.toString(), {
        items: [
          createItem('TShark', {}, "Tshark "+i.toString()), 
          createItem('Suricata', {},"Suricata "+i.toString()),
        ],
    }, "agentService"+ i.toString()));
  }


  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage>
            <EuiPageBody>
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="agentController.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiSideNav
                  aria-label="Force-open example"
                  mobileTitle="Default"
                  toggleOpenOnMobile={toggleOpenOnMobile}
                  isOpenOnMobile={isSideNavOpenOnMobile}
                  items={sideNav}
                  style={{ width: 192 }}
                />
              </EuiPageContent>
              <EuiPageContent>
                <EuiSpacer size="xl" />
                <EuiPageHeader iconType="logoElastic" pageTitle="Suricata" />
                <EuiFlexGroup gutterSize="l">
                  <EuiPanel paddingSize="l">
                    <EuiFlexGroup gutterSize="l">
                      <EuiFlexItem>
                        <EuiSwitch
                          label="Active"
                          checked={checked}
                          onChange={(e) => onChange(e)}
                        />
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiText>IP: 192.168.12.0</EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>
                  <EuiPanel paddingSize="l">
                    <EuiFlexGroup gutterSize="l">
                      <EuiText>Status</EuiText>
                      <EuiFlexItem></EuiFlexItem>
                      <EuiFlexItem>
                        <EuiText>CPU:</EuiText>
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiText>Memory:</EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>
                </EuiFlexGroup>
                <EuiFlexGroup>
                  <EuiPageContent>
                    <EuiPageContentBody>
                      <EuiFlexGroup gutterSize="l">
                        <EuiFlexItem>
                          <EuiText>Interface</EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem>
                          <EuiSelect
                            id="selectDocExample"
                            options={options}
                            value={value}
                            onChange={(e) => onChangeFilter(e)}
                            aria-label="Use aria labels when no actual label is in use"
                          />{" "}
                        </EuiFlexItem>
                      </EuiFlexGroup>
                    </EuiPageContentBody>
                  </EuiPageContent>
                </EuiFlexGroup>
              </EuiPageContent>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="agentController.congratulationsTitle"
                        defaultMessage="Congratulations, you have successfully created a new Kibana Plugin!"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiText>
                    <p>
                      <FormattedMessage
                        id="agentController.content"
                        defaultMessage="Look through the generated code and check out the plugin development documentation."
                      />
                    </p>
                    <EuiHorizontalRule />
                    <p>
                      <FormattedMessage
                        id="agentController.timestampText"
                        defaultMessage="Last timestamp: {time}"
                        values={{ time: timestamp ? timestamp : 'Unknown' }}
                      />
                    </p>
                    <EuiButton type="primary" size="s" onClick={onClickHandler}>
                      <FormattedMessage id="agentController.buttonText" defaultMessage="Get data" />
                    </EuiButton>
                  </EuiText>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
