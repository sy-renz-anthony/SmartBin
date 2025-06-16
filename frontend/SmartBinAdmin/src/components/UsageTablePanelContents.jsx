
const UsageTablePanelContents = ({dataReference}) => {
    

    return (
        <div className="content-pane">
                <table className="table-general">
                  <thead className="tablehead-general">
                    <tr>
                      <th className="tableheadentry-general">Date</th>
                      <th className="tableheadentry-general">Device ID#</th>
                      <th className="tableheadentry-general">Location Description</th>
                      <th className="tableheadentry-general">Garbage Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataReference.map((usageRecord) => (
                      <tr key={usageRecord._id} className="tablerow-general">
                        <td className="tableentry-general">{usageRecord.eventDate}</td>
                        <td className="tableentry-general">{usageRecord.device.deviceID}</td>
                        <td className="tableentry-general">{usageRecord.device.location}</td>
                        <td className="tableentry-general">{usageRecord.garbageType}</td>
                      </tr>
                    ))} 
                  </tbody>
                </table>
        </div>
    )
}

export default UsageTablePanelContents
