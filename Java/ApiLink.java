import java.net.http.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.io.*;
import engine.EngineException;

import org.json.JSONArray;
import org.json.JSONObject;

public class ApiLink extends Thread implements Constants{

    private String apiURL;
    private HttpClient client;
    private HttpRequest request;
    
    public ApiLink() throws EngineException{
        this(Constants.API_SERVER);
    }
    public ApiLink(String baseApiURL) throws EngineException{
        if(baseApiURL==null || baseApiURL.isEmpty()){
            throw new EngineException("API Base URL is empty!");
        }

        this.apiURL=baseApiURL;
        client = HttpClient.newHttpClient();
    }

    public synchronized boolean sendPOST(String apiEndpoint, String jsonData){
        try{
            request = HttpRequest.newBuilder()
            .uri(URI.create(apiURL+apiEndpoint))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if(response.statusCode()!=200){
                System.err.println("The POST request failed!");
                return false;
            }
            
            return true;
        }catch(IOException e){
            System.err.println("An I/O error occured while trying to send POST request!");
            return false;
        }catch(InterruptedException e){
            System.err.println("POST request is taking to long to send!");
            return false;
        }catch(Exception e){
            System.err.println("An error occured during sending of POST request!");
            return false;
        }
    }
    
    public synchronized String[] retrieveContactNumberForSmsNotification(String apiEndpoint){
		try{
			HttpClient client = HttpClient.newHttpClient();
			HttpRequest request = HttpRequest.newBuilder().uri(URI.create(apiURL+apiEndpoint)).GET().build();
			
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			
			System.out.println("Status Code: "+response.statusCode());
			System.out.println("Body: "+response.body());
			
			if(response.statusCode() != 200){
				return null;
			}
			
			JSONObject json = new JSONObject(response.body());
			JSONArray data = json.getJSONArray("data");
			String[] contents = new String[data.length()];
			
			for(int i=0; i< data.length(); i++){
				contents[i] = data.getJSONObject(i).optString("contactNumber");
				System.out.println(contents[i]);
			} 
			
			return contents;
		}catch(IOException e){
			System.err.println("An I/O error occured while trying to send GET request!");
			return null;
		}catch(InterruptedException e){
            System.err.println("GET request is taking to long to send!");
            return null;
        }catch(Exception e){
            System.err.println("An error occured during sending of GET request!");
            return null;
        }
	}

    @Override
    public void run(){
        while(true){
            sendPOST("/devices/self-check", JSON_SELF_CHECK);
            try{
                Thread.sleep(30000);
            }catch(InterruptedException e){}
        }
    }
    
    public static void main(String[] args){
		try{
			ApiLink testSubject = new ApiLink();
		
			String[] numbers = testSubject.retrieveContactNumberForSmsNotification("/users/for-sms");
			System.out.print("retrieved numbers: ");
			for(int i=0;i<numbers.length;i++){
				System.out.print(numbers[i]+" ");
			}
			System.out.println();
		}catch(Exception e){
			System.err.println(e.getMessage());
			e.printStackTrace();
		}
	}
}
