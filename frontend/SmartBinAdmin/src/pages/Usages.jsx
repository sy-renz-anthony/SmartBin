import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const options = ['Dry', 'Wet', 'Metallic'];
const tableHeaders=[["Date", "Device ID#", "Location Description", "Garbage Type"]];

const Usages = () => {
  const [data, setData] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [isWet, setIsWet] = useState(false);
    const [isDry, setIsDry] = useState(false);
    const [isMetallic, setIsMetallic] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selected, setSelected] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    
    const toggleOption = (option) => {
        setSelected((prev) =>
        prev.includes(option)
            ? prev.filter((item) => item !== option)
            : ([...prev, option])
        );
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


    useEffect(() => {
        if(selected.includes("Dry")){
            setIsDry(true);
        }else{
            setIsDry(false);
        }    

        if(selected.includes("Wet")){
            setIsWet(true);
        }else{
            setIsWet(false);
        }

        if(selected.includes("Metallic")){
            setIsMetallic(true);
        }else{
            setIsMetallic(false);
        }
    }, [selected]);

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
                "keyword": keyword,
                "isWet": isWet,
                "isDry": isDry,
                "isMetallic": isMetallic,
                "startDate": startDate,
                "endDate": endDate
            }
            const response = await axiosInstance.post("/usages/search-record", searchParams, {withCredentials: true});
            if(!response.data.success){
                toast.error(response.data.message);
                setData([]);
            }else{
                setData(response.data.data);
            }

        } catch (err) {
        console.error("Data retrieval error:", err.message);
        }
    }

    const clearAll=()=>{
        setKeyword("");
        setIsWet(false);
        setIsDry(false);
        setIsMetallic(false);
        setSelected([]);
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
          <h1 className='content-title'>Search Usage Records</h1>
          <div className="h-auto mb-3 flex ml-auto items-end text-right">
            <Link to="/events" className="text-sm text-blue-500 hover:underline">
              search for events
            </Link>
          </div>
        </div>
        
        <hr />
{/*----------------------------------------------------------------------------------------------------------*/}
        <form action={handleSubmit} className="px-8 -mb-15 w-full" >
                <div className="search-pane-row">
                    <div className="flex flex-row my-2 text-xl gap-4 items-center">
                        <label className="text-gray-600" htmlFor="keyword">
                        Device ID/Location:
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
                        <label className="text-gray-600 w-fit">Garbage Type:</label>
                        <div
                            className="border border-gray-300 rounded p-2 cursor-pointer bg-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                        {selected.length > 0 ? selected.join(', ') : 'All'}
                        </div>

                        {isOpen && (
                            <div className="border border-gray-300 rounded mt-1 bg-white shadow z-10 absolute w-64 max-h-60 overflow-auto">
                            {options.map((option) => (
                                <div
                                key={option}
                                onClick={() => toggleOption(option)}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                                    selected.includes(option) ? 'bg-blue-200' : ''
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
                        className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
                        onClick={clearAll}
                        >
                        clear
                        </button>
                    </div>
                    <div className="flex items-center justify-center w-full h-auto pt-2">
                        <button
                        type="submit"
                        className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
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
                      <th className="tableheadentry-general">Date</th>
                      <th className="tableheadentry-general">Device ID#</th>
                      <th className="tableheadentry-general">Location Description</th>
                      <th className="tableheadentry-general">Garbage Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((usageRecord) => (
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

export default Usages