angular.module('mdo-angular-cryptography', [])
    .provider('$crypto', function CryptoKeyProvider() {
        var cryptoKey;

        this.setCryptographyKey = function(value) {
            cryptoKey = value;
        };

        this.$get = [function(){
            return {
                getCryptoKey: function() {
                    return cryptoKey
                },

                encrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.encrypt(message, key ).toString();
                },

                decrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }

                    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8)
                },

                base64url: function(source) {
                  // Encode in classical base64
                  encodedSource = CryptoJS.enc.Base64.stringify(source);

                  // Remove padding equal characters
                  encodedSource = encodedSource.replace(/=+$/, '');

                  // Replace characters according to base64url specifications
                  encodedSource = encodedSource.replace(/\+/g, '-');
                  encodedSource = encodedSource.replace(/\//g, '_');

                  return encodedSource;
                },

                parseData: function(data) {
                    return CryptoJS.enc.Utf8.parse(JSON.stringify(data));
                },

                encryptHMA: function(token, secret) {
                    return CryptoJS.HmacSHA256(token, secret);
                }
            }
        }];
    });