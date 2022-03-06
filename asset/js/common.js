var cs_common = {
    newId: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
            function(c) 
            {
                var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
    },
    randomColor: function () {        
        return '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);        
    },
}
Array.prototype.removeIf = function(callback) {
    var i = 0;
    while (i < this.length) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
        else {
            ++i;
        }
    }
};
Number.prototype.convertMilimetToCentimet = function(){
    return this/10;
};
Number.prototype.convertCentimetToMilimet = function(){
    return this*10;
}
Date.prototype.toDateStringDisplay = function(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let HH = today.getHours();
    let min = today.getMinutes();
    return  dd  +'/'+ mm +'/' + yyyy + ' '+HH+ ':'+min ;
}