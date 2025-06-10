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
public interface NetworkStateListener {
    
    public void NetworkStartedRunning();
    public void NetworkClosed();
    public void NetworkPaused();
    public void NetworkResumed();

    public void ClientReceivedMessage(Object message);
}
