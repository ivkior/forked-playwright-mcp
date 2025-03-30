import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function findExistingChromeDebugPort(): Promise<number | null> {
  try {
    if (process.platform === 'darwin') {
      // macOSの場合
      const { stdout } = await execAsync('ps aux | grep "Google Chrome" | grep "remote-debugging-port" | grep -v grep');
      const match = stdout.match(/--remote-debugging-port=(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    } else if (process.platform === 'win32') {
      // Windowsの場合
      const { stdout } = await execAsync('wmic process where caption="chrome.exe" get commandline');
      const match = stdout.match(/--remote-debugging-port=(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    } else if (process.platform === 'linux') {
      // Linuxの場合
      const { stdout } = await execAsync('ps aux | grep chrome | grep "remote-debugging-port" | grep -v grep');
      const match = stdout.match(/--remote-debugging-port=(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }
  } catch (error) {
    console.warn('Failed to find Chrome debug port:', error);
  }
  return null;
} 