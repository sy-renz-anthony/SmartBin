import { useState, useEffect, useRef} from 'react';
import { Link } from "react-router-dom";
import BasePage from '../components/BasePage';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const options = ['NonBiodegradable', 'Biodegradable', 'Hazardous'];
const eventTypes = ['Full', 'Emptied'];

const tableHeaders=[["Date", "Device ID#", "Location Description", "Event Type", "Garbage Type"]];

const Usages = () => {
    const [data, setData] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [isBiodegradable, setIsBiodegradable] = useState(false);
    const [isNonBiodegradable, setIsNonBiodegradable] = useState(false);
    const [isHazardous, setIsHazardous] = useState(false);
    const [isFullEvent, setIsFullEvent] = useState(false);
    const [isEmptyEvent, setIsEmptyEvent] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selected, setSelected] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const [typeSelected, setTypeSelected] = useState([]);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const dropdownTypeRef = useRef();

    
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

    const toggleTypeOption = (option) => {
        setTypeSelected((prev) =>
        prev.includes(option)
            ? prev.filter((item) => item !== option)
            : ([...prev, option])
        );
    };

    const handleTypeClickOutside = (e) => {
        if (dropdownTypeRef.current && !dropdownTypeRef.current.contains(e.target)) {
            setIsTypeOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleTypeClickOutside);
        return () =>{ 
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleTypeClickOutside);
        }
    }, []);


    useEffect(() => {
        if(selected.includes("NonBiodegradable")){
            setIsNonBiodegradable(true);
        }else{
            setIsNonBiodegradable(false);
        }    

        if(selected.includes("Biodegradable")){
            setIsBiodegradable(true);
        }else{
            setIsBiodegradable(false);
        }

        if(selected.includes("Hazardous")){
            setIsHazardous(true);
        }else{
            setIsHazardous(false);
        }
    }, [selected]);

    useEffect(() => {
        if(typeSelected.includes("Full")){
            setIsFullEvent(true);
        }else{
            setIsFullEvent(false);
        }    

        if(typeSelected.includes("Emptied")){
            setIsEmptyEvent(true);
        }else{
            setIsEmptyEvent(false);
        }

    }, [typeSelected]);

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
                "isBiodegradable": isBiodegradable,
                "isNonBiodegradable": isNonBiodegradable,
                "isHazardous": isHazardous,
                "isFullEvent": isFullEvent,
                "isEmptyEvent": isEmptyEvent,
                "startDate": startDate,
                "endDate": endDate
            }

            const response = await axiosInstance.post("/events/search-record", searchParams, {withCredentials: true});
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
        setIsBiodegradable(false);
        setIsNonBiodegradable(false);
        setIsHazardous(false);
        setSelected([]);
        setTypeSelected([]);
        setStartDate("");
        setEndDate("");
        setIsFullEvent(false);
        setIsEmptyEvent(false);
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
            pdfDoc.text("Event Report", 14, 40);
            pdfDoc.setFontSize(10);
            var yOffset = 50;
            if(keyword !== ''){
              pdfDoc.text("Device ID#/Location contains: '"+keyword+"'", 25, yOffset);
              yOffset=yOffset+5;
            }

            if(typeSelected.length>0){
              var stringEventType="Event Type: ";
              for(let i=0; i<typeSelected.length; i++){
                stringEventType=stringEventType+typeSelected[i];
                if((i+1) < typeSelected.length){
                  stringEventType=stringEventType+", "
                }
              }
              pdfDoc.text(stringEventType, 25, yOffset);
              yOffset=yOffset+5;
            }else{
              pdfDoc.text("Event Type: All", 25, yOffset);
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
              row.eventType,
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
        
            pdfDoc.save('smartbin-event-report.pdf');
    }

  const pageContent=()=>{
    return(
    <>
      <div className="content-pane">
        <div className="w-full flex flex-row">
          <h1 className='content-title'>Search Event Records</h1>
          <div className="h-auto mb-3 flex ml-auto items-end text-right">
            <Link to="/usages" className="text-sm text-blue-500 hover:underline">
              search for usages
            </Link>
          </div>
        </div>
        <hr />
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
                </div>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="flex flex-row w-fit my-2 text-xl gap-2 items-center">
                        <div className="min-w-80 p-4" ref={dropdownRef}>
                        <label className="text-gray-600 w-fit">Garbage Type:</label>
                        <div
                            className="min-w-80 border border-gray-300 rounded p-2 cursor-pointer bg-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                        {selected.length > 0 ? selected.join(', ') : 'All'}
                        </div>

                        {isOpen && (
                            <div className="border border-gray-300 rounded mt-1 bg-white shadow z-10 absolute min-w-80 max-h-60 overflow-auto">
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


                    <div className="flex flex-row w-fit my-2 text-xl gap-2 items-center lg:ml-5">
                        <div className="min-w-80 p-4" ref={dropdownTypeRef}>
                        <label className="text-gray-600 w-fit">Event Type:</label>
                        <div
                            className="min-w-80 border border-gray-300 rounded p-2 cursor-pointer bg-white"
                            onClick={() => setIsTypeOpen(!isTypeOpen)}
                        >
                        {typeSelected.length > 0 ? typeSelected.join(', ') : 'All'}
                        </div>

                        {isTypeOpen && (
                            <div className="border border-gray-300 rounded mt-1 bg-white shadow z-10 absolute min-w-80 max-h-60 overflow-auto">
                            {eventTypes.map((option) => (
                                <div
                                key={option}
                                onClick={() => toggleTypeOption(option)}
                                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                                    typeSelected.includes(option) ? 'bg-blue-200' : ''
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
      </div>  
      {data !== null && data !== undefined && data.length > 0 ? (
            <div className="content-pane">
                <table className="table-general">
                  <thead className="tablehead-general">
                    <tr>
                      <th className="tableheadentry-general">Date</th>
                      <th className="tableheadentry-general">Device ID#</th>
                      <th className="tableheadentry-general">Location Description</th>
                      <th className="tableheadentry-general">Event Type</th>
                      <th className="tableheadentry-general">Garbage Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((eventRecord) => (
                      <tr key={eventRecord._id} className="tablerow-general">
                        <td className="tableentry-general">{eventRecord.eventDate}</td>
                        <td className="tableentry-general">{eventRecord.device.deviceID}</td>
                        <td className="tableentry-general">{eventRecord.device.location}</td>
                        <td className="tableentry-general">{eventRecord.eventType}</td>
                        <td className="tableentry-general">{eventRecord.garbageType}</td>
                      </tr>
                    ))} 
                  </tbody>
                </table>
                <br />
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