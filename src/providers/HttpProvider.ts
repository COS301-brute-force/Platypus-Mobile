import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

// API server URL
const IP = 'http://dev.api.split-bill.co.za';
//const PORT = ':3000';
const URL = IP+'/mobile';
const HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'};


// API server URL
/* const IP = 'http://10.0.0.11';
const PORT = ':3000';
const URL = IP+PORT+'/mobile';
const HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'}; */

@Injectable()
export class HttpProvider {

  fileTransfer: FileTransferObject;

  constructor(private http: HTTP, private transfer: FileTransfer, private file: File) {
    console.log("Http Provider Instantiated");
    this.fileTransfer = this.transfer.create();
  }

  /**
  * Request te API to create a new session
  * @param  {String}  nickname  The nickname of the session owner
  * @param  {String}  color     The color chosen by the owner
  * @return {String}            The JSON string containing a session_id and user_id
  */
  createSession(results) {

    var nickname = results[0];
    var color = results[1];

    console.log("Sending Data...");
    let data = {"nickname": nickname, "color": color.toLowerCase()};
    let url = URL+"/createSession";
    let responseJSON = this.http.post(url, data, HEADERS);
    console.log("Returing response...");
    return responseJSON;
  }

  /**
  * Send a request to the API to join a session with the specified ID
  * @param  {Integer}  session_id The session id of the session to join
  * @return {String}              A JSON string containing a new user_id for the joining client
  */
  joinSession(session_id, nickname, color) {

    // Set HTTP request parameters
    let data = {"session_id": session_id.toLowerCase(), "nickname": nickname, "color": color.toLowerCase()};
    let url = URL+"/joinSession";

    console.log("Sending join session data to API server: "+session_id)
    let responseJSON = this.http.post(url, data, HEADERS);
    console.log("Returing response...");
    return responseJSON;
  }

  /**
   * Sends an image to the API for OCR processing
   * @param  {String} imageData base64 image captured by user
   * @return {String}           JSON string containing the reciept items and their values
   */
  sendSessionImage(imageData, session_id) {

    console.log("SendSessionImage entered");

    let extension = ".jpg";
    let filename = session_id+extension;
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: filename,
      mimeType: 'image/jpg',
      chunkedMode: false,
      params: { "session_id":session_id.toLowerCase() }
    };
    let url = URL+"/sendImage";
    console.log("Sending image data to "+URL+" server");
    return this.fileTransfer.upload(imageData, url, options);
  }

  getAllSessionData(session_id) {
    let url = URL+"/getItems";
    let data = {"session_id": session_id.toLowerCase()};
    let responseJSON = this.http.post(url, data, HEADERS);
    console.log("Returing response...");
    return responseJSON;
  }

  getAllUsers(session_id) {
    let url = URL+"/getUsers";
    let data = {"session_id": session_id.toLowerCase()};
    let responseJSON = this.http.post(url, data, HEADERS);
    console.log("Returing response...");
    return responseJSON;
  }

  validateSessionData(session_id, user_id) {
    let url = URL+"/validateSessionData";
    let data = {"session_id": session_id.toLowerCase(), "user_id": user_id.toLowerCase()};
    let response = this.http.post(url, data, HEADERS);
    console.log("Returing validation response...");
    return response;
  }

  getSessionOwner(session_id) {
    let url = URL+"/getOwner";
    let data = {"session_id": session_id.toLowerCase()};
    let response = this.http.post(url, data, HEADERS);
    console.log("Returing owner response...");
    return response;
  }

}
