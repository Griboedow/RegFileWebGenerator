function createRegFile(keyName, keyType, keyPath, KeyValue, keyDescription = ''){
    var targetText = 'Windows Registry Editor Version 5.00\r\n\r\n';
    targetText += '[' + keyPath + ']' + '\r\n';
    targetText += ';' + keyDescription.replace(/(\r\n\t|\n|\r\t)/gm,"") + '\r\n' ;
    
    switch(keyType){
        case 'reg_sz':
            targetText += "\"" + keyName + '"=' + "\"" + KeyValue + "\"";
            break;
        case 'dword':
            targetText += "\"" + keyName + '"=' + keyType + ':' + decimalToHexString(parseInt(KeyValue, 10));
            break;
        case 'qword':
            targetText += "\"" + keyName + '"=' + "hex(b):" + formatQwordByteString(decimalToHexString(parseInt(KeyValue, 10)));
            break;
        case 'reg_multi_sz':
            targetText += "\"" + keyName + '"=' + "hex(7):" + encodeRegMultiSz(KeyValue, keyType) ;
            break;
        case 'reg_expand_sz':
            targetText += "\"" + keyName + '"=' + "hex(2):" + encodeRegMultiSz(KeyValue, keyType) ;
            break;
        case 'reg_binary':
            targetText += "\"" + keyName + '"=' + "hex:" + encodeRegMultiSz(KeyValue, keyType) ;
            break;
        default:
            targetText = "\"" + keyName + '"=' + keyType + ':' + KeyValue ;
            break;
    }
    var a_fake = window.document.createElement('a');
    a_fake.href = window.URL.createObjectURL(new Blob([targetText], {type: 'text/csv'}));
    a_fake.download = '' + keyName + '=' + KeyValue.replace(/[^a-zA-Z0-9]/g,'_') + '.reg';
    
    // Append anchor to body.
    document.body.appendChild(a_fake);
    a_fake.click();
    // Remove anchor from body
    document.body.removeChild(a_fake);
}

function encodeRegMultiSz(input, keyType) {
        var codePoint;
		var length = input.length;
		var index = -1;
        var result = '';
        while (++index < length) {
            codePoint = input.charCodeAt(index);
			
			if (input[index] === ';' && keyType === "reg_multi_sz" && index !== length-1){
				result += "00,00,";
			}else{
				result += (codePoint<16?'0':'') + codePoint.toString(16) + ",00,";
			}
        }
        if(keyType === "reg_multi_sz"){
        	result += "00,00,00,00"
        }        
        if(keyType === "reg_expand_sz"){
        	result += "00,00"
        }
        return result
};

function decimalToHexString(number){
	if (number < 0){
		number = 0xFFFFFFFF + number + 1;
	}
	return number.toString(16).toUpperCase();
}

function formatQwordByteString(hexString){
	resultString = "";
	
	if(hexString.length % 2 === 1){
		resultString = hexString.substring(0, 1);
		hexString = hexString.substring(1, hexString.length);
	}
	
	while (hexString.length >= 2) {
		if(resultString.length > 0){
			resultString = hexString.substring(0, 2) + ',' + resultString;
		} else{
			resultString = hexString.substring(0, 2);
		}
	    hexString = hexString.substring(2, hexString.length);
	}
	
	while (resultString.length < 21){
	  resultString = resultString + ",00";
	}
	return resultString;
}
