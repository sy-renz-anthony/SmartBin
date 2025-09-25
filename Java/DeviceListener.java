
public interface DeviceListener{
	public void garbageDetected();
	public void garbageDumped(char garbageType);
    public void garbageErrorDetected(char garbageType);
    public void garbageBinFullError(char garbageType);
    public void garbageBinEmptied(char garbageType);
} 
