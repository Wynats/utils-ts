import * as fs from 'fs';

fs.readFile( './src/assets/example.properties', {encoding:'latin1'}, ( error: any, data: string ) => {
  let reply: object;
    if (error ) {
    	return console.log('Error');
		}
    reply = converToJson( data );
    createFile (reply);
})

function createFile( data: object) {
  fs.open('./dist/properties.json','w',(error) => {
    if ( error ) {
    	return console.log('Error');
    }
    fs.writeFile("./dist/properties.json", JSON.stringify(data), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
}

function converToJson( data: string ): object {
  let reply: any = {};
  const list: Array<string> = data.split("\r\n");
  for(let i = 0; i < list.length; i++){
    if(list[i] !== '') {
      const keys: Array<string>= list[i].split('=')[0].split('.');
      const value: string = list[i].split('=')[1];
      if ( reply[keys[0]] ){
        reply[keys[0]] = Object.assign(reply[keys[0]],createObject(keys, value, 1,reply[keys[0]]));
      } else {
        reply[keys[0]] = {};
        reply[keys[0]] = createObject(keys, value, 1);
      }
    }
  }
  console.log(reply)
  return reply;
}

function createObject (keys: Array<string>, value: string, position: number, general?: any) {
  let reply: any = {};

  if(position === keys.length-1){
    reply[keys[position]] = value;
    return reply;
  } else {
    if ( general && general[keys[position]] ){
      const obj = general[keys[position]];
      reply[keys[position]] = general[keys[position]];
      reply[keys[position]] = Object.assign(reply[keys[position]],createObject(keys, value, ++position, obj));
    } else {
      reply[keys[position]] = {};
      reply[keys[position]] = createObject(keys, value, ++position);
    }

    return reply;
  }
}
