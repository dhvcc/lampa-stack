self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Intercept HTTP requests and proxy them
    if (url.protocol === 'http:') {
      const proxyUrl = `/proxy?url=${encodeURIComponent(event.request.url)}`;
      
      event.respondWith(
        fetch(proxyUrl, {
          method: event.request.method,
          headers: event.request.headers,
          body: event.request.body
        })
      );
    }
  });