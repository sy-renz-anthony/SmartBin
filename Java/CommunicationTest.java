
public class CommunicationTest{
	public static void main(String[] args){
		DeviceReader deviceReader = new DeviceReader();
        
        deviceReader.setDeviceListener(new DeviceListener(){
            public void garbageDetected(){
				System.out.println("garbage Thrown!");
            }
            public void garbageDumped(char garbageType){
				System.out.println("garbage dumped: "+garbageType);
			}
            public void garbageErrorDetected(char garbageType){
                System.out.println("an error occured at bin: "+garbageType);
            }
            public void garbageBinFullError(char garbageType){
                String jsonPost = Constants.JSON_FULL_ERROR;
                if(garbageType == Constants.TYPE_BIODEGRADABLE){
					jsonPost=jsonPost+Constants.JSON_BIODEGRADABLE;
				}else if(garbageType == Constants.TYPE_NONBIODEGRADABLE){
					jsonPost=jsonPost+Constants.JSON_NONBIODEGRADABLE;
				}else if(garbageType == Constants.TYPE_HAZARDOUS){
					jsonPost=jsonPost+Constants.JSON_HAZARDOUS;
				}
				jsonPost=jsonPost+"}";
				System.out.println("garbageBinFullError: "+jsonPost);
            }
            public void garbageBinEmptied(char garbageType){
                String jsonPost = Constants.JSON_EMPTIED_EVENT;
                if(garbageType == Constants.TYPE_BIODEGRADABLE){
					jsonPost=jsonPost+Constants.JSON_BIODEGRADABLE;
				}else if(garbageType == Constants.TYPE_NONBIODEGRADABLE){
					jsonPost=jsonPost+Constants.JSON_NONBIODEGRADABLE;
				}else if(garbageType == Constants.TYPE_HAZARDOUS){
					jsonPost=jsonPost+Constants.JSON_HAZARDOUS;
				}
				jsonPost=jsonPost+"}";
				System.out.println("garbageBinEmptied: "+jsonPost);
            }
        });
        deviceReader.start();
        
        ///*
        while(true){
				try{
					if(deviceReader.isDeviceReady()){
						deviceReader.sendMessageToArduino("Test message");
					}
					Thread.sleep(1000);
				}catch(Exception e){
					System.out.println("Error: "+e.getMessage());
					e.printStackTrace();
				}
		}//*/

	}
}
