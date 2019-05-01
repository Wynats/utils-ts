import * as fs from 'fs';

type encoding = 'latin1' | 'utf8';
const urlOrigin =  './src/assets/example.properties';
const urlDestiny =  './dist/properties.json';
const encoding: encoding =  'latin1';

fs.readFile( urlOrigin, {encoding}, ( error: any, data: string ) => {
  let reply: object;
    if (error ) {
    	return console.log(`Error: ${error}`);
		}
    reply = converToJson( data );
    createFile (reply);
})

function createFile( data: object) {
  fs.open( urlDestiny,'w',(error) => {
    if ( error ) {
    	return console.log(`Error: ${error}`);
    }
    fs.writeFile( urlDestiny, JSON.stringify(data), function(err) {
      if( err ) {
        return console.log(`Error: ${error}`);
      }
    });
  });
}


/**
 * Create the final object with all properties
 * @name converToJson
 * @param data string - all properties as string
 *
 */
function converToJson( data: string ): object {
  let reply: any = {};
  const list: Array<string> = data.split('\r\n');
  for( let i = 0; i < list.length; i++ ){
    if( list[i] !== '' ) {
      const keys: Array<string>= list[i].split('=')[0].split('.');
      const value: string = contacValue(list[i]);
      if ( reply[keys[0]] ){
        reply[keys[0]] = {...reply[keys[0]],...createObject(keys, value, 1,reply[keys[0]])}
      } else {
        reply[keys[0]] = {...createObject(keys, value, 1)};
      }
    }
  }
  return reply;
}


/**
 * Create the object with all properties
 * @name createObject
 * @param keys Array<string> - Array with keys of properties.
 * @param value string - Value of properties.
 * @param position number - Current position of array.
 * @param general any (optional) - Object to refresh.
 *
 */
function createObject (keys: Array<string>, value: string, position: number, general?: any): object {
  let reply: any = {};

  if( position === keys.length-1 ){    
    if (isValid(general,keys[position],true)) {         
      reply[keys[position]] = value;
    } else {
      throw new Error('Bad format properties');
    }   
    return reply;
  } else {
    if ( general && general[keys[position]] ){
      const obj = general[keys[position]];      
      if(isValid(obj,keys[position],false)) {        
        reply[keys[position]] = {...general[keys[position]],...createObject(keys, value, ++position, obj)};
      } else {
        throw new Error('Bad format properties');
      }
      
    } else {
      reply[keys[position]] = {...createObject(keys, value, ++position)};
    }
    return reply;
  }
}

/**
 * Join the value
 * @name contacValue 
 * @param list string - Value of properties. 
 *
 */
function contacValue (list: string): string {
  let value: string = list.split('=')[1];
  if(list.split('=').length > 2) {
    for(let i=2;i<list.split('=').length;i++) {
      value += '=' + list.split('=')[i];
    }
  }
  return value;
}

function isValid(value: any,key: string,final?: boolean){
  let reply = true; 
  if(typeof value === 'string') {    
    reply = false;   
  } else if (typeof value === 'object' && final && Object.keys(value).indexOf(key) > -1) {   
    reply = false;    
  }
  return reply;
}
