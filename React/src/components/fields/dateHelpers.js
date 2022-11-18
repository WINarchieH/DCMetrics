// Collection of Helper Functions for Date Formatting

export const formatDate = (date) => {

    let {day, year, month} = {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};

    if (month < 10) {
        month = '0' + month;
    }
    if (String(day).length < 2) {
        day = '0' + day;
    }
        

    return [year, month, day].join('-');
}

export function inputToDate(input) {
    // YYYY-MM-DD -> DD/MM/YYYY
    if (input === '') {
        return '';
    }
    let components = input.split('-');
    return components[2] + '/' + components[1] + '/' + components[0];
};

export function dateToInput(date) {

    // DD/MM/YYYY -> YYYY-MM-DD
    if (date === '')        {
        return '';
    }

    let components = date.split('/');
    return components[2] + '-' + components[1] + '-' + components[0];
};

export function TestdateToInput(date) {

    let components = null;
        // DD/MM/YYYY -> YYYY-MM-DD
        if (date === '')  {
            return '';
        }
    
        if (date.includes('/'))
        {
             components = date.split('/');
        }
        else if (date.includes('-'))
        {
            components = date.split('-');
        }
        
        return components[2] + '-' + components[1] + '-' + components[0];
    };

export function inputToDateObj(input) {
    // YYYY-MM-DD -> dateObj
   
    if (input === null || input === '') {
        return '';
    }
    let components = input.split('-');
    return new Date(components[0], components[1] - 1, components[2]);
}

export function dateObjToInput(date) {
    // dateObj -> YYYY-MM-DD

    if (date === null || date === '') {
        return '';
    }
    let {day, year, month} = {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};

    if (month < 10) {
        month = '0' + month;
    }
    if (String(day).length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join('-');
};

export function TestdateObjToInput(date) {
  
    // dateObj -> YYYY-MM-DD
    if (date === null || date === '') {
        return '';
    }
    let {day, year, month} = {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};

    if (month < 10) {
        month = '0' + month;
    }
    if (String(day).length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join('-');
};

export function dateToDateObj(date) {
    // DD/MM/YYYY -> dateObj
    if (date === '' ) {
        return '';
    }
    
    let components = date.split('/');
    let newDate =  components[2] + '-' + components[1] + '-' + components[0];
    return new Date(newDate);
};

//returns false if start date time is bigger than end date time
export function isStartDateTimeSmallerThanEndDateTime(sDate, sTime, eDate, eTime) {
   
    // let formattedStartTime = sTime;
    // let formattedEndTime = eTime;
    // if(sTime.length == 5){
    //     formattedStartTime = sTime + ':00'
    // }
    // if(eTime.length == 5){
    //     formattedEndTime = eTime + ':00'
    // }
    // let a = new Date(sDate + ' ' + formattedStartTime);
    // let b = new Date(eDate + ' ' +  formattedEndTime);
    let a = dateToInput(sDate) + 'T' + sTime;    
    let b = dateToInput(eDate) + 'T' + eTime;
    if (a>b) {
        return false;
    }
    return true;
};


export function dateObjToDate(date) {
    // datObj -> DD/MM/YY
   
    if (date === null || date === '') {
        return '';
    }
    
    if (date === undefined)
    {
        date = new Date();
    }
    let {day, year, month} = {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};

    if (month < 10) {
        month = '0' + month;
    }
    if (String(day).length < 2) {
        day = '0' + day;
    }
    return [day,month,year].join('/');
};

export function checkValidInput(date) {
    if (date) {
        let [year, month, day] = date.split('-');
        if (day > 31 || day < 1) {
            return false;
        }
        if (year < 2000) {
            return false;
        }
        if (month > 12) {
            return false;
        }
        return true;
    }
    return false;
};

const getMinutes = (inputTime) => {
    /**
    * @param {string} inputTime - hour and minute in input type=time format (hh:mm)
    */
   if (inputTime) {
       let [hour, minutes] = inputTime.split(':');
       return parseInt(hour)*60 + parseInt(minutes);
   }
   return 0;
};

export function minuteDifference(start, end) {
    // Only compute if start and end are not null/empty
    if (start && end) {
        return getMinutes(end) - getMinutes(start);
    }
    return 0;
}