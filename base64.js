/**
 * The base64 encoding and decoding function.
 * Currently this only supports Latin1-based text, meaning foreign characters like Chinese 
 * are not supported.
 */
(function( namespace ) {
  namespace.mybid = namespace.mybid || {};
  var base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  RT.mybid.base64Encode = function( plain ){
    var i = 0, encoded = '', enc1, enc2, enc3, enc4, plain1, plain2, plain3;
    while( i < plain.length ){
      plain1 = plain.charCodeAt(i++);
      plain2 = plain.charCodeAt(i++);
      plain3 = plain.charCodeAt(i++);
      
      enc1 = plain1 >> 2;
      enc2 = (plain1 & 3) << 4 | plain2 >> 4 ;
      enc3 = (plain2 & 15) << 2 | plain3 >> 6;
      enc4 = plain3 & 63;
      
      if( isNaN(plain2) ) {
        enc3 = enc4 = 64;
      }
      else if( isNaN(plain3) ){
        enc4 = 64;
      }
      encoded += base64list[enc1]+base64list[enc2]+base64list[enc3]+base64list[enc4];
    }
    return encoded;
  };


  RT.mybid.base64Decode = function( encoded ){
    encoded = encoded.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var i = 0, plain = '', last_padding = false, second_last_padding = false, imax = encoded.length,
    enc1, enc2, enc3, enc4, b64str = '';

    if( '=' === encoded.charAt(imax-1) ){
      last_padding = true;
      if( '=' === encoded.charAt(imax-2) ){
        second_last_padding = true;
      }
      imax -=4;
    }

    while( i < imax ){
      enc1 = base64list.indexOf(encoded[i++]);
      enc2 = base64list.indexOf(encoded[i++]);
      enc3 = base64list.indexOf(encoded[i++]);
      enc4 = base64list.indexOf(encoded[i++]);

      plain += String.fromCharCode( enc1<<2 | ((enc2&48)>>4), (enc2&15)<<4 | ((enc3&60)>>2), (enc3&3)<<6 | (enc4) );
    }

    if( second_last_padding || last_padding ){
      enc1 = base64list.indexOf(encoded[i++]);
      enc2 = base64list.indexOf(encoded[i++]);
      enc3 = base64list.indexOf(encoded[i++]);

      if( second_last_padding ){
        b64str = enc1 << 18 | enc2 << 12;
        plain += String.fromCharCode( b64str >> 16 );
      }else if( last_padding ){
        b64str = enc1 << 18 | enc2 << 12 | enc3 << 6;
        plain += String.fromCharCode( b64str >> 16, (b64str>>8)&255 );
      }
    }
    return plain;
  };
})(RT);
