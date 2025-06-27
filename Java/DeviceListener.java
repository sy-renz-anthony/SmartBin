
public interface DeviceListener{

    public static final char TYPE_METAL = 'm',
                            TYPE_DRY = 'd',
                            TYPE_WET = 'w';

    public void garbageDetected(char garbageType);
    public void garbageErrorDetected(char garbageType);
    public void garbageBinFullError(char garbageType);
    public void garbageBinEmptied(char garbageType);
} 
