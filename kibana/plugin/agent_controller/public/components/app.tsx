import React, { useState, useEffect } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom';
import { createDataStore } from "../data_store/data_store.ts";
import { setActive_on_change,  controlCenter } from "./createSwitch.tsx"
import { myModal } from "./myModal.tsx"
import {onChangeFilter_interface, onChangeFilter_frequency} from "./createfilter.tsx"
// import { mainSideNav }  from './mainsidenav.tsx';

import {
    EuiPage,
    EuiPageBody,
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
  const default_url  = "/api/agent_controller/default";
  const [current_url, setURL] = useState(default_url);
  const [ruleID, setRuleID] = useState([]);
  const [ruleName, setruleName] = useState([]);
  const [ruleLength, setRuleLength] = useState<number | undefined>();
  const [currentService, setService] = useState<string | undefined>();
  const [agentStatus, setAgentStatus] = useState([]);

  useEffect(() => {
    http.get(current_url).then((res) => {
      let ruleArr = [];
      let detailArr = [];
      let rules = [];
      let ruleStatus = [];
      if(currentService == "tshark" ||  currentService == "suricata"){  
        rules = res["services"][currentService]["rules"];
        for (let i = 0; i < rules.length; i++) {
          ruleArr[i] = i + 1;
          detailArr.push(rules[i]["details"]); 
          ruleStatus.push(rules[i]["active"]); 
        }
      }
      setRuleID(ruleArr);
      setruleName(detailArr);
      setRuleLength(rules.length);
      setAgentStatus(ruleStatus);
    });
  }, [currentService, current_url])
  
  //add and edit button
  const [getID, setID] = useState("");
  const [valueRule, setValueRule] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setmodalTitle] = useState("");

  const showModal = (rule, text, id) =>{
    setIsModalVisible(true);
    setValueRule(rule);
    setmodalTitle(text);
    setID(id);
  }
  //EuiBasicTable
  

  const store = createDataStore(ruleID, ruleName, ruleLength);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("ruleID");
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
          description: `${item.ruleName}`
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
      field: "ruleID",
      name: "ID",
      sortable: true,
      truncateText: true,
      mobileOptions: {
        render: (item) => <span>{item.ruleID}</span>,
        header: false,
        truncateText: false,
        enlarge: true,
        fullWidth: true
      }
    },
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
          onClick: (e) => {
            console.log(e.ruleName);
            showModal(e.ruleName, "Edit", e.id);
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

  const [position, setPosition] = useState("fixed");

  //get response from HTTP
  const [agentName, setName] = useState<string | undefined>();
  const [agentActive, setActive] = useState<boolean | undefined>();
  const [agentIP, setIP] = useState<string | undefined>();
  const [agentValue, setAgentValue] = useState<string | undefined>();
  const [agentFrequency, setFrequency] = useState<string | undefined>();
  const [agentCPU, setCPU] = useState<string | undefined>();
  const [agentMemory, setMemory] = useState<string | undefined>();

  //set and get from backend
  useEffect(() => {
    http.get(current_url).then((res) => {
      var name = res["name"];
      var nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
      setName(nameCapitalized);
      setActive(res["active"]);
      setIP(res["ip"]);
      setAgentValue(res["interface"]);  
      setFrequency(res["time"]);
      setCPU(res["cpu"]);
      setMemory(res["memory"]);
    });
  }, [current_url])

  const sections = [
    {
      items: [<EuiHeaderLogo>Agent Controller</EuiHeaderLogo>],
      borders: "right"
    }
  ];

  const onChangeFilter = (e) => {
    console.log(e.target.value)
  };


  //get interface values, store in array
  const [agentInterface, setInterface] = useState([]);
  useEffect(() => {
    http.get(current_url).then((res) => {
      let newArr = [];
      for (let i = 0; i < res["interfaces"].length; i++) {
        newArr.push({ value: res["interfaces"][i], text: res["interfaces"][i] }); 
      }
      setInterface(newArr);
    });
  }, [current_url])

  //get check frequency values, store in array
  const [agentFrequencies, setFrequencies] = useState([]);
  useEffect(() => {
    http.get(current_url).then((res) => {
      let newArr = [];
      for (let i = 0; i < res["times"].length; i++) {
        newArr.push({ value: res["times"][i], text: res["times"][i] }); 
      }
      setFrequencies(newArr);
    });
  }, [current_url])
  
  //get sidenavdata values, store in array
  const [sideNavData, setsideNavData] = useState([]);
  useEffect(() => {
    http.get('/api/agent_controller/sidenav_content').then((res) => {
      let newArr = [];
      for (let i = 0; i < res.length; i++) {
        newArr.push(res[i]); 
      }
      setsideNavData(newArr); 
    });
  }, [])
  
  
  const mainSideNav = () => {
    
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
    const [selectedItemName, setSelectedItem] = useState("default");
    const history = useHistory();
    setService(history.location.pathname.replace(/.*\//, ""));

    const path= () => {
      let delete_first_slash = history.location.pathname.replace(/\//, "");
      let resPath = delete_first_slash.replace(/(\/\/[^\/]+)?\/.*/, '$1');
      if (resPath == "") {
        return "default";
      } else {
        return resPath;
      }
    };

    setURL("/api/agent_controller/"+path());
  
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
        forceOpen: true,
        isSelected: selectedItemName === id,
        onClick: () => selectItem(id)
      };
    };
       
    const sideNav = [
      createItem('Navigation', {
        icon: <EuiIcon type="menu" />,
        items: [],}, "default"),
    ]
    
    for (let x in sideNavData){
      let agent_name = sideNavData[x]["fields"]["name"];
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
          mobileTitle={"Navigate On "+PLUGIN_NAME}
          toggleOpenOnMobile={toggleOpenOnMobile}
          isOpenOnMobile={isSideNavOpenOnMobile}
          items={sideNav}
          style={{ width: 192 }}
        />
      </>
    );
  };
 

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename} >
     <I18nProvider>
       <>
         <EuiPage>
           <EuiPageSideBar sticky><Route path="/" component={mainSideNav} /></EuiPageSideBar>
           <EuiPageBody>
             <EuiPageHeader>
                 <EuiTitle size="l">
                   <h1>
                     <FormattedMessage
                       id="agentController.title"
                       defaultMessage="{name}"
                       values={{ name: agentName ? agentName : 'Unknown' }}
                       />
                   </h1>
                 </EuiTitle>
                 <Switch>  
                   <Route path="/default"/>
                    <Route path="/" >
                      <EuiButton color="danger" iconType="trash" >
                        Delete
                      </EuiButton>
                    </Route>     
                  </Switch>
               </EuiPageHeader>
             {/* <EuiPanel paddingSize="none" color="transparent"> */}
             <EuiFlexGroup gutterSize="none" >
               <EuiFlexItem>
                 <EuiPanel >
                   <EuiFlexGroup gutterSize="none" >
                     <EuiFlexItem>
                       <EuiSwitch
                         label="Active"
                         checked={agentActive}
                         onChange={(e) => setActive_on_change(e, current_url, setActive)}
                       />
                     </EuiFlexItem>
                     <EuiFlexItem> 
                     <EuiText> IP: {agentIP}</EuiText>
                     </EuiFlexItem>
                   </EuiFlexGroup>
                 </EuiPanel>
                 </EuiFlexItem>
                 <EuiFlexItem>
                 <EuiPanel >
                 <EuiText>Status</EuiText>
                   <EuiFlexGroup gutterSize="none" >
                     <EuiFlexItem>
                       <EuiText>CPU: {agentCPU}</EuiText>
                     </EuiFlexItem>
                     <EuiFlexItem>
                       <EuiText>Memory: {agentMemory}</EuiText>
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
                                value={agentValue}
                                onChange={(e) => onChangeFilter_interface(e, current_url, setAgentValue)}
                                aria-label="Use aria labels when no actual label is in use"
                              />
                         </EuiFlexItem>
                         </EuiFlexGroup>
                       </EuiPanel>
                     </EuiFlexItem>
                     <EuiFlexItem>
                     <EuiPanel>
                     <EuiFlexGroup gutterSize="none">
                         <EuiFlexItem>
                           <EuiText>Check Frequency</EuiText>
                         </EuiFlexItem>
                         <EuiFlexItem>
                          <EuiSelect
                                id="selectDocExample"
                                options={agentFrequencies}
                                value={agentFrequency}
                                onChange={(e) => onChangeFilter_frequency(e,current_url,setFrequency)}
                                aria-label="Use aria labels when no actual label is in use"
                              />
                         </EuiFlexItem>
                         </EuiFlexGroup>
                       </EuiPanel>
                     </EuiFlexItem>
                   </EuiFlexGroup>
             {/* </EuiPanel> */}
             <EuiSpacer/>
             <Route path={["/*/tshark", "/*/suricata"]}>
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
                              showModal("", "Add");
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
                      {myModal(current_url, currentService, getID, ruleID, ruleName, setruleName, setRuleID, setRuleLength, isModalVisible, setIsModalVisible, modalTitle, setValueRule, valueRule)}
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
                         {controlCenter(ruleID, ruleName, current_url, currentService, setAgentStatus, agentStatus)}
                       </EuiFlexItem>
                     </EuiFlexGroup>
                   </EuiPanel>
                 </EuiFlexItem>
               </EuiFlexGroup>
               </Route>
           </EuiPageBody>
         </EuiPage>
       </>
     </I18nProvider>
   </Router>
  );
};
