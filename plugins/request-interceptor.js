(function() {
  "use strict";

  // Standalone Request Interceptor for Lampa Stack
  // Automatically initializes when loaded - no manual setup required
  
  const RequestInterceptor = {
    isActive: false,
    
    log: function() {
      let args = Array.from(arguments);
      args.unshift("🔒 Request Interceptor");
      console.originalLog ? console.originalLog.apply(console, args) : console.log.apply(console, args);
    },

    init: function() {
      this.log("Setting up comprehensive HTTPS interception");
      
      // Get current domain for proxy
      const proxyBase = window.location.protocol + "//" + window.location.host + "/proxy/";
      
      const makeSecure = (url) => {
        if (typeof url === 'string') {
          // Check if it's already our proxy URL
          if (url.indexOf('/proxy/http') !== -1) {
            return url;
          }
          
          // Handle both encoded and non-encoded HTTP URLs
          var targetUrl = url;
          if (url.startsWith('http%3A%2F%2F')) {
            // URL is encoded, decode it first
            try {
              targetUrl = decodeURIComponent(url);
            } catch (e) {
              targetUrl = url;
            }
          }
          
          if (targetUrl.startsWith('http://')) {
            console.warn("🔒 Lampa Stack: Intercepting HTTP URL:", targetUrl);
            var proxiedUrl = proxyBase + targetUrl;
            console.warn("🔒 Lampa Stack: Redirecting to:", proxiedUrl);
            return proxiedUrl;
          }
        }
        return url;
      };
      
      // Global flag to track interception status
      window.lampaStackInterceptionActive = true;
      this.isActive = true;

      // 1. Intercept fetch
      this._patchFetch(makeSecure);
      
      // 2. Intercept XMLHttpRequest
      this._patchXMLHttpRequest(makeSecure);
      
      // 3. Intercept video element src
      this._patchVideoElements(makeSecure);
      
      // 4. Intercept audio element src
      this._patchAudioElements(makeSecure);
      
      // 5. Watch for HLS.js and other video libraries
      this._patchHlsJs(makeSecure);
      
      // 6. Watch for dynamically added elements
      this._setupMutationObserver(makeSecure);
      
      // 7. Patch URL constructor for completeness
      this._patchURLConstructor(makeSecure);
      
      // 8. Add global error handler for mixed content
      this._setupErrorHandler();
      
      // 9. Monitor all network requests (if available)
      this._setupPerformanceObserver();
      
      // Re-check for HLS.js periodically (in case it loads later)
      setTimeout(() => this._patchHlsJs(makeSecure), 1000);
      setTimeout(() => this._patchHlsJs(makeSecure), 5000);
      
      // Final check - log interception status
      setTimeout(() => this._logInterceptionStatus(), 2000);
      
             this.log("HTTPS interception setup complete");
     },

     _patchFetch: function(makeSecure) {
      if (window.fetch && !window.fetch._lampaPatched) {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
          var secureUrl = makeSecure(url);
          if (secureUrl !== url) {
            console.warn("🔒 Lampa Stack: fetch intercepted:", url, "→", secureUrl);
          }
          
          // Also intercept redirects in the response
          return originalFetch(secureUrl, options).then(function(response) {
            // Check if response has a redirect with HTTP URL
            if (response.redirected && response.url && response.url.startsWith('http://')) {
              console.warn("🔒 Lampa Stack: Redirect detected to HTTP URL:", response.url);
              // Re-fetch with secure URL
              return originalFetch(makeSecure(response.url), options);
            }
            return response;
          });
        };
        window.fetch._lampaPatched = true;
        this.log("Patched fetch()");
      }
    },

    _patchXMLHttpRequest: function(makeSecure) {
      if (window.XMLHttpRequest && !XMLHttpRequest.prototype.open._lampaPatched) {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
          var secureUrl = makeSecure(url);
          if (secureUrl !== url) {
            console.warn("🔒 Lampa Stack: XMLHttpRequest intercepted:", url, "→", secureUrl);
          }
          return originalOpen.call(this, method, secureUrl, async, user, password);
        };
        XMLHttpRequest.prototype.open._lampaPatched = true;
        
        // Also intercept the send method to catch any missed URLs
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
          if (this._url && this._url.startsWith('http://')) {
            console.error("🚨 Lampa Stack: Missed HTTP request in XMLHttpRequest.send:", this._url);
          }
          return originalSend.call(this, data);
        };
        
        this.log("Patched XMLHttpRequest");
      }
    },

    _patchVideoElements: function(makeSecure) {
      if (window.HTMLVideoElement && !HTMLVideoElement.prototype.setAttribute._lampaPatched) {
        const originalVideoSetAttribute = HTMLVideoElement.prototype.setAttribute;
        HTMLVideoElement.prototype.setAttribute = function(name, value) {
          if (name === 'src' || name === 'data-src') {
            value = makeSecure(value);
          }
          return originalVideoSetAttribute.call(this, name, value);
        };
        HTMLVideoElement.prototype.setAttribute._lampaPatched = true;

        // Also patch the src property directly
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'src') || 
                                     Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
        if (originalSrcDescriptor && originalSrcDescriptor.set && !originalSrcDescriptor.set._lampaPatched) {
          Object.defineProperty(HTMLVideoElement.prototype, 'src', {
            set: function(value) {
              originalSrcDescriptor.set.call(this, makeSecure(value));
            },
            get: originalSrcDescriptor.get,
            configurable: true
          });
          originalSrcDescriptor.set._lampaPatched = true;
        }
        this.log("Patched HTMLVideoElement");
      }
    },

    _patchAudioElements: function(makeSecure) {
      if (window.HTMLAudioElement && !HTMLAudioElement.prototype.setAttribute._lampaPatched) {
        const originalAudioSetAttribute = HTMLAudioElement.prototype.setAttribute;
        HTMLAudioElement.prototype.setAttribute = function(name, value) {
          if (name === 'src' || name === 'data-src') {
            value = makeSecure(value);
          }
          return originalAudioSetAttribute.call(this, name, value);
        };
        HTMLAudioElement.prototype.setAttribute._lampaPatched = true;
        this.log("Patched HTMLAudioElement");
      }
    },

    _patchHlsJs: function(makeSecure) {
      if (window.Hls && !window.Hls._lampaPatched) {
        const originalLoadSource = window.Hls.prototype.loadSource;
        window.Hls.prototype.loadSource = function(url) {
          console.log("HLS.js loading source:", url);
          return originalLoadSource.call(this, makeSecure(url));
        };
        window.Hls._lampaPatched = true;
        this.log("Patched HLS.js");
      }
    },

    _setupMutationObserver: function(makeSecure) {
      const self = this;
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              // Check for video/audio elements with HTTP sources
              const mediaElements = node.querySelectorAll ? 
                node.querySelectorAll('video[src^="http://"], audio[src^="http://"], source[src^="http://"]') : [];
              
              for (let i = 0; i < mediaElements.length; i++) {
                const el = mediaElements[i];
                const src = el.getAttribute('src');
                if (src && src.startsWith('http://')) {
                  self.log("Found HTTP media element, proxying:", src);
                  el.setAttribute('src', makeSecure(src));
                }
              }
              
              // Check if the node itself is a media element
              if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO' || node.tagName === 'SOURCE') {
                const src = node.getAttribute('src');
                if (src && src.startsWith('http://')) {
                  self.log("Found HTTP media node, proxying:", src);
                  node.setAttribute('src', makeSecure(src));
                }
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      this.log("MutationObserver active");
    },

    _patchURLConstructor: function(makeSecure) {
      if (window.URL && !window.URL._lampaPatched) {
        const originalURL = window.URL;
        window.URL = function(url, base) {
          if (typeof url === 'string' && url.startsWith('http://')) {
            url = makeSecure(url);
          }
          return new originalURL(url, base);
        };
        // Copy static methods
        Object.setPrototypeOf(window.URL, originalURL);
        Object.getOwnPropertyNames(originalURL).forEach(function(name) {
          if (typeof originalURL[name] === 'function') {
            window.URL[name] = originalURL[name];
          }
        });
        window.URL._lampaPatched = true;
        this.log("Patched URL constructor");
      }
    },

    _setupErrorHandler: function() {
      window.addEventListener('error', function(e) {
        if (e.message && e.message.indexOf('Mixed Content') !== -1) {
          console.error("🚨 Lampa Stack: Mixed content error detected:", e.message);
        }
      });
    },

    _setupPerformanceObserver: function() {
      if (window.PerformanceObserver) {
        try {
          const observer = new PerformanceObserver(function(list) {
            list.getEntries().forEach(function(entry) {
              if (entry.name && entry.name.startsWith('http://')) {
                console.error("🚨 Lampa Stack: Unintercepted HTTP request detected:", entry.name);
              }
            });
          });
          observer.observe({entryTypes: ['resource']});
          this.log("Performance observer active");
        } catch (e) {
          this.log("Performance observer not available");
        }
      }
    },

    _logInterceptionStatus: function() {
      console.warn("🔒 Lampa Stack: Interception status check");
      console.warn("🔒 fetch patched:", !!window.fetch._lampaPatched);
      console.warn("🔒 XMLHttpRequest patched:", !!XMLHttpRequest.prototype.open._lampaPatched);
      console.warn("🔒 HTMLVideoElement patched:", !!HTMLVideoElement.prototype.setAttribute._lampaPatched);
      console.warn("🔒 HLS.js patched:", !!window.Hls && !!window.Hls._lampaPatched);
    },

    getStatus: function() {
      return {
        isActive: this.isActive,
        fetchPatched: !!window.fetch._lampaPatched,
        xmlHttpRequestPatched: !!XMLHttpRequest.prototype.open._lampaPatched,
        videoElementPatched: !!HTMLVideoElement.prototype.setAttribute._lampaPatched,
        hlsJsPatched: !!window.Hls && !!window.Hls._lampaPatched
      };
    }
  };

  // Auto-initialize when DOM is ready or immediately if already ready
  function autoInit() {
    RequestInterceptor.log("Auto-initializing request interceptor");
    RequestInterceptor.init();
  }

  // Check if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    // DOM is already ready, initialize immediately
    autoInit();
  }

  // Expose globally for optional status checking (but don't require it)
  window.LampaStackRequestInterceptor = RequestInterceptor;
})(); 