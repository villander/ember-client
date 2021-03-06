import Ember from 'ember';
import CryptoJS from 'npm:crypto-js';

export default Ember.Service.extend({

		generateDigest(login, password, requestMethod, authResponseHeader) {
			var responseObject = this.parseDigestValues(authResponseHeader);

			var qop = ("qop" in responseObject) ? (responseObject.qop === "auth,auth-int" || responseObject.qop === "auth-int,auth") ?
			        "auth-int" : responseObject.qop : "default";
	                
	        // Nonce Count - incremented by the client.
	        var nc = "00000001";

	        // Generate a client nonce value for auth-int protection.
	        var cnonce = CryptoJS.MD5(Math.random().toString()).toString();
	        
	        var uri = "";
	        var digest = "Digest " + "username=\"" + login /* Username we are using to gain access. */ + 
	            "\", " + "realm=\"" + responseObject.realm /* Same value we got from the server.    */ + 
	            "\", " + "nonce=\"" + responseObject.nonce /* Same value we got from the server.    */ + 
	            "\", " + "uri=\"" + uri /* URI that we are attempting to access. */ + "\", " + 
	            "qop=" + qop /* QOP as decided upon above.            */ + 
	            ", " + "nc=" + nc /* Nonce Count as decided upon above.    */ + ", " + 
	            "cnonce=\"" + cnonce /* Client generated nonce value.         */ + "\", " + 
	            "response=\"" + this.generateResponse(login, password, requestMethod, responseObject, qop, nc, cnonce, uri) +  /* Generate a hashed response based on HTTP Digest specifications. */ 
	            "\", " + "opaque=\"" + responseObject.opaque /* Same value we got from the server.    */ + "\"";
	        
	        return digest;
		},

		parseDigestValues(authHeader) {
			var obj = {};
			var digestString = authHeader;
			var digestArray = [];
			var i;

			// First, remove "Digest " from the begining of the string.
			digestArray = digestString.split(" ");
			digestArray.shift();

			// Join the remaining elements back together.
			digestString = digestArray.join(" ");

			// Next, split on ", " to get strings of key="value" pairs.
			digestArray = digestString.split(/,\s+/);

			// Finally, we break each item in the array on "="
			for (i = 0; i < digestArray.length; i++) {
			    var item = digestArray[i].split("=");
			    item[1] = item[1].replace(/"/g, '');
			    obj[item[0]] = item[1];
			}

			return obj;
		},
	    
	    generateResponse(login, password, requestMethod, responseObject, qop, nc, cnonce, uri) {
	        var hash;
	        var HA1;
	        var HA2;
	        
	        HA1 = CryptoJS.MD5(login + ":" + responseObject.realm + ":" + password).toString();
	        HA2 = CryptoJS.MD5(requestMethod + ":" + uri).toString();
	        hash = CryptoJS.MD5(HA1 + ":" + responseObject.nonce + ":" + nc + ":" + cnonce + ":" + qop + ":" + HA2).toString();
	        return hash;
	    }
});
