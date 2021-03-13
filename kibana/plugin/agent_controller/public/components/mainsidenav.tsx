import {useHistory} from 'react-router-dom';
import { EuiSideNav, EuiIcon,} from '@elastic/eui';


const mainSideNav = () => {
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
    const [selectedItemName, setSelectedItem] = useState("");
    const history = useHistory();
    const toggleOpenOnMobile = () => {
      setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };
  
    const selectItem = (name) => {
      setSelectedItem(name);
      history.push("/"+name);
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
              items: [createItem('TShark', {}, "default/tshark"), createItem('Suricata', {},  "default/suricata")],
            },"default"),
          ],
      }, "nav1"),
    ];
    
    for (let i = 1; i < 10; i++) {
      let agent_num = "agentService"+ i.toString();
      sideNav[0].items.push(
        createItem(
          'Agent '+i.toString(), {
          items: [
            createItem('TShark', {}, agent_num + "/tshark"),
            createItem('Suricata', {}, agent_num +"/suricata"),
          ],
      }, agent_num));
    }
  
    return(
      <EuiSideNav
        mobileTitle="Navigate within $APP_NAME"
        toggleOpenOnMobile={toggleOpenOnMobile}
        isOpenOnMobile={isSideNavOpenOnMobile}
        items={sideNav}
        style={{ width: 192 }}
      />
    );
  };
