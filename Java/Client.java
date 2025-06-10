/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author User
 */

import javax.swing.*;

import engine.*;
import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Client extends JFrame implements NetworkStateListener{
    private JTextField enterField;
    private JTextArea displayArea;
    
    private NetworkClient networkConnection;
    
    public Client(String host) throws EngineException{
        super("Client");
        
        Container container = getContentPane();
        
        enterField = new JTextField();
        enterField.setEnabled(false);
        
        enterField.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent evt){
                sendData(evt.getActionCommand());
            }
        });
        
        container.add(enterField, BorderLayout.NORTH);
        
        displayArea = new JTextArea();
        displayArea.setText("trying to connect to Server@: "+host+"...");
        container.add(new JScrollPane(displayArea), BorderLayout.CENTER);
        setSize(300, 600);
        setVisible(true);
        
        networkConnection=new NetworkClient(host);
        networkConnection.setNetworkStateListener(this);
    }
    
    private void sendData(String message){
        try{
            networkConnection.sendDataToServer("CLIENT>>> "+message);
            
            displayArea.append("\nCLIENT>>> "+message);
        }catch(EngineException ex){
            displayArea.append("\nError writing object");
            ex.printStackTrace();
        }
    }
    
    public void runClient(){
        networkConnection.start();
    }
    
    public static void main(String[] args){
        Client app;
        try {
            if(args.length == 0){
                app = new Client("127.0.0.1");   
            }else{
                app = new Client(args[0]);
            }
            
            app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            app.runClient();
        } catch (EngineException ex) {
            System.err.println(ex.getErrorMessage());
            ex.printStackTrace();
        }
        
    }

    @Override
    public void NetworkStartedRunning() {
        this.enterField.setEnabled(true);
        displayArea.append("\nConnected to Server@: "+this.networkConnection.getNetworkConnectionSocket().getInetAddress().getHostAddress());
        displayArea.append("\nGot I/O streams\n");
    }

    @Override
    public void NetworkClosed() {
        enterField.setText("");
        enterField.setEnabled(false);
        displayArea.append("\nServer@: "+this.networkConnection.getNetworkConnectionSocket().getInetAddress().getHostAddress()+" disconnected!");
    }

    @Override
    public void NetworkPaused() {}

    @Override
    public void NetworkResumed() {}

    @Override
    public void ClientReceivedMessage(Object message) {
        try{
        String content = (String) message;
        displayArea.append("\n"+content);
                displayArea.setCaretPosition(displayArea.getText().length());
                
        if(content.equals("SERVER>>> TERMINATE")){
            this.networkConnection.stopNetworkConnection();
        }
        }catch(ClassCastException ex){
            displayArea.append("\nUnknown object type received");
        }catch(EngineException ex){
            System.err.println(ex.getErrorMessage());
            ex.printStackTrace();
        }
    }
}
