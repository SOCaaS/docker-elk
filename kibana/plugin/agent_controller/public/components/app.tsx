//React Library
import React, { useState, useEffect } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom';

// customfile
import { createDataStore } from "../data_store/data_store.ts"; // data Parser to the backend
import { setActive_on_change, setServiceStatus_onchange, controlCenter } from "./createSwitch.tsx"
import { myModal } from "./myModal.tsx"
import { onChangeFilter_interface, onChangeFilter_frequency } from "./createfilter.tsx"

//EUi Library
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

//Plugin Dependencies file 
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
  const default_url  = "/api/agent_controller/default"; //Plugin Default URL/Hoome page
  const [current_url, setURL] = useState(default_url); // Url variable
  const [ruleID, setRuleID] = useState([]); //Rule id
  const [ruleName, setruleName] = useState([]); //Rule name Variable
  const [ruleLength, setRuleLength] = useState<number | undefined>(); //rule's length variable
  const [currentService, setService] = useState<string | undefined>();//variable to set service
  const [agentStatus, setAgentStatus] = useState([]);//variable to store agent status
  const [servicestatus, setservicestatus] = useState<boolean | undefined> ();// variable to store service status

  useEffect(() => {
    http.get(current_url).then((res) => { //get status detail and rules of particular service
      let ruleArr = [];
      let detailArr = [];
      let rules = [];
      let ruleStatus = [];
      if(currentService == "tshark" ||  currentService == "suricata"){  //check if the service is either tshark or suricata
        rules = res["services"][currentService]["rules"];
        setservicestatus(res["services"][currentService]["active"])
        for (let i = 0; i < rules.length; i++) {
          ruleArr[i] = i + 1;
          detailArr.push(rules[i]["details"]); //get rule deatil
          ruleStatus.push(rules[i]["active"]); //get rule status
        }
      }
      setRuleID(ruleArr);//set ruleID
      setruleName(detailArr);//set rule detail
      setRuleLength(rules.length);// to act as the
      setAgentStatus(ruleStatus);
    });
  }, [currentService, current_url])
  
  //add and edit button
  const [getID, setID] = useState("");//get ids  of the editted or addedle
  const [valueRule, setValueRule] = useState("");//rules value
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setmodalTitle] = useState("");

  const showModal = (rule, text, id) =>{  //modal(UI) for editing or adding rules
    setIsModalVisible(true);
    setValueRule(rule);
    setmodalTitle(text);
    setID(id);
  }
  //EuiBasicTable start here
  

  const store = createDataStore(ruleID, ruleName, ruleLength); //parse rule info to back end

  //table variables
  const [pageIndex, setPageIndex] = useState(0); 
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("ruleID"); 
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

  const onTableChange = ({ page = {}, sort = {} }) => {// catch table state 
    const { index: pageIndex, size: pageSize } = page;
    const { field: sortField, direction: sortDirection } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  const onSelectionChange = (selectedItems) => {//keeptrack of the selected rule items
    setSelectedItems(selectedItems);
  };

  //delete function of the rule
  const onClickDelete = () => {
    //reorder array entry based on ID value after deletion
    let idArr = []
    for (let x = 0; x < selectedItems.length; x++){
      idArr[x] = selectedItems[x]["ruleID"]; 
      idArr.sort(function(a, b){return a - b});
    }

    //get rules from const
    let getruleArr = [...ruleID];
    let getnameArr = [...ruleName];
    let setruleArr = [];
    let setnameArr = [];

    //loop fetch based on ID
    for (let x = 0; x < selectedItems.length; x++){//linear search on the ID and delete
        fetch(current_url+"/deleteRule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "kbn-xsrf" : "reporting"
          },
          body: JSON.stringify({
            id: idArr[x]-x,
            service: currentService,
          }) 
        })
          .then(response => response.json())
          .then(response => {

          }) 
          .catch(err => console.log("api Error: ", err));
          //Splice index of deleted ID
          var toRemove = selectedItems[x]["ruleID"];
          var index = getruleArr.indexOf(toRemove);
          if (index > -1) { //Make sure item is present in the array, without if condition, -n indexes will be considered from the end of the array.
            setruleArr = getruleArr;
            setruleArr.splice(index, 1);
            getnameArr.splice(index, 1);
            setnameArr= getnameArr;
          }
    }
    //reassemble existing ID based on deletion
    for(let i = 0;  i < setruleArr.length; i++){
      setruleArr[i] = i + 1;
    }
    //set back new value
    store.deleteRules(setRuleLength, ...selectedItems.map((rule) => rule.id));
    setSelectedItems([]);
    setRuleID(setruleArr);
    setruleName(setnameArr);
  };

  const renderDeleteButton = () => {//render delete button if any of the item in rule table is selected
    if (selectedItems.length === 0) {
      return;
    }
    return (
      <EuiButton color="danger" iconType="trash" onClick={onClickDelete}>
        Delete {selectedItems.length} Rules
      </EuiButton>
    );
  };

  const toggleDetails = (item) => {// show description of the table
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

  //call function to find rules
  const { pageOfItems, totalItemCount } = store.findRules(
    pageIndex,
    pageSize,
    sortField,
    sortDirection
  );
  
  //call the render delete button
  const deleteButton = renderDeleteButton();

  //column formating
  const columns = [
    {
      field: "ruleID",
      name: "ID",//labelID
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
      name: "Rule",//label rule
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
          name: "Edit", //action
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

  const pagination = {//format the rule table pagination 
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: totalItemCount,
    pageSizeOptions: [3, 5, 8]// allow user to choose between number of rows for each table page
  };

  const sorting = {//sort called here
    sort: {
      field: sortField,
      direction: sortDirection
    }
  };

  const selection = { //call the on selection change rule here
    selectable: (rule) => rule.status,
    onSelectionChange: onSelectionChange
  };

  const [position, setPosition] = useState("fixed");//table position

  //rule tables end here

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
  // Agent Controller Logo
  const sections = [
    {
      items: [<EuiHeaderLogo>Agent Controller</EuiHeaderLogo>],
      borders: "right"
    }
  ];
  //delete agent function
  const deleteAgent = () => {
    const history = useHistory();
    const onClickDeleteAgent = () => {//API call for delete agent
      fetch(current_url+"/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "kbn-xsrf" : "reporting"
        }
      })
        .then(response => response.json())
        .then(() =>{
          let id = path(history);

          let newArr = [];
          for (let x in sideNavData) {
            if (sideNavData[x]["_id"] != id) {
              newArr.push(sideNavData[x]);
            }
          }
          setsideNavData(newArr);

          setURL("/api/agent_controller/default");
          history.push("/default");
          
        }) 
        .catch(err => console.log("api Error: ", err));
      };

      return(//render delete button if agent other than default is choosen
        <>
          <EuiButton color="danger" iconType="trash"  
          onClick={() => {
            onClickDeleteAgent();
          }}>
          Delete
          </EuiButton>
        </>
      );
  }


  //get interface values, store in array
  const [agentInterface, setInterface] = useState([]);
  useEffect(() => {
    http.get(current_url).then((res) => {//call get api to get interface information of agent service
      let newArr = [];
      for (let i = 0; i < res["interfaces"].length; i++) {
        newArr.push({ value: res["interfaces"][i], text: res["interfaces"][i] });
      }
      setInterface(newArr);//push the array to the interface filter array
    });
  }, [current_url])

  //get check frequency values, store in array
  const [agentFrequencies, setFrequencies] = useState([]);
  useEffect(() => {
    http.get(current_url).then((res) => {//call get api to get frequency information of agent service
      let newArr = [];
      for (let i = 0; i < res["times"].length; i++) {
        newArr.push({ value: res["times"][i], text: res["times"][i] }); 
      }
      setFrequencies(newArr);//push the array to the frequency filter array
    });
  }, [current_url])
  
  //side nav start here//
  //get sidenavdata values, store in array
  const [sideNavData, setsideNavData] = useState([]);

  const getSideNavContent = () => {//call get api to get the agent services in order to display them
    http.get('/api/agent_controller/sidenav_content').then((res) => {
      let newArr = [];
      for (let i = 0; i < res.length; i++) {
        newArr.push(res[i]); 
      }
      setsideNavData(newArr); 
    });
  }

  useEffect(() => {//call the api to get sidenavigation content
    getSideNavContent();
    setInterval(() =>{
      getSideNavContent();
    }, 15000);
  }, [])
  
  const path= (history) => {//format pathing of the system
    let delete_first_slash = history.location.pathname.replace(/\//, "");
    let resPath = delete_first_slash.replace(/(\/\/[^\/]+)?\/.*/, '$1');
    if (resPath == "") {
      return "default";
    } else {
      return resPath;
    }
  };
  //implementation of mainsidenav
  const mainSideNav = () => {
    //sidenav variables
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
    const [selectedItemName, setSelectedItem] = useState("default"); //variable to keeptrack of selected side nav
    const history = useHistory();
    setService(history.location.pathname.replace(/.*\//, ""));//update service path

    setURL("/api/agent_controller/"+path(history));
  
    const toggleOpenOnMobile = () => {//activate toggling sidenav content in mobile browser
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
    //initializing the sidenav content   
    const sideNav = [
      createItem('Navigation', {
        icon: <EuiIcon type="menu" />,
        items: [
            createItem("Default", {//create the default agent and services
                items: [
                    createItem('TShark', {}, "default/tshark"),
                    createItem('Suricata', {}, "default/suricata"),
                ],
            }, "default"),
        ],}, "default"),
    ]
    
    for (let x in sideNavData){
      let agent_name = sideNavData[x]["fields"]["name"];//create the agent and services of the system
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
    
    
    return(//HTML structure of side  nav
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
                    <Route path="/" component={deleteAgent}/>
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
                        <EuiSwitch
                            label="Service Status"
                            checked = {servicestatus}
                            onChange={(e) => setServiceStatus_onchange(e, current_url, setservicestatus, currentService)}
                            />
                          <EuiSpacer/>
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
