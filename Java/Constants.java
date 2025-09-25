public interface Constants{
    public static final String API_SERVER="https://smartbin-x0i7.onrender.com/api",
                               DEVICE_ID="000-01",
                               JSON_SELF_CHECK="{\"deviceID\": \""+DEVICE_ID+"\"}",
                               JSON_FULL_ERROR="{\"deviceID\": \""+DEVICE_ID+"\", \"garbageType\": ",
                               JSON_EMPTIED_EVENT="{\"deviceID\": \""+DEVICE_ID+"\", \"garbageType\": ",
                               JSON_USAGE_EVENT="{\"deviceID\": \""+DEVICE_ID+"\", \"garbageType\": ";
	
	public static final char TYPE_BIODEGRADABLE = 'b',
							 TYPE_NONBIODEGRADABLE = 'n',
							 TYPE_HAZARDOUS = 'h',
							 TYPE_ERROR='`';
							 
	public static final String JSON_BIODEGRADABLE = "\"BIODEGRADABLE\"",
							   JSON_NONBIODEGRADABLE = "\"NON-BIODEGRADABLE\"",
							   JSON_HAZARDOUS = "\"HAZARDOUS\"";
							   
	public static final String AI_MODEL_URL = "https://renz-sy-waste-classification.hf.space/predict";
}
