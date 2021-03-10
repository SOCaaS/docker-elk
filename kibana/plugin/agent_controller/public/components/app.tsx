import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createDataStore } from "../data_store/data_store.ts";

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
    EuiHeaderLogo

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

  // const onSelectionChange = (selectedItems) => {
  //   setSelectedItems(selectedItems);
  // };

  const onClickDelete = () => {
    store.deleteUsers(...selectedItems.map((user) => user.id));

    setSelectedItems([]);
  };

  const renderDeleteButton = () => {
    if (selectedItems.length === 0) {
      return;
    }
    return (
      <EuiButton color="danger" iconType="trash" onClick={onClickDelete}>
        Delete {selectedItems.length} Users
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

  const { pageOfItems, totalItemCount } = store.findUsers(
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
          name: "Clone",
          description: "Clone this person",
          type: "icon",
          icon: "pencil",
          onClick: () => ""
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
    selectable: (user) => user.status
    // selectableMessage: (selectable) =>
    //   !selectable ? "User is currently offline" : undefined,
    // onSelectionChange: onSelectionChange
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
  for (let i = 1; i < 10; i++) {
    sideNav[0].items.push(
      createItem(
        'Agent '+i.toString(), {
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
            <EuiPageSideBar>
              <EuiPageContent>
                <EuiSideNav
                  aria-label="Force-open example"
                  mobileTitle="Default"
                  toggleOpenOnMobile={toggleOpenOnMobile}
                  isOpenOnMobile={isSideNavOpenOnMobile}
                  items={sideNav}
                />
              </EuiPageContent>
            </EuiPageSideBar>
            <EuiPageBody>
              <EuiPageHeader>
                  <EuiTitle size="l">
                    <h1>
                      <FormattedMessage
                        id="agentController.title"
                        defaultMessage="{name}"
                        values={{ name: PLUGIN_NAME }}
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
                          checked={checked}
                          onChange={(e) => onChange(e)}
                        />
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiText>IP: 192.168.12.0</EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>
                  </EuiFlexItem>
                  <EuiFlexItem>
                  <EuiPanel >
                  <EuiText>Status</EuiText>
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
                              options={options}
                              value={value}
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
                          {deleteButton}
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
                            checked={checked}
                            onChange={(e) => onChange(e)}
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
