import com.fazecast.jSerialComm.SerialPort;
import java.io.*;

import engine.EngineException;

public class DeviceReader extends Thread{

    private DeviceListener listener;

    private String commPortURL;
    private boolean isRunning;
    private SerialPort comPort;
    private String currentLine;
    private byte[] buffer;

	private boolean isDeviceReady;

	private OutputStream outStream;

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
        this.isDeviceReady=false;
        this.comPort=null;
        this.currentLine=null;
        buffer=null;

        listener=null;
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
    public boolean isDeviceReady(){
			return isDeviceReady;
	}
    public void stopDeviceReader(){
        isRunning=false;
    }

    public void initiateDeviceReader() throws EngineException{
		try{
			this.comPort = SerialPort.getCommPort(this.commPortURL);

			this.comPort.setComPortParameters(9600, 8, SerialPort.ONE_STOP_BIT, SerialPort.NO_PARITY);
			
			this.comPort.setComPortTimeouts(SerialPort.TIMEOUT_NONBLOCKING, 0, 0);
			if(!this.comPort.openPort()){
				throw new Exception("cannot establish communication to device at url: "+this.commPortURL);
			}
			
			outStream=this.comPort.getOutputStream();

			buffer = new byte[1024];
			this.currentLine=null;
		}catch(Exception e){
			throw new EngineException(e, "An error occured during initialization fo Communication between arduino and orange pi devices!");
		}
    }
    
    public void sendMessageToArduino(String message) throws EngineException{
		if(!this.isRunning){
				throw new EngineException("Can't send message to arduino, DeviceReader Instance is not running!");
		}
		
		try{
			message=message+"\n";
			outStream.write(message.getBytes());
			outStream.flush();
		}catch(IOException e){
				throw new EngineException(e, "An error occured during attempt to send the message to arduino!");
		}	
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
            
            while(this.isRunning){
                int numRead = comPort.readBytes(buffer, buffer.length);
                if(!this.isDeviceReady){
					this.sendMessageToArduino("go");
				}
				
				if(numRead > 0){
                    currentLine = new String(buffer, 0, numRead);
                    currentLine=currentLine.replaceAll("[\\s\\r\\n]","");
                    System.out.println(currentLine);
                    
                    if(currentLine !=null && currentLine.length() >0 && !currentLine.isEmpty()){
						
						if(currentLine.equals("GO")){
							this.isDeviceReady=true;
						}else if(this.listener !=null){
							if(currentLine.charAt(0) == 't'){
								if(currentLine.charAt(1) == 'S'){
									listener.garbageDumped(currentLine.charAt(2));
								}else if(currentLine.charAt(1) == 'E'){
									listener.garbageErrorDetected(currentLine.charAt(2));
								}else if(currentLine.charAt(1) == 'R'){
										listener.garbageDetected();
								}
							}else if(currentLine.charAt(0)=='i'){
								if(currentLine.charAt(1) == 'F'){
									listener.garbageBinFullError(currentLine.charAt(2));
								}else if(currentLine.charAt(1)=='R'){
									listener.garbageBinEmptied(currentLine.charAt(2));
								}
							}
						}
					}
                    
                }
				try{
					Thread.sleep(100);
				}catch(InterruptedException e){}
            }

        }catch(Exception e){
            e.printStackTrace();
        }finally{
			if(outStream!=null){
				try{
					outStream.close();
				}catch(IOException e){}
			}
            if(this.comPort!=null){
                this.comPort.closePort();
            }   
        }
    }
}
