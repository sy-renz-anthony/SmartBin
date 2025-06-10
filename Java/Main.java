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
                System.out.println("disposing garbage type: "+garbageType);
            }
            public void garbageErrorDetected(char garbageType){
                System.out.println("an error occured at bin: "+garbageType);
            }
            public void garbageBinFullError(char garbageType){
                System.out.println("garbage bin full at: "+garbageType);
            }
            public void garbageBinEmptied(){
                System.out.println("All bins are now ok!");
            }
        });
        deviceReader.start();

    }
}