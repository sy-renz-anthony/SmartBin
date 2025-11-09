import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const options = ['Barangay', 'Municipality', 'Province', 'Region'];
const tableHeaders=[["Date", "Device ID#", "Location Description", "Garbage Type"]];

const Volumes = () => {
  const [data, setData] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selected, setSelected] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    
    const toggleOption = (option) => {
        setSelected(option);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(()=>{
        if(startDate.length<1)
            return;

        if(endDate.length<1){
            setEndDate(startDate);
        }else{
            const begin = new Date(startDate);
            const end = new Date(endDate);
            if(begin > end){
                setEndDate(startDate);
            }
        }
    }, [startDate]);


    const handleSubmit= async() =>{
        try {
            const searchParams={
                "startDate": startDate,
                "endDate": endDate
            }

            if(selected == "Barangay"){
              searchParams["barangay"] = keyword;
            }else if(selected == "Municipality"){
              searchParams["municipality"] = keyword;
            }else if(selected == "Province"){
              searchParams["province"] = keyword;
            }else if(selected == "Region"){
              searchParams["region"] = keyword;
            }
            
            if((!startDate || startDate.length < 1) && (endDate.length > 0)){
              toast.error("Cannot have an end date without a start date");
              return;
            }

            console.log(JSON.stringify(searchParams));
            
            const response = await axiosInstance.post("volume-records/search-record/group-by/location", searchParams, {withCredentials: true});
            if(!response.data.success){
                toast.error(response.data.message);
                setData([]);
            }else{
                setData(response.data.data);
                console.log(JSON.stringify(response.data.data));
            }
            
        } catch (err) {
        console.error("Data retrieval error:", err.message);
        }
    }

    const clearAll=()=>{
        setKeyword("");
        setSelected("");
        setStartDate("");
        setEndDate("");
        setData([]);
    }

    const convertToPDF = () =>{
        if(data.length<1){
          return;
        }
    
        const pdfDoc = new jsPDF();
    
        const pageWidth = pdfDoc.internal.pageSize.getWidth();
        pdfDoc.text('Siaton SmartBin', pageWidth / 2, 20, { align: 'center' });
    
        pdfDoc.setFontSize(14);
        pdfDoc.text("Usage Report", 14, 40);
        pdfDoc.setFontSize(10);
        var yOffset = 50;
        if(keyword !== ''){
          pdfDoc.text("Device ID#/Location contains: '"+keyword+"'", 25, yOffset);
          yOffset=yOffset+5;
        }

        if(selected.length>0){
          var stringGarbageType="Garbage Type: ";
          for(let i=0; i<selected.length; i++){
            stringGarbageType=stringGarbageType+selected[i];
            if((i+1) < selected.length){
              stringGarbageType=stringGarbageType+", "
            }
          }
          pdfDoc.text(stringGarbageType, 25, yOffset);
          yOffset=yOffset+5;
        }else{
          pdfDoc.text("Garbage Type: All", 25, yOffset);
          yOffset=yOffset+5;
        }

        if(startDate !== ''){
          if(endDate === startDate){
            pdfDoc.text("Date: "+startDate, 25, yOffset);
          }else{
            pdfDoc.text("Start Date: "+startDate, 25, yOffset);
            yOffset=yOffset+5;
            pdfDoc.text("End Date: "+endDate, 25, yOffset);
          }
          yOffset=yOffset+5;
        }

        const dataContents = data.map((row) => [
          row.eventDate,
          row.device.deviceID,
          row.device.location,
          row.garbageType
        ]);
    
        autoTable(pdfDoc, {
          head: tableHeaders,
          body: dataContents,
          startY: yOffset+5,
          didDrawPage: (dataContents) => {
            const pageHeight = pdfDoc.internal.pageSize.getHeight();
            const pageNumber = pdfDoc.internal.getNumberOfPages();
    
            pdfDoc.setFontSize(10);
            pdfDoc.text(
              `Page ${pageNumber}`,
              pageWidth / 2,
              pageHeight - 10,
              { align: 'center' }
            );
          },
        });
    
        pdfDoc.save('smartbin-usage-report.pdf');
      }

  const pageContent=()=>{
    return(
    <>
      <div className="content-pane">
        <div className="w-full flex flex-row">
          <h1 className='content-title'>Search Volume Records</h1>
          <div className="h-auto mb-3 flex ml-auto items-end text-right">
            <Link to="/usages" className="text-sm text-blue-500 hover:underline mx-3 my-3">
              usages
            </Link>
            <Link to="/events" className="text-sm text-blue-500 hover:underline mx-3 my-3">
              events
            </Link>
            <Link to="/volumes" className="text-sm text-white px-3 py-3 rounded-md bg-green-500">
              volume
            </Link>
          </div>
        </div>
        
        <hr />
{/*----------------------------------------------------------------------------------------------------------*/}
        <form action={handleSubmit} className="px-8 -mb-15 w-full" >
                <div className="search-pane-row">
                    <div className="flex flex-row my-2 text-xl gap-4 items-center">
                        <label className="text-gray-600" htmlFor="keyword">
                        Location Name:
                        </label>
                        <input
                        id="keyword"
                        type="text"
                        className="max-w-100 min-w-65 w-100 mx-4 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        />
                          
                    </div>
                    <div className="search-pane-element-checkbox">
                        <div className="w-64 p-4" ref={dropdownRef}>
                        <label className="text-gray-600 w-fit">Group by:</label>
                        <div
                            className="border border-gray-300 rounded p-2 cursor-pointer bg-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                        {(selected !== null && selected.length > 0) ? selected : '-----'}
                        </div>

                        {isOpen && (
                            <div className="border border-gray-300 rounded mt-1 bg-white shadow z-10 absolute w-64 max-h-60 overflow-auto">
                            {options.map((option) => (
                                <div
                                key={option}
                                onClick={() => toggleOption(option)}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                                    selected == option ? 'bg-blue-200' : ''
                                }`}
                                >
                                {option}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
                <div className="search-pane-row-flexible">
                    <div className="search-pane-element-field">
                        <label className="text-gray-600 md:text-right" htmlFor="startDate">
                        from:
                        </label>
                        <input
                        id="startDate"
                        type="date"
                        className="w-50 min-w-40 max-w-60 mx-4 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
                        placeholder="YYYY-MM-DD"
                        
                        value={startDate}
                        onChange={(f) => setStartDate(f.target.value)}
                        />
                    </div>
                    <div className="search-pane-element-field">
                        <label className="text-gray-600 md:text-right" htmlFor="endDate">
                        &nbsp;&nbsp;&nbsp;&nbsp;to:
                        </label>
                        <input
                        id="endDate"
                        type="date"
                        className="w-50 min-w-40 max-w-60 mx-4 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
                        placeholder="YYYY-MM-DD"
                        value={endDate}
                        min={startDate}
                        onChange={(g) => setEndDate(g.target.value)}
                        />
                    </div>
                </div>
                <div className='search-pane-element-field'>
                    <div className="flex items-center justify-center w-full h-auto pt-2">
                        <button
                        type="button"
                        className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                        onClick={clearAll}
                        >
                        clear
                        </button>
                    </div>
                    <div className="flex items-center justify-center w-full h-auto pt-2">
                        <button
                        type="submit"
                        className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition duration-200"
                        >
                        search
                        </button>
                    </div>
                    
                </div>
      </form>

{/*----------------------------------------------------------------------------------------------------------*/}
      </div>  
      {data !== null && data !== undefined && data.length > 0 ? 
      (
        <div className="content-pane flex flex-col">
          <div id='pdf-content'>
                <table className="table-general">
                  <thead className="tablehead-general">
                    <tr>
                      <th className="tableheadentry-general">{selected}</th>
                      <th className="tableheadentry-general">Biodegradable</th>
                      <th className="tableheadentry-general">Non-Biodegradable</th>
                      <th className="tableheadentry-general">Hazardous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((volumeRecord) => (
                      <tr key={volumeRecord._id} className="tablerow-general">
                        <td className="tableentry-general">{volumeRecord[selected.toLowerCase()]}</td>
                        <td className="tableentry-general">{volumeRecord.sum.BIODEGRADABLE != null ? (volumeRecord.sum.BIODEGRADABLE): 0}</td>
                        <td className="tableentry-general">{volumeRecord.sum["NON-BIODEGRADABLE"] != null ? (volumeRecord.sum["NON-BIODEGRADABLE"]) : 0}</td>
                        <td className="tableentry-general">{volumeRecord.sum.HAZARDOUS != null ? (volumeRecord.sum.HAZARDOUS) :0}</td>
                      </tr>
                    ))} 
                  </tbody>
                </table>
          </div>
          <div className="flex w-full items-center mt-5">
            <button type="submit" className="button-in-use ml-auto" onClick={(e)=>{ 
                e.preventDefault();
                convertToPDF();
              }}
            >Download</button>
          </div>
        </div>
      ) : (null)}
    </>
    );
  }

  return (
    <>
      <BasePage pageTitle="Usages" pageContent={pageContent}/>
    </>
  )
}

export default Volumes