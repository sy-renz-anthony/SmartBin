import java.io.*;

public final class CameraLink{
	
	private static CameraLink singleInstance;
	
	public static final String outputFileName="image.jpg";
	
	public static final String deviceLocation = "/dev/video0";
	
	
	private CameraLink(){}
	
	public boolean takePicture(){
		return takePicture(deviceLocation);
	}
	public boolean takePicture(String deviceLocation){
		boolean isSuccessful=false;
		try{
			ProcessBuilder builder = new ProcessBuilder("ffmpeg", "-y", "-f", "v4l2", "-input_format", "mjpeg", "-video_size", "1920x1080", "-i", deviceLocation, "-frames", "1", outputFileName);
			builder.redirectErrorStream(true);
			Process process=builder.start();
			
			BufferedReader br=new BufferedReader(new InputStreamReader(process.getInputStream()));
			
			int exitCode = process.waitFor();
			
			if(exitCode==0){
				System.out.println("Photo Taken!");
				isSuccessful=true;
			}else{
				String line;
				while((line=br.readLine()) != null){
						System.out.println(line);
				}
				
				System.out.println("Failed taking the picture!");
			}
			
		}catch(Exception e){
			System.out.println("An error occured during taking of photo!");
			e.printStackTrace();
		}
		
		return isSuccessful;
	}
	
	public static void main(String[] args){
		System.out.println("Starting Camera Test");
		CameraLink link=CameraLink.getSingleInstance();
		System.out.println("result: "+link.takePicture());
	}
	
	public static CameraLink getSingleInstance(){
			if(singleInstance == null){
					singleInstance = new CameraLink();
			}
		
		return singleInstance;
	}
}
