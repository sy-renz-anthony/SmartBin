import engine.*;

public class Main{

    public static void main(String[] args) throws Exception{
        DeviceReader deviceReader = new DeviceReader();
        ApiLink apiLink = new ApiLink();
		CameraLink camera = CameraLink.getSingleInstance();

        apiLink.start();
        deviceReader.setDeviceListener(new DeviceListener(){
            public void garbageDetected(){
				try{
					if(!camera.takePicture()){
						System.out.println("failed to take picture!");
						deviceReader.sendMessageToArduino("o"+Constants.TYPE_ERROR);
					}
					GarbageType.garbageType result= AILink.identify(CameraLink.outputFileName);
					System.out.println("Garbage Type: "+result);
					if(result==GarbageType.garbageType.BIODEGRADABLE){
						deviceReader.sendMessageToArduino("o"+Constants.TYPE_BIODEGRADABLE);
					}else if(result==GarbageType.garbageType.NON_BIODEGRADABLE){
						deviceReader.sendMessageToArduino("o"+Constants.TYPE_NONBIODEGRADABLE);
					}else if(result==GarbageType.garbageType.HAZARDOUS){
							deviceReader.sendMessageToArduino("o"+Constants.TYPE_HAZARDOUS);
					}else{
							deviceReader.sendMessageToArduino("o"+Constants.TYPE_ERROR);
					}
				}catch(AIException e){
					System.out.println("A network error occured identifying the material online");
					e.printStackTrace();
					try{
						deviceReader.sendMessageToArduino("o"+Constants.TYPE_ERROR);
					}catch(Exception ex){}
				}catch(Exception e){
					System.out.println(e.getMessage());
					e.printStackTrace();
				}
				
            }
            public void garbageDumped(char garbageType){
				System.out.println("garbage dumped: "+garbageType);
				String jsonPost = Constants.JSON_USAGE_EVENT;
                if(garbageType == Constants.TYPE_NONBIODEGRADABLE){
					jsonPost=jsonPost+Constants.JSON_NONBIODEGRADABLE;
				}else if(garbageType == Constants.TYPE_BIODEGRADABLE){
					jsonPost=jsonPost+Constants.JSON_BIODEGRADABLE;
				}else if(garbageType == Constants.TYPE_HAZARDOUS){
					jsonPost=jsonPost+Constants.JSON_HAZARDOUS;
				}
				jsonPost=jsonPost+"}";
				apiLink.sendPOST("/usages/usage-event-occured", jsonPost);
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
				apiLink.sendPOST("/usages/bin-full", jsonPost);
				 
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
				apiLink.sendPOST("/usages/bin-emptied", jsonPost);
				 
            }
        });
        deviceReader.start();

    }
}
