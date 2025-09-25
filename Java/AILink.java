import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;

import org.json.JSONArray;
import org.json.JSONObject;

import engine.*;

public class AILink {

    public static void main(String[] args) {
        String imagePath = "image.jpg";

        try {
            GarbageType.garbageType response = identify(imagePath);
            System.out.println("API Response:");
            System.out.println(response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    

    public static final GarbageType.garbageType identify(String filePath) throws AIException{
        return identify(Constants.AI_MODEL_URL, filePath);
    }
    public static final GarbageType.garbageType identify(String apiUrl, String filePath) throws AIException {
        String boundary = "----Boundary" + System.currentTimeMillis();
        File file = new File(filePath);
        HttpURLConnection conn=null;

        try{
            conn = (HttpURLConnection) new URL(apiUrl).openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        }catch(IOException e){
            throw new AIException(e, "An IO error occured while trying to initialize sockets...");
        }
        

        try {
            OutputStream output = conn.getOutputStream();
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(output, "UTF-8"), true);

            writer.append("--").append(boundary).append("\r\n");
            writer.append("Content-Disposition: form-data; name=\"file\"; filename=\"" + file.getName() + "\"\r\n");
            writer.append("Content-Type: " + Files.probeContentType(file.toPath())).append("\r\n\r\n");
            writer.flush();

            Files.copy(file.toPath(), output);
            output.flush();

            writer.append("\r\n").flush();
            writer.append("--").append(boundary).append("--").append("\r\n");
            writer.flush();
        }catch(IOException e){
            throw new AIException(e, "An IO error occured during building of POST request");
        }

        StringBuilder response = new StringBuilder();
        try{
            int status = conn.getResponseCode();
            InputStream is = (status < HttpURLConnection.HTTP_BAD_REQUEST)
                    ? conn.getInputStream()
                    : conn.getErrorStream();

            BufferedReader in = new BufferedReader(new InputStreamReader(is));
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();
        }catch(IOException e){
            throw new AIException(e, "An IO error occured during processing of response from API server");
        }

        JSONObject json = new JSONObject(response.toString());
        GarbageType.garbageType output = null;

        System.out.println("Index: "+json.optInt("class_index"));
        System.out.println("Classification: "+json.optString("class_name"));
        int idx = json.optInt("class_index");

        if(idx==7||idx==6){
            output=GarbageType.garbageType.BIODEGRADABLE;
        }else if(idx>=2&&idx<=4){
            output=GarbageType.garbageType.HAZARDOUS;
        }else{
            output=GarbageType.garbageType.NON_BIODEGRADABLE;
        }

        return output;
    }
}
