import React, { useState, useEffect } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { createDataStore } from "../data_store/data_store.ts";
// import { mainSideNav }  from './mainsidenav.tsx';

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageHeader,
    EuiTitle,
    EuiText,
    EuiSideNav,
    EuiIcon,
    EuiPageSideBar,
    EuiSpacer,
    EuiSwitch,
    EuiFlexItem,
    EuiPanel,
    EuiFlexGroup,
    EuiSelect,
    EuiBasicTable,
    EuiButtonIcon,
    EuiButton,
    EuiDescriptionList,
    EuiHeaderLogo,
    EuiTextArea,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle

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

class myModal {
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
  showModal() {
    this.setIsModalVisible(true);
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

class createSwitch {
  constructor(checked, setChecked) {
    this.checked = checked;
    this.setChecked = setChecked;
  }
  onChange = (e) => {
    this.setChecked(e.target.checked);
  };
}

const ContentBody = ({match}) => {
  const {
    params: {agentService_id,agent_id}
  } = match;
  
  return(
    <>
      <h1> {agentService_id} </h1>
      <h2> {agent_id} </h2>
    </>
  );
};

export const AgentControllerApp = ({
  basename,
  notifications,
  http,
  navigation,
}: AgentControllerAppDeps) => {

  //add and edit button
  const [valueRuleAdd, setValueRuleAdd] = useState("");
  const [valueRuleEdit, setValueRuleEdit] = useState("");

  const [isModalVisibleAdd, setIsModalVisibleAdd] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);

  let createModalAdd = new myModal(
    isModalVisibleAdd,
    setIsModalVisibleAdd,
    valueRuleAdd,
    setValueRuleAdd,
    "Add"
  );
  let createModalEdit = new myModal(
    isModalVisibleEdit,
    setIsModalVisibleEdit,
    valueRuleEdit,
    setValueRuleEdit,
    "Edit"
  );
  let modalAdd = createModalAdd.checkModalvisible();
  let modalEdit = createModalEdit.checkModalvisible();

  //EuiBasicTable
  const store = createDataStore();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("ruleName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const onTableChange = ({ page = {}, sort = {} }) => {
    const { index: pageIndex, size: pageSize } = page;

    const { field: sortField, direction: sortDirection } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  const onSelectionChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  const onClickDelete = () => {
    store.deleteRules(...selectedItems.map((rule) => rule.id));
    setSelectedItems([]);
  };

  const renderDeleteButton = () => {
    if (selectedItems.length === 0) {
      return;
    }
    return (
      <EuiButton color="danger" iconType="trash" onClick={onClickDelete}>
        Delete {selectedItems.length} Rules
      </EuiButton>
    );
  };

  const toggleDetails = (item) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[item.id]) {
      delete itemIdToExpandedRowMapValues[item.id];
    } else {
      const listItems = [
        {
          description: `${item.ruleSet}`
        }
      ];
      itemIdToExpandedRowMapValues[item.id] = (
        <EuiDescriptionList listItems={listItems} />
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const { pageOfItems, totalItemCount } = store.findRules(
    pageIndex,
    pageSize,
    sortField,
    sortDirection
  );

  const deleteButton = renderDeleteButton();

  const columns = [
    {
      field: "ruleName",
      name: "Rule",
      sortable: true,
      truncateText: true,
      mobileOptions: {
        render: (item) => <span>{item.ruleName}</span>,
        header: false,
        truncateText: false,
        enlarge: true,
        fullWidth: true
      }
    },

    {
      name: "Actions",
      actions: [
        {
          name: "Edit",
          description: "Edit Rule",
          type: "icon",
          icon: "pencil",
          onClick: () => {
            createModalEdit.showModal();
          }
        }
      ]
    },
    {
      width: "40px",
      isExpander: true,
      render: (item) => (
        <EuiButtonIcon
          onClick={() => toggleDetails(item)}
          aria-label={itemIdToExpandedRowMap[item.id] ? "Collapse" : "Expand"}
          iconType={itemIdToExpandedRowMap[item.id] ? "arrowUp" : "arrowDown"}
        />
      )
    }
  ];

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [3, 5, 8]
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection
    }
  };

  const selection = {
    selectable: (rule) => rule.status,
    // selectableMessage: (selectable) =>
    //   !selectable ? "Rule is currently offline" : undefined,
    onSelectionChange: onSelectionChange
  };

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
  const [InterfaceIsConstructing, SetInterfaceIsConstructing] = useState<boolean | undefined>(true);

  const [position, setPosition] = useState("fixed");
 
  const [agentName, setName] = useState<string | undefined>();
  // Use the core http service to make a response to the server API.
  const getName = () => {
    http.get('/api/agent_controller/default').then((res) => {
      // console.log(res);
      var name = res["name"];
      var nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
      setName(nameCapitalized);
    });
    return agentName;
  }
  
  const [agentActive, setActive] = useState<boolean | undefined>();
  const getActive = () => {
    http.get('/api/agent_controller/default').then((res) => {
      setActive(res["active"]);
    });
    return agentActive;
  }

  const [agentIP, setIP] = useState<string | undefined>();
  const getIP = () => {
    http.get('/api/agent_controller/default').then((res) => {     
      setIP(res["ip"]);
    });
    return agentIP;
  }

  const [agentCenter, setCenter] = useState<boolean | undefined>();
  const getCenter = () => {
    http.get('/api/agent_controller/default').then((res) => {
      setCenter(res["services"]["suricata"]["rules"][0]["active"]);
    });
    return agentCenter;
  }
  const sections = [
    {
      items: [<EuiHeaderLogo>Agent Controller</EuiHeaderLogo>],
      borders: "right"
    }
  ];
  //swtich Active
  // const [checkedActive, setCheckedActive] = useState(false);
  let createSwitchActive = new createSwitch(getActive(), setActive);

  //switch Rule
  // const [checkedRule, setCheckedRule] = useState(false);
  let createSwitchRule = new createSwitch(getCenter(), setCenter);


  const onChangeFilter = (e) => {
    console.log(e.target.value)
   // let newArr = [...agentInterface]; // copying the old datas array
      // newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
  };


  const [agentInterface, setInterface] = useState([]);
  useEffect(() => {
    http.get('/api/agent_controller/default').then((res) => {
      let newArr = [];
      for (let i = 0; i < res["interfaces"].length; i++) {
        newArr.push({ value: res["interfaces"][i], text: res["interfaces"][i] }); 
      }
      setInterface(newArr);
    });
  }, [])

  const mainSideNav = () => {
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
    const [selectedItemName, setSelectedItem] = useState("nav1");
    const [sideNavData, setsideNavData] = useState([]);
    const history = useHistory();
    const toggleOpenOnMobile = () => {
      setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    // function used to select a nav item
    const selectItem = (name) => {
      setSelectedItem(name);
      history.push("/"+name);
    };
  
    // function used to create a nav item
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
    
    
    useEffect(() => {
      http.get('/api/agent_controller/sidenav_content').then((res) => {
        let newArr = [];
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          newArr.push(res[i]); 
        }
        setsideNavData(newArr); 
      });
    }, [])
    
    const sideNav = [
      createItem('Navigation', {
        icon: <EuiIcon type="menu" />,
        items: [],}, "nav1"),
    ]
    
    for (let x in sideNavData){
      let agent_name = sideNavData[x]["_source"]["name"];
      let agent_id = sideNavData[x]["_id"];
      sideNav[0].items.push(
        createItem(
          agent_name, {
          items: [
            createItem('TShark', {}, agent_id + "/tshark"),
            createItem('Suricata', {}, agent_id +"/suricata"),
          ],
      }, agent_id));
    }
      
    return(
      <>
        <EuiSideNav
          mobileTitle="Navigate within $APP_NAME"
          toggleOpenOnMobile={toggleOpenOnMobile}
          isOpenOnMobile={isSideNavOpenOnMobile}
          items={sideNav}
          style={{ width: 192 }}
        />
      </>
    );
  };

  const [agentValue, setAgentValue] = useState<string | undefined>();
  const interfaceValue  = () => {
    http.get('/api/agent_controller/default').then((res) => {
      setAgentValue(res["interfaces"][1]);  
    });
    return agentValue;
  };
  // if(InterfaceIsConstructing){
  //   // retrieveData();
  //   // getName();
  //   // getCenter();
  //   // getActive();
  //   // getIP();
  //   SetInterfaceIsConstructing(false)
  // }

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.

  

    return (
      <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage>
            <EuiPageSideBar sticky><Route path="/" component={mainSideNav} /></EuiPageSideBar>
            <EuiPageBody>
              <EuiPageHeader>
                  <EuiTitle size="l">
                    <h1>
                      <FormattedMessage
                          id="agentController.getName"
                          defaultMessage="{name}"
                          values={{ name: getName() ? getName() : 'Unknown' }}
                      />
                    </h1>
                  </EuiTitle>
                </EuiPageHeader>
              {/* <EuiPanel paddingSize="none" color="transparent"> */}
              <EuiFlexGroup gutterSize="none" >
                <EuiFlexItem>
                  <EuiPanel >
                    <EuiFlexGroup gutterSize="none" >
                      <EuiFlexItem>
                        <EuiSwitch
                          label="Active"
                          checked={createSwitchActive.checked}
                          onChange={(e) => createSwitchActive.onChange(e)}
                        />
                      </EuiFlexItem>
                      <EuiFlexItem>  
                        <EuiText
                         
                          id="agentController.getIP"
                          defaultMessage="{ip}"
                          values={ {ip: getIP() ? getIP() : 'Unknown'}}
                        />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>
                  </EuiFlexItem>
                  <EuiFlexItem>
                  <EuiPanel >
                  <EuiText>Staertus</EuiText>
                    <EuiFlexGroup gutterSize="none" >
                      <EuiFlexItem>
                        <EuiText>CPU:</EuiText>
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiText>Memory:</EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>
                    <EuiFlexGroup gutterSize="none">
                    <EuiFlexItem>
                      <EuiPanel>
                      <EuiFlexGroup gutterSize="none">
                          <EuiFlexItem>
                            <EuiText>Interface</EuiText>
                          </EuiFlexItem>
                          <EuiFlexItem>
                            <EuiSelect
                              id="selectDocExample"
                              options={agentInterface}
                              value={interfaceValue()}
                              onChange={(e) => onChangeFilter(e)}
                              aria-label="Use aria labels when no actual label is in use"
                            />
                          </EuiFlexItem>
                          </EuiFlexGroup>
                        </EuiPanel>
                      </EuiFlexItem>
                    </EuiFlexGroup>
              {/* </EuiPanel> */}
              <EuiSpacer/>
                <EuiFlexGroup gutterSize="none">
                  <EuiFlexItem>
                    <EuiTitle>
                      <h2>Rules</h2>
                    </EuiTitle>
                    <EuiSpacer/>
                    <EuiPanel>
                    <EuiFlexGroup gutterSize="none">
                      <EuiFlexItem>
                        <EuiFlexGroup gutterSize="xs">
                          <EuiFlexItem>{deleteButton}</EuiFlexItem>
                          <EuiFlexItem>
                            <EuiButton
                              color={"primary"}
                              onClick={() => {
                                createModalAdd.showModal();
                              }}
                              iconType="plusInCircle"
                              aria-label="Next"
                            >
                              Add Rules
                            </EuiButton>
                          </EuiFlexItem>
                        </EuiFlexGroup>

                        <EuiBasicTable
                          items={pageOfItems}
                          itemId="id"
                          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
                          isExpandable={true}
                          hasActions={true}
                          columns={columns}
                          pagination={pagination}
                          sorting={sorting}
                          isSelectable={true}
                          selection={selection}
                          onChange={onTableChange}
                        />
                        {modalAdd}
                        {modalEdit}
                      </EuiFlexItem>
                    </EuiFlexGroup>
                    </EuiPanel>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiTitle>
                      <h2>Control Center</h2>
                    </EuiTitle>
                    <EuiSpacer/>
                    <EuiPanel paddingSize="l">
                      <EuiFlexGroup gutterSize="none">
                        <EuiFlexItem>
                          <EuiSwitch
                            label="Rule DoS"
                            checked={createSwitchRule.checked}
                            onChange={(e) => createSwitchRule.onChange(e)}
                          />
                        </EuiFlexItem>
                      </EuiFlexGroup>
                    </EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
    );
};

