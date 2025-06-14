import { useState, useEffect} from 'react';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';


const UsageTablePanel = () => {
    const [keyword, setKeyword] = useState("");
    const [isWet, setIsWet] = useState(false);
    const [isDry, setIsDry] = useState(false);
    const [isMetallic, setIsMetallic] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [data, setData] = useState(null);

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

    const handleSubmit= async(e) =>{
        console.log("Search parameter: {keyword: "+keyword+", isWet: "+isWet+", isDry: "+isDry+", isMetallic: "+isMetallic+", startDate: "+startDate+", endDate: "+endDate+"}");
        
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
            }else{
                console.log(JSON.stringify(response.data));
                //setEndDate(response.data.);
            }

        } catch (err) {
        console.error("Login error:", err.message);
        }
    }

    const clearAll=()=>{
        setKeyword("");
        setIsDry(false);
        setIsMetallic(false);
        setIsWet(false);
        setStartDate("");
        setEndDate("");
    }
    return (
        <>
            <form action={handleSubmit} className="p-8 w-full" >
                <div className="search-pane-row">
                    <div className="search-pane-element-field">
                        <label className="text-gray-600 w-fit" htmlFor="keyword">
                        Device ID/Location:
                        </label>
                        <input
                        id="keyword"
                        type="text"
                        className="w-100 mx-4 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        />
                          
                    </div>
                    <div className="search-pane-element-checkbox">
                        <div className="ml-5 w-fit">
                            <label className="text-gray-600 mb-1 w-fit" htmlFor="isWet">
                            Wet:
                            </label>
                            <input 
                                className="ml-5 scale-150"
                                id="isWet"
                                type="checkbox"
                                checked={isWet}
                                onChange={(e)=>setIsWet(e.target.checked)}
                            />
                        </div>
                        <div className="w-fit">
                            <label className="text-gray-600 mb-1 w-fit" htmlFor="isDry">
                            Dry:
                            </label>
                            <input 
                                className="ml-5 scale-150"
                                id="isDry"
                                type="checkbox"
                                checked={isDry}
                                onChange={(e)=>setIsDry(e.target.checked)}
                            />
                        </div>
                        <div className="w-fit">
                            <label className="text-gray-600 mb-1 w-fit" htmlFor="isMetallic">
                            Metallic:
                            </label>
                            <input 
                                className="ml-5 scale-150"
                                id="isMetallic"
                                type="checkbox"
                                checked={isMetallic}
                                onChange={(e)=>setIsMetallic(e.target.checked)}
                            />
                        </div>
                    </div>
                </div>
                <div className="search-pane-row">
                    <div className="search-pane-element-field">
                        <label className="text-gray-600 text-left xl:text-right" htmlFor="startDate">
                        from:
                        </label>
                        <input
                        id="startDate"
                        type="date"
                        className="w-100 mx-4 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
                        placeholder="YYYY-MM-DD"
                        
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="search-pane-element-field">
                        <label className="text-gray-600 text-left xl:text-right" htmlFor="endDate">
                        to:
                        </label>
                        <input
                        id="endDate"
                        type="date"
                        className="w-100 mx-4 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
                        placeholder="YYYY-MM-DD"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className='search-pane-row'>
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
        </>
    )
}

export default UsageTablePanel