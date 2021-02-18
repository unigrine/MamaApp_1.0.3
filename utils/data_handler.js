export const parseJson = (data) => {
    try {
        return JSON.parse(data);
    }
    catch (e) {
        return data;
    }
}

export const getJsonToString = (data) => {
    try {
        return JSON.stringify(data);
    }
    catch (e) {
        return data;
    }
}
