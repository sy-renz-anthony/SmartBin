import { useState } from 'react';
import BasePage from '../components/BasePage';
import UsageTablePanelSearchBar from '../components/UsageTablePanelSearchBar';
import UsageTablePanelContents from '../components/UsageTablePanelContents';

const Usages = () => {
  const [data, setData] = useState([]);

  const pageContent=()=>{
    return(
    <>
      <div className="content-pane">
        <h1 className='content-title'>Search Records</h1>
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