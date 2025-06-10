/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author User
 */
import java.io.*;
import java.net.*;
import java.awt.*;
import java.awt.event.*;

import javax.swing.*;

public class ClientBase extends JFrame{
    private JTextField enterField;
    private JTextArea displayArea;
    private ObjectOutputStream outputStream;
    private ObjectInputStream inputStream;
    
    private String message;
    private String serverAddress;
    
    private Socket serverConnection;
    
    public ClientBase(String host){
        super("Client");
        
        serverAddress = host;
        
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
        container.add(new JScrollPane(displayArea), BorderLayout.CENTER);
        setSize(300, 600);
        setVisible(true);
    }
    
    public void runClient(){
        try{
            connectToServer();
            getStreams();
            processConnection();
            closeConnection();
        }catch(EOFException eofException){
            System.out.println("Server Terminated connection!");
        }catch(IOException ioException){
            System.err.println("An Error occured while processing Streams!");
            ioException.printStackTrace();
        }
    }
    
    private void connectToServer()throws IOException{
        displayArea.setText("Attempting connection\n");
        serverConnection = new Socket(InetAddress.getByName(this.serverAddress), 5000);
        
        displayArea.append("Connected to: "+serverConnection.getInetAddress().getHostName());
    }
    private void getStreams() throws IOException{
        outputStream = new ObjectOutputStream(serverConnection.getOutputStream());
        outputStream.flush();
        
        inputStream=new ObjectInputStream(serverConnection.getInputStream());
        displayArea.append("\nGot I/O streams\n");
    }
    private void processConnection() throws IOException{
        enterField.setEnabled(true);
        do{
            try{
                message = (String) inputStream.readObject();
                displayArea.append("\n"+message);
                displayArea.setCaretPosition(displayArea.getText().length());
                
                if(message.equals("SERVER>>> TERMINATE")){
                    displayArea.append("\nSERVER terminated the connection!");
                }
            }catch(ClassNotFoundException classNotFoundException){
                displayArea.append("\nUnknown Object type received");
            }
        }while(!message.equals("SERVER>>> TERMINATE"));
    }
    private void closeConnection() throws IOException{
        displayArea.append("\nClosing connection!");
        outputStream.close();
        inputStream.close();
        serverConnection.close();
    }
    
    private void sendData(String message){
        try{
            outputStream.writeObject("CLIENT>>> "+message);
            outputStream.flush();
            
            displayArea.append("\nCLIENT>>> "+message);
        }catch(IOException ioException){
            displayArea.append("\nError writing object");
            ioException.printStackTrace();
        }
    }
    
    public static void main(String[] args){
        ClientBase app;
        
        if(args.length == 0){
            app = new ClientBase("127.0.0.1");
        }else{
            app = new ClientBase(args[0]);
        }
        
        app.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        app.runClient();
    }
}