import { useNavigate } from "react-router-dom";
import {MdHome, MdGroupAdd, MdSummarize, MdPinDrop, MdAccountCircle, MdLogout} from 'react-icons/md'
import {BsFillTrashFill} from 'react-icons/bs'
import {Tooltip} from 'react-tooltip'

const SideBarIcon =({textLabel, route, icon }) =>{
  const navigate = useNavigate();

  const navBarPressed = async (route) => {
    if(!route)
      return;

    navigate(route);
  };


    return (
        <button className="sidebar-icon" id={textLabel} onClick={()=>navBarPressed(route)}>
            {icon}
            <Tooltip anchorSelect={"#"+textLabel} content={textLabel} />
            <span>{textLabel}</span>
        </button>
    );
}



const SideBar = ({logoutButtonEventHandler}) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-25 m-0 flex flex-col bg-gray-900 text-white text-xs shadow-lg p-1">
        <SideBarIcon textLabel="Home" icon={<MdHome size="28"/>} route="/home"/>
        <SideBarIcon textLabel="Add User" icon={<MdGroupAdd size="28" />} route="/add-user"/>
        <SideBarIcon textLabel="Devices" icon={<BsFillTrashFill size="28" />} route="/devices"/>
        <SideBarIcon textLabel="Usages" icon={<MdSummarize size="28" />} />
        <SideBarIcon textLabel="Map" icon={<MdPinDrop size="28"/>} />
        <SideBarIcon textLabel="My Account" icon={<MdAccountCircle size="28" />} route="/my-account"/>
        <SideBarIcon textLabel="Logout" icon={<MdLogout size="28" onClick={logoutButtonEventHandler}/>} />
    </div>
  )
}

export default SideBar