const APIURL = "http://localhost:8080/API";

async function getAllProducts() {
    const url = APIURL + "/products/";
    const response = await fetch(url);
    const res = await response.json()
    if (response.status === 200) {
        return res
    } else {
        throw res
    }
}

async function getProductById(id) {
    const url = APIURL + "/products/" + id;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const res = await response.json()
    if (response.status === 200) {
        return res
    } else {
        throw res
    }

}

async function getProfileByEmail(email) {
    const url = APIURL + "/profiles/" + email;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const res = await response.json()
    if (response.status === 200) {
        return res
    } else {
        throw res
    }
}

async function addProfile(profile) {
    const url = APIURL + "/profiles";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
    })
    const res = await response.json()
    if (response.status === 201) {
        return res
    } else {
        throw res
    }
}

async function updateProfile(profile) {
    const url = APIURL + "/profiles/" + profile.email;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
    })
    const res = await response.json()
    if (response.status === 200) {
        return res
    } else {
        throw res
    }
}

const API = {
    getAllProducts, getProductById, getProfileByEmail, addProfile, updateProfile
};

export default API;