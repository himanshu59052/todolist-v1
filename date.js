//jshint esversion6

exports.getDate=function getDate(){
const today = new Date();

const options = {
    weekday: "long",
    day: "numeric",
    month: "long",

}

// let day = today.toLocaleDateString("en-us", options);
// return day;
return today.toLocaleDateString("en-us",options);
}

exports.getDay=function getDay(){
    const today = new Date();
    
    const options = {
        weekday: "long",
        
    
    }
    
    // let day = today.toLocaleDateString("en-us", options);
    // return day;
    return today.toLocaleDateString("en-us",options);
    
    }