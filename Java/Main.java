/*
 * compile: javac -cp .:jSerialComm.jar Main.java -d output
 * run [cd first to /output]: javac -cp .:jSerialComm.jar Main 
*/


public class Main{

    public static void main(String[] args) throws Exception{
        DeviceReader deviceReader = new DeviceReader();
        ApiLink apiLink = new ApiLink();

        apiLink.start();
        deviceReader.setDeviceListener(new DeviceListener(){
            public void garbageDetected(char garbageType){
                String jsonPost = Constants.JSON_USAGE_EVENT;
                if(garbageType == Constants.DATA_DRY){
					jsonPost=jsonPost+Constants.JSON_DRY;
				}else if(garbageType == Constants.DATA_WET){
					jsonPost=jsonPost+Constants.JSON_WET;
				}else if(garbageType == Constants.DATA_METALLIC){
					jsonPost=jsonPost+Constants.JSON_METALLIC;
				}
				jsonPost=jsonPost+"}";
				apiLink.sendPOST("/usages/usage-event-occured", jsonPost);
            }
            public void garbageErrorDetected(char garbageType){
                System.out.println("an error occured at bin: "+garbageType);
            }
            public void garbageBinFullError(char garbageType){
                String jsonPost = Constants.JSON_FULL_ERROR;
                if(garbageType == Constants.DATA_DRY){
					jsonPost=jsonPost+Constants.JSON_DRY;
				}else if(garbageType == Constants.DATA_WET){
					jsonPost=jsonPost+Constants.JSON_WET;
				}else if(garbageType == Constants.DATA_METALLIC){
					jsonPost=jsonPost+Constants.JSON_METALLIC;
				}
				jsonPost=jsonPost+"}";
				apiLink.sendPOST("/usages/bin-full", jsonPost);
            }
            public void garbageBinEmptied(char garbageType){
                String jsonPost = Constants.JSON_EMPTIED_EVENT;
                if(garbageType == Constants.DATA_DRY){
					jsonPost=jsonPost+Constants.JSON_DRY;
				}else if(garbageType == Constants.DATA_WET){
					jsonPost=jsonPost+Constants.JSON_WET;
				}else if(garbageType == Constants.DATA_METALLIC){
					jsonPost=jsonPost+Constants.JSON_METALLIC;
				}
				jsonPost=jsonPost+"}";
				apiLink.sendPOST("/usages/bin-emptied", jsonPost);
            }
        });
        deviceReader.start();

    }
}
