import { useState } from 'react';
import { Link } from "react-router-dom";
import BasePage from '../components/BasePage';
import UsageTablePanelSearchBar from '../components/UsageTablePanelSearchBar';
import UsageTablePanelContents from '../components/UsageTablePanelContents';

const Usages = () => {
  const [data, setData] = useState([]);

  const pageContent=()=>{
    return(
    <>
      <div className="content-pane">
        <div className="w-full flex flex-row">
          <h1 className='content-title'>Search Usage Records</h1>
          <div className="h-auto mb-3 flex ml-auto items-end text-right">
            <Link to="/events" className="text-sm text-blue-500 hover:underline">
              search for events
            </Link>
          </div>
        </div>
        
        <hr />
        <UsageTablePanelSearchBar apiResultListener={setData}/>  
      </div>  
      {data !== null && data !== undefined && data.length > 0 ? 
      (<UsageTablePanelContents dataReference={data} />) : (null)}
    </>
    );
  }

  return (
    <>
      <BasePage pageTitle="Usages" pageContent={pageContent}/>
    </>
  )
}

export default Usages