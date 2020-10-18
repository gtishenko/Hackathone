import axios from 'axios';
 
const API_URL = 'https://manaenckov.design/api/vkhApp/';
 
axios.defaults.headers.common['x-vk'] = window.location.href;
 
export default class API {
    async send(url, method = 'GET', action, data = {}) {
        const response = await axios({
            method,
            url: `${url}${action}`,
            data
        }).catch(error => {
            console.error("Error API:", error);
        });
        return response ? response.data : [];
    }

    async LeaveAdmin() {
        const response = await this.send(API_URL, "GET", "LeaveAdmin", null);
        console.log("API: ", "LeaveAdmin ", response);
 
        return response;
    }

    async GetHouseUsers() {
        const response = await this.send(API_URL, "GET", "GetHouseUsers", null);
        console.log("API: ", "GetHouseUsers ", response);
 
        return response;
    }

    async StartElections() {
        const response = await this.send(API_URL, "GET", "StartElections", null);
        console.log("API: ", "StartElections ", response);
 
        return response;
    }

    async CreateChat(data) {
        const response = await this.send(API_URL, "POST", "CreateChat", data);
        console.log("API: ", "CreateChat ", response);
 
        return response;
    }

    async GetChats() {
        const response = await this.send(API_URL, "GET", "GetChats", null);
        console.log("API: ", "GetChats ", response);
 
        return response;
    }

    async SetSettings(data) {
        const response = await this.send(API_URL, "POST", "SetSettings", data);
        console.log("API: ", "SetSettings ", response);
 
        return response;
    }

    async GetAddress(data) {
        const response = await this.send(API_URL, "GET", "GetAddress?q=" + data, null);
        console.log("API: ", "GetAddress ", response);
 
        return response;
    }

    async GetCities(data) {
        const response = await this.send(API_URL, "POST", "GetCities", data);
        console.log("API: ", "GetCities ", response);
 
        return response;
    }
 
    async GetUser() {
        const response = await this.send(API_URL, "GET", "GetUser", null);
        console.log("API: ", "GetUser ", response);
 
        return response;
    }
 
    async Catch() {
        const response = await this.send(API_URL, "GET", "Catch", null);
        console.log("API: ", "Catch ", response);
 
        return response;
    }
 
    async GetJournal() {
        const response = await this.send(API_URL, "GET", "Journal", null);
        console.log("API: ", "GetJournal", response);
 
        return response;
    }
 
    async GetWeapons() {
        const response = await this.send(API_URL, "GET", "GetWeapons", null);
        console.log("API: ", "GetWeapons", response);
 
        return response;
    }
 
    async GetBoards() {
        const response = await this.send(API_URL, "GET", "GetBoards", null);
        console.log("API: ", "GetBoards", response);
 
        return response;
    }
 
    async GetLocations() {
        const response = await this.send(API_URL, "GET", "GetLocations", null);
        console.log("API: ", "GetLocations", response);
 
        return response;
    }
 
    async GetCheeses() {
        const response = await this.send(API_URL, "GET", "GetCheeses", null);
        console.log("API: ", "GetCheeses", response);
 
        return response;
    }
 
    async ChangeWeapons(data) {
        const response = await this.send(API_URL, "POST", "ChangeWeapons", data);
        console.log("API: ", "ChangeWeapons", response);
 
        return response;
    }
 
    async ChangeLocations(data) {
        const response = await this.send(API_URL, "POST", "ChangeLocations", data);
        console.log("API: ", "ChangeLocations", response);
 
        return response;
    }
 
    async SimplePost(data) {
        const response = await this.send(API_URL, "POST", "post", data);
        console.log("API: ", "SimplePost", response);
 
        return response;
    }
}