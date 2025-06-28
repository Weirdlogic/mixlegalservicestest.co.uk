// Local Storage Utility Class
class Storage {
    static prefix = 'mix_legal_';

    // Check if localStorage is available
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get item from localStorage
    static get(key) {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return null;
        }

        try {
            const fullKey = this.prefix + key;
            const item = localStorage.getItem(fullKey);
            
            if (item === null) {
                return null;
            }

            // Try to parse as JSON, fallback to string
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        } catch (error) {
            console.error('Error getting item from localStorage:', error);
            return null;
        }
    }

    // Set item in localStorage
    static set(key, value) {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        try {
            const fullKey = this.prefix + key;
            const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(fullKey, serializedValue);
            return true;
        } catch (error) {
            console.error('Error setting item in localStorage:', error);
            return false;
        }
    }

    // Remove item from localStorage
    static remove(key) {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Error removing item from localStorage:', error);
            return false;
        }
    }

    // Clear all items with our prefix
    static clear() {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return false;
        }

        try {
            const keysToRemove = [];
            
            // Find all keys with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            // Remove all found keys
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Get all items with our prefix
    static getAll() {
        if (!this.isAvailable()) {
            console.warn('localStorage is not available');
            return {};
        }

        try {
            const items = {};
            
            for (let i = 0; i < localStorage.length; i++) {
                const fullKey = localStorage.key(i);
                if (fullKey && fullKey.startsWith(this.prefix)) {
                    const key = fullKey.replace(this.prefix, '');
                    items[key] = this.get(key);
                }
            }
            
            return items;
        } catch (error) {
            console.error('Error getting all items from localStorage:', error);
            return {};
        }
    }

    // Check if a key exists
    static has(key) {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const fullKey = this.prefix + key;
            return localStorage.getItem(fullKey) !== null;
        } catch (error) {
            console.error('Error checking if key exists in localStorage:', error);
            return false;
        }
    }

    // Get storage size (approximate)
    static getSize() {
        if (!this.isAvailable()) {
            return 0;
        }

        try {
            let totalSize = 0;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    const value = localStorage.getItem(key);
                    totalSize += key.length + (value ? value.length : 0);
                }
            }
            
            return totalSize;
        } catch (error) {
            console.error('Error calculating localStorage size:', error);
            return 0;
        }
    }

    // Set item with expiration
    static setWithExpiry(key, value, ttlMinutes = 60) {
        const now = new Date().getTime();
        const item = {
            value: value,
            expiry: now + (ttlMinutes * 60 * 1000)
        };
        
        return this.set(key, item);
    }

    // Get item with expiration check
    static getWithExpiry(key) {
        const item = this.get(key);
        
        if (!item) {
            return null;
        }
        
        // If item doesn't have expiry, return as-is (backward compatibility)
        if (typeof item !== 'object' || !item.hasOwnProperty('expiry')) {
            return item;
        }
        
        const now = new Date().getTime();
        
        // Check if item has expired
        if (now > item.expiry) {
            this.remove(key);
            return null;
        }
        
        return item.value;
    }

    // Clean up expired items
    static cleanupExpired() {
        if (!this.isAvailable()) {
            return 0;
        }

        try {
            let cleanedCount = 0;
            const keysToRemove = [];
            const now = new Date().getTime();
            
            for (let i = 0; i < localStorage.length; i++) {
                const fullKey = localStorage.key(i);
                if (fullKey && fullKey.startsWith(this.prefix)) {
                    const key = fullKey.replace(this.prefix, '');
                    const item = this.get(key);
                    
                    // Check if item has expiry and is expired
                    if (item && typeof item === 'object' && item.hasOwnProperty('expiry')) {
                        if (now > item.expiry) {
                            keysToRemove.push(key);
                        }
                    }
                }
            }
            
            // Remove expired items
            keysToRemove.forEach(key => {
                this.remove(key);
                cleanedCount++;
            });
            
            return cleanedCount;
        } catch (error) {
            console.error('Error cleaning up expired items:', error);
            return 0;
        }
    }

    // Backup all data to JSON
    static backup() {
        try {
            const allData = this.getAll();
            return JSON.stringify({
                timestamp: new Date().toISOString(),
                data: allData
            });
        } catch (error) {
            console.error('Error creating backup:', error);
            return null;
        }
    }

    // Restore data from JSON backup
    static restore(backupString) {
        try {
            const backup = JSON.parse(backupString);
            
            if (!backup.data || typeof backup.data !== 'object') {
                throw new Error('Invalid backup format');
            }
            
            let restoredCount = 0;
            
            // Restore each item
            Object.keys(backup.data).forEach(key => {
                if (this.set(key, backup.data[key])) {
                    restoredCount++;
                }
            });
            
            return restoredCount;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return 0;
        }
    }
}

// Auto-cleanup expired items on page load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        const cleanedCount = Storage.cleanupExpired();
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} expired items from localStorage`);
        }
    });
}