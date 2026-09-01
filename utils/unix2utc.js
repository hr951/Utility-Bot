const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function numbering(number) {
    let result;
    let s1 = +('' + number).slice(-1);
    let s2 = +('' + number).slice(-2);
    if (s2 >= 11 && s2 <= 13) {
        result = number + 'th';
    } else if (s1 === 1) {
        result = number + 'st';
    } else if (s1 === 2) {
        result = number + 'nd';
    } else if (s1 === 3) {
        result = number + 'rd';
    } else {
        result = number + 'th';
    }
    return result;
}

function unixToUTC(timestamp) {
    let date = new Date(timestamp * 1000);
    let day;
    let hours;

    if (date.getUTCHours() < 12) {
        day = "am";
        hours = date.getUTCHours();
    } else {
        day = "pm";
        hours = date.getUTCHours() - 12;
    }

    return {
        date: `${numbering(date.getUTCDate())} ${month[date.getMonth()]} ${date.getFullYear()}`,
        time: `${hours}:${("0" + date.getUTCMinutes()).slice(-2)} ${day} UTC`
    };
}

module.exports = {
    unixToUTC
}