import java.io.*;

public final class NetworkLink{
	
	private static NetworkLink singleInstance;
	
	public static final String gsmDeviceLocation = "/dev/ttyS2";
	
	private boolean isMobileDataRunning;
	
	private NetworkLink(){
		isMobileDataRunning = false;
		turnOnMobileData();
	}
	
	public boolean sendTextMessage(String number, String message){
		System.out.println("Number: "+number);
		turnOffMobileData();
		try{
			ProcessBuilder builder = new ProcessBuilder("./send_sms.sh", number, message);
			builder.redirectErrorStream(true);
			Process process=builder.start();
			
			BufferedReader br=new BufferedReader(new InputStreamReader(process.getInputStream()));
			
			int exitCode = process.waitFor();
			
			if(exitCode==0){
				System.out.println("Text message sent successfully!");
				
			}else{
				String line;
				while((line=br.readLine()) != null){
						System.out.println(line);
				}
				
				System.out.println("Sending of Text message notification Failed!");
				return false;
			}
			
						
		}catch(Exception e){
			System.out.println("An error occured during attempt to send text message!");
			e.printStackTrace();
			turnOnMobileData();
			return false;
		}
		
		turnOnMobileData();
		return true;	
	}
	
	public synchronized void sendATCommands(OutputStream outStream, String command) throws IOException{
		outStream.write(("\\n"+command+"\\r").getBytes());
		outStream.flush();
		System.out.println("processing command: "+command);
	}
	public synchronized void sendFinalATCommand(OutputStream outStream, String command) throws IOException{
		outStream.write((command+"\\x1A").getBytes());
		outStream.flush();
		System.out.println("processing command: "+command);
	}
	
	public synchronized boolean readATResponse(InputStream inStream) throws IOException{
		if(inStream.available()<=0){
			return false;
		}
		
		while(inStream.available() > 0){
			System.out.print((char)inStream.read());
		}
		System.out.println();
		return true;
	}
	
	public boolean turnOnMobileData(){
		if(isMobileDataRunning){
			return true;
		}
		
		try{
			ProcessBuilder builder = new ProcessBuilder("sudo", "/usr/bin/pon", "sim7600");
			builder.redirectErrorStream(true);
			Process process=builder.start();
			
			BufferedReader br=new BufferedReader(new InputStreamReader(process.getInputStream()));
			
			int exitCode = process.waitFor();
			
			if(exitCode==0){
				System.out.println("Internet turned on!");
				isMobileDataRunning=true;
			}else{
				String line;
				while((line=br.readLine()) != null){
						System.out.println(line);
				}
				isMobileDataRunning=false;
				System.out.println("Failed turning on Mobile Data!");
				return false;
			}
			
			
			try{
				Thread.sleep(1000);
			}catch(InterruptedException e){}
			
			return true;
		}catch(Exception e){
			isMobileDataRunning=false;
			System.out.println("An error occured during Mobile Data initialization!");
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean turnOffMobileData(){
		if(!isMobileDataRunning){
			return true;
		}
		
		try{
			ProcessBuilder builder = new ProcessBuilder("sudo", "/usr/bin/poff", "sim7600");
			builder.redirectErrorStream(true);
			Process process=builder.start();
			
			BufferedReader br=new BufferedReader(new InputStreamReader(process.getInputStream()));
			
			int exitCode = process.waitFor();
			
			if(exitCode==0){
				System.out.println("Internet turned off!");
				isMobileDataRunning=false;
			}else{
				String line;
				while((line=br.readLine()) != null){
						System.out.println(line);
				}
				
				System.out.println("Failed turning on Mobile Data!");
				return false;
			}
			
			try{
				Thread.sleep(1000);
			}catch(InterruptedException e){}
			
			return true;
			
		}catch(Exception e){
			System.out.println("An error occured during Mobile Data initialization!");
			e.printStackTrace();
			return false;
		}	
		
	}
	
	
	public static void main(String[] args){
		System.out.println("Starting Network Test");
		String bin="Biodegradable";
		NetworkLink link=NetworkLink.getSingleInstance();
		System.out.println("result: "+link.sendTextMessage("+639701061974", "SmartBin Notification\nThe "+bin+" Bin of SmartBin device with ID#: "+Constants.DEVICE_ID+" is full."));
		//System.out.println("result: "+link.sendTextMessage("+639701061974", "Test text message"));
	}
	
	public static NetworkLink getSingleInstance(){
			if(singleInstance == null){
					singleInstance = new NetworkLink();
			}
		
		return singleInstance;
	}
}
