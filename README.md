#Async.js#

Async.js is a small threading library for javascript.  I found some other threading libraries but they were all pretty complicated. So I set out to create a small and easy to use library.

Async.js uses inline web workers but abstracts all of the hard stuff away from you.  Async.js has only two functions you need to worry about:

###Async.runInBackground###
This function is simply for running code in the background.  A simple application of this function could be:

    Async.runInBackground(function(){
        console.log("This is running in the background");
    });
    
Because of the way that inline web workers function, the function you pass in to `runInBackground` will not maintain scope.  So to get around this you can pass any number of parameters into `runInBackground` that will be passed to your function.  The last parameter should always be the function you want to run in the background.

    Async.runInBackground(variable1, variable2, ..., function(parameter1, parameter2, ...) {
        //run some code that utilizes the passed in parameters
    });
    
Async.js relies on Javascript promises to let you know when the code in the background has completed.

    var asyncPromise = Async.runInBackground(function() {
        return "This is being returned from the background";
    });
    
    asyncPromise.then(function(data) {
        //This will be run on the main thread with access to the DOM etc...
        console.log(data) // will write "This is being returned from the background" to the console.
    });
    
After the code is done running in the background, the worker thread created from the call to `runInBackground` will be closed.
    
###createPersistantThread###

This function allows you to run some code in the background that won't close allowing you to run it multiple times with different parameters. It takes one parameter, the code you want to run in the background.  It returns a function that you can then call to run the code in the background.  When called this function returns a promise similar to how `runInBackground` works.

    var worker = Async.createPersitantThread(function() {
        return "This is being returned from the background";
    });
    
    var asyncPromise = worker();
    
    asyncPromise.then(function(data) {
        console.log(data); // prints "This is being returned from the background" to the console
    });
    
Persistant threads allow you to pass parameters into the function that will be run in the background.

    var worker = Async.createPersistantThread(function(parameter1, parameter2, ...) {
        //run some code that uses the parameters
        
        return [an array of data];
    });
    
    var firstPromise = worker(variable1, variable2, ...);
    
    firstPromise.then(function(data) {
        console.log(data) // prints the array of data returned from the background
    });
    
    var secondPromise = worker(differentVariable1, differentVariable2, ...);
    
    secondPromise.then(function(data) {
        console.log(data) // prints the array of data returned from the background
    });

And there you go.  Everything there is to know about Async.js