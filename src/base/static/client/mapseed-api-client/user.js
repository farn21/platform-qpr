const getUser = async apiRoot => {
    const response = await fetch(`${apiRoot}users/current?format=json`, {
        credentials: "include",
    });
    if (response.status < 200 || response.status >= 300) {
        // eslint-disable-next-line no-console
        console.error("Error: Failed to create support.", response.statusText);

        return null;
    }

    return await response.json();
};

const createNewUser = async(apiRoot, userData) => {
    var object = {};
    userData.forEach(function(value, key) {
        object[key] = value;
    });
    var json = JSON.stringify(object);
    const response = await fetch(
        `${apiRoot}users/new?format=json`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
            body: json,
        },
    );
    return await response;
}

export default {
    get: getUser,
    create: createNewUser
};