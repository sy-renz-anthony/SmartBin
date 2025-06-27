public interface Constants{
    public static final String API_SERVER="https://smartbin-x0i7.onrender.com/api",
                               DEVICE_ID="00000-01",
                               JSON_SELF_CHECK="{\"deviceID\": \""+DEVICE_ID+"\"}",
                               JSON_FULL_ERROR="{\"deviceID\": \""+DEVICE_ID+"\", \"garbageType\": ",
                               JSON_EMPTIED_EVENT="{\"deviceID\": \""+DEVICE_ID+"\", \"garbageType\": ",
                               JSON_USAGE_EVENT="{\"deviceID\": \""+DEVICE_ID+"\", \"garbageType\": ";
	
	public static final char DATA_DRY = 'd',
							 DATA_WET = 'w',
							 DATA_METALLIC = 'm';
							 
	public static final String JSON_WET = "\"WET\"",
							   JSON_DRY = "\"DRY\"",
							   JSON_METALLIC = "\"METALLIC\"";
}
