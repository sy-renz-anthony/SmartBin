package engine;

public class AIException extends EngineException{
    
    public AIException(){
        super();
    }
    public AIException(Throwable rootCause, String message){
        super(rootCause, message);
    }
    public AIException(Throwable rootCause){
        super(rootCause);
    }
    public AIException(String message){
        super(message);
    }
}
