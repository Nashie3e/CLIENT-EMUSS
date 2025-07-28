#!/usr/bin/env python3
"""
Frontend Server Monitor and Version Manager
-------------------------------------------
This script monitors the health of the React frontend server,
provides automatic version patching capabilities, and reports
on system health metrics.
"""

import os
import sys
import json
import time
import signal
import logging
import requests
import subprocess
import threading
import textwrap
from datetime import datetime, timedelta
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("frontend_monitor.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("frontend_monitor")

# Configuration
class Config:
    # Server settings
    SERVER_HOST = os.environ.get('FRONTEND_HOST', 'localhost')
    SERVER_PORT = int(os.environ.get('FRONTEND_PORT', 3000))
    HEALTH_CHECK_INTERVAL = int(os.environ.get('HEALTH_CHECK_INTERVAL', 60))  # seconds
    
    # Current version from package.json
    @staticmethod
    def get_current_version():
        try:
            package_path = Path(__file__).parent / 'package.json'
            with open(package_path, 'r') as f:
                package_data = json.load(f)
                return package_data.get('version', '0.0.1')
        except Exception as e:
            logger.error(f"Error reading package.json: {e}")
            return "0.0.1"
    
    # Version management
    VERSION = get_current_version.__func__()
    VERSION_FILE = Path(__file__).parent / '.version'
    BACKUP_DIR = Path(__file__).parent / 'backups'
    ENV_FILE = Path(__file__).parent / '.env'
    SAMPLE_ENV_FILE = Path(__file__).parent / 'sample.env'
    API_ENDPOINTS_FILE = Path(__file__).parent / 'api-endpoints.txt'
    
    # Initialize
    @classmethod
    def initialize(cls):
        # Create backup directory if it doesn't exist
        cls.BACKUP_DIR.mkdir(exist_ok=True)
        
        # Create version file if it doesn't exist
        if not cls.VERSION_FILE.exists():
            with open(cls.VERSION_FILE, 'w') as f:
                f.write(cls.VERSION)
        
        # Create .env file from sample.env if it doesn't exist
        if not cls.ENV_FILE.exists() and cls.SAMPLE_ENV_FILE.exists():
            with open(cls.SAMPLE_ENV_FILE, 'r') as source:
                with open(cls.ENV_FILE, 'w') as target:
                    for line in source:
                        if 'REACT_APP_VERSION' in line:
                            target.write(f"REACT_APP_VERSION={cls.VERSION}\n")
                        else:
                            target.write(line)
            logger.info(f"Created .env file with version {cls.VERSION}")

class ServerMonitor:
    def __init__(self):
        self.is_running = False
        self.server_process = None
        self.monitor_thread = None
        self.last_restart = None
        self.consecutive_failures = 0
        self.version = Config.VERSION

    def start(self):
        """Start the server monitor"""
        logger.info(f"Starting frontend monitor for version {self.version}")
        self.is_running = True
        
        # Start monitoring thread
        self.monitor_thread = threading.Thread(target=self._monitor_loop)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()
        
        # Handle termination signals
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        # Keep main thread alive
        try:
            while self.is_running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop()

    def stop(self):
        """Stop the server monitor"""
        logger.info("Stopping frontend monitor...")
        self.is_running = False
        if self.server_process:
            logger.info("Stopping frontend process...")
            self._stop_server()
        
    def restart_server(self):
        """Restart the server"""
        logger.info("Restarting frontend server...")
        self._stop_server()
        time.sleep(2)
        self._start_server()
        self.last_restart = datetime.now()
    
    def check_health(self):
        """Check if the server is healthy"""
        try:
            url = f"http://{Config.SERVER_HOST}:{Config.SERVER_PORT}"
            response = requests.get(url, timeout=5)
            if response.status_code in [200, 304]:  # React apps often return 304 Not Modified
                self.consecutive_failures = 0
                return True
            else:
                logger.warning(f"Health check failed with status code: {response.status_code}")
                self.consecutive_failures += 1
                return False
        except requests.RequestException as e:
            logger.warning(f"Health check request failed: {e}")
            self.consecutive_failures += 1
            return False
    
    def update_version(self, new_version):
        """Update the system version"""
        logger.info(f"Updating version from {self.version} to {new_version}")
        
        # Backup current version
        backup_file = Config.BACKUP_DIR / f"frontend_backup_{self.version}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.tar.gz"
        try:
            # Create backup tar (excluding node_modules and build folders which are large)
            subprocess.run(
                f"tar -czf {backup_file} --exclude='node_modules' --exclude='build' --exclude='backups' .", 
                shell=True, 
                check=True
            )
            logger.info(f"Backup created at {backup_file}")
            
            # Update version in package.json
            package_path = Path(__file__).parent / 'package.json'
            with open(package_path, 'r') as f:
                package_data = json.load(f)
            
            package_data['version'] = new_version
            
            with open(package_path, 'w') as f:
                json.dump(package_data, f, indent=2)
            
            # Update version file
            with open(Config.VERSION_FILE, 'w') as f:
                f.write(new_version)
            
            # Update .env file if it exists
            if Config.ENV_FILE.exists():
                self._update_env_file(new_version)
            
            self.version = new_version
            logger.info(f"Version updated to {new_version}")
            
            # Rebuild and restart server to apply changes
            self._rebuild_frontend()
            self.restart_server()
            return True
        except Exception as e:
            logger.error(f"Error updating version: {e}")
            return False
    
    def _update_env_file(self, new_version):
        """Update version in .env file"""
        try:
            # Read current content
            with open(Config.ENV_FILE, 'r') as f:
                lines = f.readlines()
            
            # Update version line
            with open(Config.ENV_FILE, 'w') as f:
                for line in lines:
                    if line.startswith('REACT_APP_VERSION='):
                        f.write(f"REACT_APP_VERSION={new_version}\n")
                    else:
                        f.write(line)
            
            logger.info("Updated version in .env file")
        except Exception as e:
            logger.error(f"Error updating .env file: {e}")
    
    def _rebuild_frontend(self):
        """Rebuild the frontend after version change"""
        try:
            logger.info("Rebuilding frontend application...")
            subprocess.run(
                "npm run build",
                shell=True,
                check=True
            )
            logger.info("Frontend rebuilt successfully")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Error rebuilding frontend: {e}")
            return False
            
    def _monitor_loop(self):
        """Main monitoring loop"""
        logger.info("Starting monitoring loop...")
        
        # Initial server start
        self._start_server()
        
        while self.is_running:
            # Check server health
            is_healthy = self.check_health()
            
            # If not healthy and too many consecutive failures, restart
            if not is_healthy and self.consecutive_failures >= 3:
                logger.warning(f"Frontend unhealthy after {self.consecutive_failures} consecutive failures. Restarting...")
                self.restart_server()
            
            # Check if we need to apply version update
            self._check_for_version_update()
            
            # Sleep for check interval
            time.sleep(Config.HEALTH_CHECK_INTERVAL)
    
    def _start_server(self):
        """Start the React frontend server"""
        try:
            logger.info("Starting frontend server...")
            # Use npm start to start the server
            self.server_process = subprocess.Popen(
                "npm start", 
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                start_new_session=True
            )
            logger.info(f"Frontend server started with PID {self.server_process.pid}")
        except Exception as e:
            logger.error(f"Error starting frontend server: {e}")
    
    def _stop_server(self):
        """Stop the React frontend server"""
        if self.server_process:
            try:
                # Try graceful termination first
                os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
                
                # Wait for process to terminate
                try:
                    self.server_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    # Force kill if needed
                    logger.warning("Frontend server didn't terminate gracefully, force killing...")
                    os.killpg(os.getpgid(self.server_process.pid), signal.SIGKILL)
                
                logger.info("Frontend server stopped")
            except Exception as e:
                logger.error(f"Error stopping frontend server: {e}")
            
            self.server_process = None
    
    def _check_for_version_update(self):
        """Check if there's a version update to apply"""
        try:
            if Config.VERSION_FILE.exists():
                with open(Config.VERSION_FILE, 'r') as f:
                    file_version = f.read().strip()
                
                if file_version != self.version:
                    logger.info(f"Version update detected: {self.version} -> {file_version}")
                    self.update_version(file_version)
        except Exception as e:
            logger.error(f"Error checking for version update: {e}")
    
    def _signal_handler(self, sig, frame):
        """Handle termination signals"""
        logger.info(f"Received signal {sig}, shutting down...")
        self.stop()
        sys.exit(0)

def check_server_status():
    """Command to check frontend server status"""
    url = f"http://{Config.SERVER_HOST}:{Config.SERVER_PORT}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code in [200, 304]:
            print(f"Frontend server is UP - Version: {Config.VERSION}")
            print(f"Status code: {response.status_code}")
            return True
        else:
            print(f"Frontend server is responding with status code: {response.status_code}")
            return False
    except requests.RequestException:
        print("Frontend server is DOWN or not responding")
        return False

def patch_version(new_version):
    """Command to patch to a new version"""
    if not new_version:
        print("Error: Version number required")
        return False
    
    # Validate version format
    import re
    if not re.match(r'^\d+\.\d+\.\d+', new_version):
        print("Error: Version should be in format x.y.z")
        return False
    
    print(f"Updating to version {new_version}...")
    
    # Update version file
    try:
        with open(Config.VERSION_FILE, 'w') as f:
            f.write(new_version)
        print(f"Version file updated. Frontend monitor will apply the change.")
        
        # Also update .env directly for immediate effect
        if Config.ENV_FILE.exists():
            try:
                # Read current content
                with open(Config.ENV_FILE, 'r') as f:
                    lines = f.readlines()
                
                # Update version line
                with open(Config.ENV_FILE, 'w') as f:
                    version_found = False
                    for line in lines:
                        if line.startswith('REACT_APP_VERSION='):
                            f.write(f"REACT_APP_VERSION={new_version}\n")
                            version_found = True
                        else:
                            f.write(line)
                    
                    # Add version if not found
                    if not version_found:
                        f.write(f"\nREACT_APP_VERSION={new_version}\n")
                
                print(f"Updated version in .env file")
            except Exception as e:
                print(f"Warning: Could not update .env file: {e}")
        
        return True
    except Exception as e:
        print(f"Error updating version file: {e}")
        return False

def create_env_file():
    """Create a .env file with current version"""
    if Config.ENV_FILE.exists():
        print(f".env file already exists at {Config.ENV_FILE}")
        return False
    
    try:
        with open(Config.ENV_FILE, 'w') as f:
            f.write(f"REACT_APP_API_URL=http://localhost:5000/api\n")
            f.write(f"REACT_APP_SOCKET_URL=http://localhost:5000\n")
            f.write(f"REACT_APP_VERSION={Config.VERSION}\n")
        
        print(f"Created .env file with version {Config.VERSION}")
        return True
    except Exception as e:
        print(f"Error creating .env file: {e}")
        return False

class TerminalEditor:
    """Interactive terminal editor for system settings"""
    
    def __init__(self):
        self.env_file = Config.ENV_FILE
        self.api_endpoints_file = Config.API_ENDPOINTS_FILE
        self.settings = {}
        self.load_settings()
    
    def load_settings(self):
        """Load settings from .env file"""
        if not self.env_file.exists():
            print("No .env file found. Creating a default one...")
            create_env_file()
        
        try:
            with open(self.env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        self.settings[key] = value
        except Exception as e:
            print(f"Error loading settings: {e}")
    
    def save_settings(self):
        """Save settings back to .env file"""
        try:
            with open(self.env_file, 'w') as f:
                for key, value in self.settings.items():
                    f.write(f"{key}={value}\n")
            print("Settings saved successfully!")
            return True
        except Exception as e:
            print(f"Error saving settings: {e}")
            return False
    
    def display_api_endpoints(self):
        """Display API endpoints from the endpoints file"""
        if not self.api_endpoints_file.exists():
            print("API endpoints file not found.")
            return
        
        try:
            with open(self.api_endpoints_file, 'r') as f:
                content = f.read()
            
            print("\n" + "="*80)
            print("API ENDPOINTS".center(80))
            print("="*80 + "\n")
            
            # Print content with proper formatting
            lines = content.split('\n')
            for line in lines:
                if line.startswith('#'):
                    # Section header
                    print(f"\n\033[1;34m{line[2:]}\033[0m")
                    print("-" * len(line[2:]))
                elif line.startswith('-'):
                    # Endpoint
                    parts = line[2:].split(' - ', 1)
                    if len(parts) == 2:
                        endpoint, description = parts
                        print(f"\033[1;32m{endpoint.ljust(40)}\033[0m {description}")
                    else:
                        print(line[2:])
                else:
                    print(line)
            
            print("\n" + "="*80 + "\n")
            input("Press Enter to continue...")
        except Exception as e:
            print(f"Error displaying API endpoints: {e}")
    
    def edit_settings(self):
        """Edit environment settings"""
        while True:
            self._clear_screen()
            print("\n" + "="*80)
            print("ENVIRONMENT SETTINGS EDITOR".center(80))
            print("="*80 + "\n")
            
            # Display current settings
            print("Current Settings:")
            print("-" * 60)
            for i, (key, value) in enumerate(self.settings.items(), 1):
                print(f"{i}. {key} = {value}")
            
            print("\n" + "-" * 60)
            print("Options:")
            print("A. Add new setting")
            print("E. Edit setting")
            print("D. Delete setting")
            print("S. Save changes")
            print("Q. Quit without saving")
            
            choice = input("\nEnter your choice: ").upper()
            
            if choice == 'A':
                key = input("Enter new setting name: ").strip()
                if key:
                    value = input(f"Enter value for {key}: ")
                    self.settings[key] = value
                    print(f"Added {key}={value}")
                    input("Press Enter to continue...")
            
            elif choice == 'E':
                try:
                    idx = int(input("Enter setting number to edit: "))
                    if 1 <= idx <= len(self.settings):
                        key = list(self.settings.keys())[idx-1]
                        value = input(f"Enter new value for {key} (current: {self.settings[key]}): ")
                        self.settings[key] = value
                        print(f"Updated {key}={value}")
                    else:
                        print("Invalid setting number")
                    input("Press Enter to continue...")
                except ValueError:
                    print("Please enter a valid number")
                    input("Press Enter to continue...")
            
            elif choice == 'D':
                try:
                    idx = int(input("Enter setting number to delete: "))
                    if 1 <= idx <= len(self.settings):
                        key = list(self.settings.keys())[idx-1]
                        confirm = input(f"Are you sure you want to delete {key}? (y/n): ").lower()
                        if confirm == 'y':
                            del self.settings[key]
                            print(f"Deleted {key}")
                    else:
                        print("Invalid setting number")
                    input("Press Enter to continue...")
                except ValueError:
                    print("Please enter a valid number")
                    input("Press Enter to continue...")
            
            elif choice == 'S':
                if self.save_settings():
                    print("Settings saved successfully!")
                input("Press Enter to continue...")
                return
            
            elif choice == 'Q':
                confirm = input("Discard changes? (y/n): ").lower()
                if confirm == 'y':
                    return
    
    def main_menu(self):
        """Display main menu"""
        while True:
            self._clear_screen()
            print("\n" + "="*80)
            print("TERMINAL SYSTEM EDITOR".center(80))
            print("="*80 + "\n")
            
            print("1. Edit Environment Settings")
            print("2. View API Endpoints")
            print("3. Check Server Status")
            print("4. Update Version")
            print("0. Exit")
            
            choice = input("\nEnter your choice: ")
            
            if choice == '1':
                self.edit_settings()
            elif choice == '2':
                self.display_api_endpoints()
            elif choice == '3':
                self._clear_screen()
                check_server_status()
                input("\nPress Enter to continue...")
            elif choice == '4':
                new_version = input("Enter new version (x.y.z): ")
                patch_version(new_version)
                input("\nPress Enter to continue...")
            elif choice == '0':
                return
    
    def _clear_screen(self):
        """Clear terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')

if __name__ == "__main__":
    # Initialize configuration
    Config.initialize()
    
    # Parse command-line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "status":
            check_server_status()
        elif command == "start":
            monitor = ServerMonitor()
            monitor.start()
        elif command == "version":
            print(f"Current version: {Config.VERSION}")
        elif command == "patch":
            if len(sys.argv) > 2:
                patch_version(sys.argv[2])
            else:
                print("Error: Version number required")
                print("Usage: python server.py patch x.y.z")
        elif command == "env":
            create_env_file()
        elif command == "edit":
            editor = TerminalEditor()
            editor.main_menu()
        elif command == "api":
            editor = TerminalEditor()
            editor.display_api_endpoints()
        else:
            print("Unknown command")
            print("Usage: python server.py [start|status|version|patch|env|edit|api]")
    else:
        # Default: start the monitor
        print("Starting frontend monitor...")
        monitor = ServerMonitor()
        monitor.start() 