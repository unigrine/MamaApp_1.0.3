export const regexPhone = (num) => {
    if (num.length === 11) {
        return /(\d{3})(\d{4})(\d{4})/.test(num);
    }
    else if (num.length === 8) {
        return /(\d{4})(\d{4})/.test(num);
    }
    else {
        if (num.indexOf('02') === 0) {
            return /(\d{2})(\d{4})(\d{4})/.test(num);
        }
        else {
            return /(\d{3})(\d{3})(\d{4})/.test(num);
        }
    }
}

export const regexMobilePhone = (num) => {
    let regex = /^(01[0, 1, 6]{1})([0-9]{3,4})([0-9]{4})$/
    return regex.test(num)
}


export function isEmptyCheck(value) {
    if (value === 0) {
        return false;
    }
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};

export function regexNumber(value) {
    return /^[-+]?\d+(:?[.]\d+)?$/.test(value);
}

export function regexEmail(email) {
    let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    return regex.test(email)
}
