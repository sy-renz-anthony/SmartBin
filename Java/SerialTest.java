import com.fazecast.jSerialComm.SerialPort;

public class SerialTest{
    public static void main(String[] args){
        SerialPort comPort = SerialPort.getCommPort("/dev/ttyUSB0");
        comPort.setBaudRate(9600);

        if(!comPort.openPort()){
            System.out.println("Failed to Open Port!");
            return;
        }

        System.out.println("Reading from Serial!");
        try{

            byte[] buffer = new byte[1024];
            while(true){
                int numRead = comPort.readBytes(buffer, buffer.length);
                if(numRead > 0){
                    String data = new String(buffer, 0, numRead);
                    System.out.print(data);
                }
            }

        }catch(Exception e){
            e.printStackTrace();
        }finally{
            comPort.closePort();
        }
    }

}