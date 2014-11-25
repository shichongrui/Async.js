var Async = (function () {

    function createWorker(newFunction, isPersistant) {
        var blob = new Blob(["var cb = ", newFunction.toString(), "; onmessage = function(message) { var data = message.data; var key = ", (isPersistant) ? "data.splice(data.length - 1, 1)[0]" : "null", "; var params = message.data; postMessage([cb.apply(self, params), key]); ", ((!isPersistant) ? "self.close();" : ""), " };"], {
            type: "application/javascript"
        });

        // Obtain a blob URL reference to our worker 'file'.
        var blobURL = window.URL.createObjectURL(blob);

        var worker = new Worker(blobURL);

        return worker;
    }

    function toArray(object) {
        var length = object.length,
            array = [];
        for (var i = 0; i < length; i++) {
            array.push(object[i]);
        }
        return array;
    }

    return {
        runInBackground: function () {
            var params = toArray(arguments);
            var func = params.splice(arguments.length - 1, 1)[0];

            return new Promise(function (resolve, reject) {
                var worker = createWorker(func, false);

                worker.onmessage = function (data) {
                    resolve(data.data[0]);
                }

                worker.postMessage(params);
            });
        },
        createPersistantThread: function (func) {
            var worker = createWorker(func, true),
                results = {};
            worker.addEventListener("message", function (message) {
                results[message.data[1]] = message.data[0];
            });

            return function () {
                var params = toArray(arguments),
                    key = params.join(",");
                params.push(key);
                worker.postMessage(params);

                return new Promise(function (resolve) {
                    worker.addEventListener("message", function(message) {
                        var messageKey = message.data[message.data.length -1];
                        if (messageKey === key) {
                            resolve(results[key]);
                            results[key] = undefined;
                        }
                    });
                });
            }
        }

    }

})();