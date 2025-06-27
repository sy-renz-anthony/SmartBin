import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.io.IOException;
import engine.EngineException;

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

    @Override
    public void run(){
        while(true){
            sendPOST("/devices/self-check", JSON_SELF_CHECK);
            try{
                Thread.sleep(30000);
            }catch(InterruptedException e){}
        }
    }
}
