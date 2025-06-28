// DOM Helper Utilities
class DOMHelpers {
    // Safely query a single element
    static $(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.error('Error querying selector:', selector, error);
            return null;
        }
    }

    // Safely query multiple elements
    static $$(selector, context = document) {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (error) {
            console.error('Error querying selector:', selector, error);
            return [];
        }
    }

    // Create element with attributes and content
    static createElement(tag, attributes = {}, content = '') {
        try {
            const element = document.createElement(tag);
            
            // Set attributes
            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'dataset') {
                    Object.keys(attributes[key]).forEach(dataKey => {
                        element.dataset[dataKey] = attributes[key][dataKey];
                    });
                } else if (key === 'style' && typeof attributes[key] === 'object') {
                    Object.assign(element.style, attributes[key]);
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });
            
            // Set content
            if (content) {
                if (typeof content === 'string') {
                    element.innerHTML = content;
                } else if (content instanceof Node) {
                    element.appendChild(content);
                } else if (Array.isArray(content)) {
                    content.forEach(child => {
                        if (typeof child === 'string') {
                            element.appendChild(document.createTextNode(child));
                        } else if (child instanceof Node) {
                            element.appendChild(child);
                        }
                    });
                }
            }
            
            return element;
        } catch (error) {
            console.error('Error creating element:', error);
            return null;
        }
    }

    // Add class(es) to element
    static addClass(element, classes) {
        if (!element) return false;
        
        try {
            const classArray = Array.isArray(classes) ? classes : [classes];
            element.classList.add(...classArray);
            return true;
        } catch (error) {
            console.error('Error adding classes:', error);
            return false;
        }
    }

    // Remove class(es) from element
    static removeClass(element, classes) {
        if (!element) return false;
        
        try {
            const classArray = Array.isArray(classes) ? classes : [classes];
            element.classList.remove(...classArray);
            return true;
        } catch (error) {
            console.error('Error removing classes:', error);
            return false;
        }
    }

    // Toggle class on element
    static toggleClass(element, className) {
        if (!element) return false;
        
        try {
            return element.classList.toggle(className);
        } catch (error) {
            console.error('Error toggling class:', error);
            return false;
        }
    }

    // Check if element has class
    static hasClass(element, className) {
        if (!element) return false;
        
        try {
            return element.classList.contains(className);
        } catch (error) {
            console.error('Error checking class:', error);
            return false;
        }
    }

    // Get/Set element attributes
    static attr(element, attribute, value = undefined) {
        if (!element) return null;
        
        try {
            if (value === undefined) {
                return element.getAttribute(attribute);
            } else {
                element.setAttribute(attribute, value);
                return element;
            }
        } catch (error) {
            console.error('Error with attribute:', error);
            return null;
        }
    }

    // Remove attribute
    static removeAttr(element, attribute) {
        if (!element) return false;
        
        try {
            element.removeAttribute(attribute);
            return true;
        } catch (error) {
            console.error('Error removing attribute:', error);
            return false;
        }
    }

    // Get/Set element data attributes
    static data(element, key, value = undefined) {
        if (!element) return null;
        
        try {
            if (value === undefined) {
                return element.dataset[key];
            } else {
                element.dataset[key] = value;
                return element;
            }
        } catch (error) {
            console.error('Error with data attribute:', error);
            return null;
        }
    }

    // Show element
    static show(element, display = 'block') {
        if (!element) return false;
        
        try {
            element.style.display = display;
            return true;
        } catch (error) {
            console.error('Error showing element:', error);
            return false;
        }
    }

    // Hide element
    static hide(element) {
        if (!element) return false;
        
        try {
            element.style.display = 'none';
            return true;
        } catch (error) {
            console.error('Error hiding element:', error);
            return false;
        }
    }

    // Fade in element
    static fadeIn(element, duration = 300) {
        if (!element) return Promise.reject();
        
        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.display = 'block';
            element.style.transition = `opacity ${duration}ms ease`;
            
            // Force reflow
            element.offsetHeight;
            
            element.style.opacity = '1';
            
            setTimeout(() => {
                element.style.transition = '';
                resolve(element);
            }, duration);
        });
    }

    // Fade out element
    static fadeOut(element, duration = 300) {
        if (!element) return Promise.reject();
        
        return new Promise((resolve) => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.transition = '';
                resolve(element);
            }, duration);
        });
    }

    // Slide down element
    static slideDown(element, duration = 300) {
        if (!element) return Promise.reject();
        
        return new Promise((resolve) => {
            element.style.overflow = 'hidden';
            element.style.height = '0';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight + 'px';
            element.style.transition = `height ${duration}ms ease`;
            
            // Force reflow
            element.offsetHeight;
            
            element.style.height = targetHeight;
            
            setTimeout(() => {
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = '';
                resolve(element);
            }, duration);
        });
    }

    // Slide up element
    static slideUp(element, duration = 300) {
        if (!element) return Promise.reject();
        
        return new Promise((resolve) => {
            element.style.overflow = 'hidden';
            element.style.height = element.scrollHeight + 'px';
            element.style.transition = `height ${duration}ms ease`;
            
            // Force reflow
            element.offsetHeight;
            
            element.style.height = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = '';
                resolve(element);
            }, duration);
        });
    }

    // Check if element is visible
    static isVisible(element) {
        if (!element) return false;
        
        try {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
        } catch (error) {
            console.error('Error checking visibility:', error);
            return false;
        }
    }

    // Get element position
    static getPosition(element) {
        if (!element) return null;
        
        try {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
        } catch (error) {
            console.error('Error getting position:', error);
            return null;
        }
    }

    // Check if element is in viewport
    static isInViewport(element, threshold = 0) {
        if (!element) return false;
        
        try {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return rect.top <= windowHeight - threshold &&
                   rect.bottom >= threshold &&
                   rect.left <= windowWidth - threshold &&
                   rect.right >= threshold;
        } catch (error) {
            console.error('Error checking viewport:', error);
            return false;
        }
    }

    // Scroll to element
    static scrollTo(element, options = {}) {
        if (!element) return false;
        
        try {
            const defaultOptions = {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            };
            
            element.scrollIntoView({ ...defaultOptions, ...options });
            return true;
        } catch (error) {
            console.error('Error scrolling to element:', error);
            return false;
        }
    }

    // Delegate event listener
    static on(parent, eventType, selector, handler) {
        if (!parent) return false;
        
        try {
            const delegatedHandler = (event) => {
                const target = event.target.closest(selector);
                if (target && parent.contains(target)) {
                    handler.call(target, event);
                }
            };
            
            parent.addEventListener(eventType, delegatedHandler);
            
            // Return cleanup function
            return () => {
                parent.removeEventListener(eventType, delegatedHandler);
            };
        } catch (error) {
            console.error('Error setting up delegated event:', error);
            return false;
        }
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Wait for element to exist
    static waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }
}

// Export as global for easy access
window.DOM = DOMHelpers;