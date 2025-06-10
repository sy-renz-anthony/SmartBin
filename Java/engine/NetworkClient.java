/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package engine;

/**
 *
 * @author User
 */

import java.io.*;
import java.net.*;


public class NetworkClient extends Thread{
    
    public static enum NetworkConnectionState { INITIALIZED, RUNNING, PAUSED, CLOSED };
    
    public static final int DEFAULT_PORT=5000,
                            MIN_PORT=1024,
                            MAX_PORT=65535;
    
    public static final String DEFAULT_SERVER_ADDRESS="127.0.0.1";
    
    private ObjectOutputStream outputStream;
    private ObjectInputStream inputStream;
    
    private Socket clientConnection;
    
    private String serverAddress;
    private int port;
    
    private NetworkConnectionState currentState;
    private boolean isPaused;
    
    private NetworkStateListener listener;
    
    
    public NetworkClient(String serverAddress) throws EngineException{
        this(serverAddress, NetworkClient.DEFAULT_PORT);
    }
    public NetworkClient(String serverAddress, int port) throws EngineException{
        if(serverAddress==null||serverAddress.isEmpty())
            throw new EngineException("Server address can't be null!");
        
        if(port<MIN_PORT||port>MAX_PORT){
            throw new EngineException("Invalid port number! port number can only be set to the range between min and max port numbers...");
        }
        
        
        this.serverAddress=serverAddress;
        this.port=port;
        
        try {
            clientConnection = new Socket(InetAddress.getByName(this.serverAddress), this.port);
            
            outputStream = new ObjectOutputStream(clientConnection.getOutputStream());
            outputStream.flush();
        
            inputStream=new ObjectInputStream(clientConnection.getInputStream());
            
        } catch (UnknownHostException ex) {
            throw new EngineException(ex, "Cannot connect to server at IP address: "+this.serverAddress);
        } catch (IOException ex) {
            throw new EngineException(ex, "An error occured while trying to establish connection to server at IP address: "+this.serverAddress);
        }
        
        currentState=NetworkClient.NetworkConnectionState.INITIALIZED;
        listener=null;
        isPaused=false;
    }
    public void setNetworkStateListener(NetworkStateListener listener){
        this.listener=listener;
    }
    
    public NetworkStateListener getNetworkStateListener(){
        return this.listener;
    }
    
    public boolean hasNetworkStateListener(){
        return this.listener!=null;
    }
    
    public boolean isNetworkConnectionRunning(){
        return (currentState == NetworkClient.NetworkConnectionState.RUNNING && isPaused == false);
    }
    
    public boolean isNetworkConnectionPaused() throws EngineException{
        if(this.currentState== NetworkClient.NetworkConnectionState.CLOSED)
            throw new EngineException("Network Socket is already closed, surely it isn't paused anymore!");
        else if(this.currentState== NetworkClient.NetworkConnectionState.INITIALIZED)
            throw new EngineException("Network Connection hasn't started running yet, surely it isn't paused!");
        
        return isPaused;
    }
    
    public synchronized void pauseNetworkConnection() throws EngineException{
        if(this.currentState== NetworkClient.NetworkConnectionState.CLOSED)
            throw new EngineException("Network Socket is already closed, cannot pause it anymore!");
        else if(this.currentState== NetworkClient.NetworkConnectionState.INITIALIZED)
            throw new EngineException("Network Connection hasn't started running yet, cannot pause it!");
        
        this.isPaused=true;
    }
    
    public synchronized void resumeNetworkConnection() throws EngineException{
        if(this.currentState == NetworkClient.NetworkConnectionState.CLOSED)
            throw new EngineException("Network Socket is already closed, cannot resume it anymore!");
        else if(this.currentState== NetworkClient.NetworkConnectionState.INITIALIZED)
            throw new EngineException("Network Connection hasn't started running yet, cannot resume it!");
        
        this.isPaused=false;
    }
    
    public synchronized void stopNetworkConnection() throws EngineException{
        if(this.currentState == NetworkClient.NetworkConnectionState.CLOSED)
            throw new EngineException("Network Socket is already closed, cannot close it again!");
        else if(this.currentState== NetworkClient.NetworkConnectionState.INITIALIZED)
            throw new EngineException("Network Connection hasn't started running yet, cannot close it!");
        
        this.currentState=NetworkClient.NetworkConnectionState.CLOSED;
    }
    
    public synchronized NetworkClient.NetworkConnectionState getCurrentClientConnectionState(){
        return this.currentState;
    }
    
    public synchronized Socket getNetworkConnectionSocket(){
        return this.clientConnection;
    }
    
    @Override
    public void run(){
        this.currentState = NetworkClient.NetworkConnectionState.RUNNING;
        
        if(this.hasNetworkStateListener()){
            this.listener.NetworkStartedRunning();
        }
        
        while(currentState == NetworkClient.NetworkConnectionState.RUNNING){
            if(!isPaused){
                try{
                    Object message = inputStream.readObject();
                    if(hasNetworkStateListener())
                        this.listener.ClientReceivedMessage(message);
                    
                    
                }catch(EOFException | SocketException ex){
                    System.err.println("Server disconnected the connection!");
                    this.currentState=NetworkClient.NetworkConnectionState.CLOSED;
                    
                    ex.printStackTrace();
                }catch(IOException ioException){
                    System.err.println("An error occured while processing streams from Server");
                    ioException.printStackTrace();
                }catch(ClassNotFoundException ex){
                    System.err.println("Received an unknown object type from Server!");
                    ex.printStackTrace();
                }
            }
            
            try {
                Thread.sleep(500);
            } catch (InterruptedException ex) {}
        }
        
        if(hasNetworkStateListener()){
            this.listener.NetworkClosed();
        }
        
        
        try{
            outputStream.close();
            inputStream.close();
            clientConnection.close();
        }catch(IOException ioException){
            System.err.println("An error occured while closing streams from Server");
        }
        
        outputStream=null;
        inputStream=null;
        clientConnection=null;
        this.listener=null;
    }
    
    public synchronized void sendDataToServer(Object data) throws EngineException{
        if(this.currentState == NetworkClient.NetworkConnectionState.CLOSED)
            throw new EngineException("Socket is already closed, cannot send objects to the server anymore!");
        else if(this.currentState== NetworkClient.NetworkConnectionState.INITIALIZED)
            throw new EngineException("Network Connection hasn't started running yet, cannot send objects to the server!");
        else if(this.isPaused)
            throw new EngineException("Network Connection is Paused, cannot send objects to server!");
        
        try{
            outputStream.writeObject(data);
            outputStream.flush();
        }catch(IOException ioException){
            System.err.println("Error writing object");
            ioException.printStackTrace();
        }
    }
}
