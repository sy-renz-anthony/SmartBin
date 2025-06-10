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
public class EngineException extends Exception{
    
    private String customMessage;
    
    public EngineException(){
        super();
        customMessage=null;
    }
    
    public EngineException(Throwable rootCause, String message){
        super(rootCause);
        this.customMessage=message;
    }
    public EngineException(Throwable rootCause){
        super(rootCause);
        this.customMessage=null;
    }
    public EngineException(String message){
        super();
        this.customMessage=message;
    }
    
    public String getErrorMessage(){
        return this.customMessage;
    }
    
    @Override
    public String getMessage(){
        return this.customMessage+"\n"+super.getMessage();
    }
    
}
