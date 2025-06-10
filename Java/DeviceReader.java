import com.fazecast.jSerialComm.SerialPort;
import java.io.*;

public class DeviceReader extends Thread{
    
    private final String requestMessage = "!";

    private DeviceListener listener;

    private String commPortURL;
    private boolean isRunning, errorCast;
    private SerialPort comPort;
    private String currentLine;
    private byte[] buffer;

    private double lastInquiryTime;

    public DeviceReader(){
        this(null);
    }
    public DeviceReader(String commPortURL){
        if(commPortURL == null || commPortURL.length() <=0){
            this.commPortURL = "/dev/ttyUSB0";
        }else{
            this.commPortURL = commPortURL;
        }
        this.isRunning=false;
        this.comPort=null;
        this.currentLine=null;
        buffer=null;

        listener=null;
        errorCast=false;
        lastInquiryTime = 0;
    }

    public void setCommPortURL(String commPortURL){
        this.commPortURL = commPortURL;
    }
    public String getCommPortURL(){
        return this.commPortURL;
    }

    public boolean isDeviceReaderRunning(){
        return isRunning;
    }
    public void stopDeviceReader(){
        isRunning=false;
    }

    public void initiateDeviceReader() throws Exception{
        this.comPort = SerialPort.getCommPort(this.commPortURL);

        this.comPort.setComPortParameters(9600, 8, SerialPort.ONE_STOP_BIT, SerialPort.NO_PARITY);
        //this.comPort.setBaudRate(9600);

        this.comPort.setComPortTimeouts(SerialPort.TIMEOUT_NONBLOCKING, 0, 0);
        if(!this.comPort.openPort()){
            throw new Exception("cannot establish communication to device at url: "+this.commPortURL);
        }

        buffer = new byte[1024];
        this.currentLine=null;
    }
    public void setDeviceListener(DeviceListener listener){
        this.listener = listener;
    }
    public DeviceListener getDeviceListener(){
        return this.listener;
    }

    @Override
    public void run(){
        try{
            initiateDeviceReader();
            this.isRunning = true;
            lastInquiryTime=System.currentTimeMillis();

            while(this.isRunning){
                int numRead = comPort.readBytes(buffer, buffer.length);
                if(numRead > 0){
                    currentLine = new String(buffer, 0, numRead);
                    if(this.listener !=null){
                        if(currentLine.charAt(0) == 't'){
                            if(currentLine.charAt(1) == 'S'){
                                listener.garbageDetected(currentLine.charAt(2));
                            }else if(currentLine.charAt(1) == 'E'){
                                listener.garbageErrorDetected(currentLine.charAt(2));
                            }
                        }else{
                            //System.out.println("info received: "+currentLine.charAt(0));
                            if(currentLine.charAt(0)=='i'){
                                
                                if(currentLine.charAt(1)=='1' && !errorCast){
                                    this.listener.garbageBinFullError(DeviceListener.TYPE_METAL);
                                    errorCast=true;
                                }else if(currentLine.charAt(2)=='1' && !errorCast){
                                    this.listener.garbageBinFullError(DeviceListener.TYPE_DRY);
                                    errorCast=true;
                                }else if(currentLine.charAt(3)=='1' && !errorCast){
                                    this.listener.garbageBinFullError(DeviceListener.TYPE_WET);
                                    errorCast=true;
                                }else if(currentLine.charAt(1) == '0' && currentLine.charAt(2)=='0' && currentLine.charAt(3)=='0' && errorCast){
                                    this.listener.garbageBinEmptied();
                                    errorCast=false;
                                }
                                
                            }
                        }
                    }
                }

                if((System.currentTimeMillis()-lastInquiryTime)>=500){
                    try{
                        byte[] messageBuffer = requestMessage.getBytes();
                        comPort.getOutputStream().write(messageBuffer);
                        comPort.getOutputStream().flush();
                    }catch(IOException e){
                        e.printStackTrace();
                    }
                    lastInquiryTime=System.currentTimeMillis();
                }
                Thread.sleep(100);
            }

        }catch(Exception e){
            e.printStackTrace();
        }finally{
            if(this.comPort!=null){
                this.comPort.closePort();
            }   
        }
    }
}