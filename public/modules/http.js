(function() {
    const noop = () => null;

    class HttpModule {
        #ajax({
            method = 'GET',
            url = '/',
            body = null,
            callback = noop,
        } = {}) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;
        
            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState !== XMLHttpRequest.DONE) return;
        
                callback(xhr.status, xhr.responseText);
            });
        
            if (body) {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
                xhr.send(JSON.stringify(body));
                return;
            }
        
            xhr.send();
        }

        get(params = {}) {
            this.#ajax({
                ...params,
                method: 'GET',
            });
        }

        promisifyGet(params = {}) {
            return new Promise((resolve, reject) => {
                this.#ajax({
                    ...params,
                    method: 'GET',
                    callback: (status, responseText) => {
                        // 100, 200, 201, 204, ...
                        if (status < 300) {
                            resolve({status, responseText});
                            return;
                        }

                        reject({status, responseText});
                    },
                });
            });
        }

        getUsingFetch(params = {}) {
            let status;

            return fetch(params.url, {
                method: 'GET'
            }).then((response) => {
                status = response.status;
                return response.json();
            }).then((parsedJson) => {
                return {
                    status,
                    parsedJson,
                };
            });
        }

        async asyncGetUsingFetch(params = {}) {
            const response = await fetch(params.url, {
                method: 'GET'
            });
            const parsedJson = await response.json();

            return {
                status: response.status,
                parsedJson,
            };
        }

        post(params = {}) {
            this.#ajax({
                ...params,
                method: 'POST',
            });
        }
    }

    window.HttpModule = new HttpModule();
})();
