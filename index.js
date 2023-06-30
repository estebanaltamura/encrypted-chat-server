const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  // Obtener la URL y el método de la solicitud
  const { url, method } = req;

  // Endpoint '/api/saludo' con método GET
  if (url === '/api/saludo' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('¡Hola, mundo!');
  }

  // Endpoint '/api/usuario' con método POST
  if (url === '/api/usuario' && method === 'POST') {
    let data = '';

    // Escuchar el evento 'data' para obtener los datos del cuerpo de la solicitud
    req.on('data', chunk => {
      data += chunk;
    });

    // Escuchar el evento 'end' para procesar los datos recibidos y enviar una respuesta
    req.on('end', () => {
      const { nombre, email } = JSON.parse(data);

      // Realizar alguna acción con los datos recibidos

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mensaje: 'Usuario creado exitosamente' }));
    });
  }

  // Endpoint no encontrado
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Endpoint no encontrado');
});

// Iniciar el servidor en el puerto 4000
server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});





// // Crea un nuevo servidor WebSocket en el puerto deseado
// const wss = new WebSocket.Server({ port: 3000 });

// const users = {}
// console.log(users)

// // Evento que se dispara cuando se establece una conexión WebSocket
// wss.on('connection', function connection(ws) {

//   let userName = null
//   let nickName = null

//   // Evento que se dispara cuando se recibe un mensaje del cliente
//   console.log("conexion establecida entre cliente servidor")
  
//   ws.on('message', function incoming(message) {
    
//     const messageParsed = JSON.parse(message)

//     //console.log("mensaje recibido", messageParsed)

//     //peticion de creacion de usuario
//     if(messageParsed.hasOwnProperty("createUserData")){
//       userName = messageParsed.createUserData.publicKey 
//       nickName = messageParsed.createUserData.nickName

//       if(users.hasOwnProperty(userName)){
//         ws.send("usuario existente, cerrando conexion...")        
//         ws.close()
//       }
//       else{
//         messageParsed.createUserData.connection = ws
//         const {publicKey, ...rest} = messageParsed.createUserData
//         users[userName] = rest

//         ws.send(JSON.stringify({"userCreated": "userCreated"}))        
//         console.log("users actualizado: ", users)
//       }
//     } 
        
    
//     if(messageParsed.hasOwnProperty("tryPairing")){      
//       const user2 = messageParsed.tryPairing.publicKeyUser2      

//       if(userName === user2){
//         const requestMessage = JSON.stringify({"error": "errorUserIsTheSame"})
//         users[userName] !== undefined && users[userName].connection.send(requestMessage)   
//       }
      
//       // else if(!users.hasOwnProperty(user2)){        
//       //   const requestMessage = JSON.stringify({"error": "errorUserDoesntExistOrReject"})        
        
//       //   const timeOut = setTimeout(()=>{
//       //     users[userName] !== undefined && users[userName].connection.send(requestMessage)
//       //     clearTimeout(timeOut)
//       //   },30000)        
//       // }
      
//       else if(users.hasOwnProperty(user2)){        
//         const requestMessage = JSON.stringify({"requestConnection": {"userName": userName, "nickName": nickName}})
//         users[userName].requestStatus = "requestSent"
//         users[user2].requestStatus    = "requestReceived"
//         users[user2].connection.send(requestMessage) 
//         console.log("solicitud enviada", users)        
//       }          
//     }    
    

//     if(messageParsed.hasOwnProperty("cancelRequestSent")){
//       const user1 = messageParsed.cancelRequestSent.user1
//       const user2 = messageParsed.cancelRequestSent.user2

//       console.log(user1, user2)
//       users[user1].requestStatus = null
      
//       if(users[user2]?.requestStatus !== undefined){
//         users[user2].requestStatus = null
//         users[user2].connection.send(JSON.stringify({"error":"canceledRequest"}))
//       } 
      
//       console.log("solicitud cancelada", users[user1]?.requestStatus, users[user2]?.requestStatus)  
//     }



//     if(messageParsed.hasOwnProperty("confirmedRequest")){

//       //Aca agrega que se ejecute el codigo si el otro tiene requestStatus "requestSent"           
//       const user1 = messageParsed.confirmedRequest.user1
//       const user2 = messageParsed.confirmedRequest.user2
      
//       if(users[user1] !== undefined){
        
//         if(users[user1].requestStatus === "requestSent" && users[user2].requestStatus === "requestReceived"){
//           users[user1].requestStatus = null
//           users[user2].requestStatus = null             
          
//           users[user1].to = user2
//           users[user2].to = user1         
          
//           const requestMessageUser1 = JSON.stringify({"chatConfirmed": {"to": user2, "toNickName": users[user2].nickName}})
//           const requestMessageUser2 = JSON.stringify({"chatConfirmed": {"to": user1, "toNickName": users[user1].nickName}})
//           users[user1].connection.send(requestMessageUser1) 
//           users[user2].connection.send(requestMessageUser2) 
          
//           console.log("solicitud confirmada", users[user1]?.requestStatus, users[user2]?.requestStatus)   
//         }      
//       }  

//       else{
//         const requesterIsOfflineMessage = JSON.stringify({"error": "requesterIsOffline"})
//         users[user2].connection.send(requesterIsOfflineMessage) 
//         console.log("requester is offline", users[user1]?.requestStatus, users[user2]?.requestStatus)  
//       }    
//     }


//     if(messageParsed.hasOwnProperty("rejectedRequest")){
//       const user1 = messageParsed.rejectedRequest.user1
//       const user2 = messageParsed.rejectedRequest.user2
      
//       users[user2].requestStatus = null    
         
      
      
//       if(users[user1] !== undefined){
//         users[user1].requestStatus = null
//         const requestMessageUser = JSON.stringify({"error": "errorUserDoesntExistOrReject"})
//         users[user1].connection.send(requestMessageUser) 
//       }          

//       console.log("solicitud rechazada", users[user1]?.requestStatus, users[user2]?.requestStatus) 
//     }

 
//     if(messageParsed.hasOwnProperty("sendMessage")){
//       const {from, to, message} = messageParsed.sendMessage      
//       const messageToSend = JSON.stringify({"sentMessaje": {"from": from, "to": to, "message": message} })
//       users[to].connection.send(messageToSend)        
//     }
       
//   });

//   // Evento que se dispara cuando se cierra la conexión WebSocket
//   ws.on('close', function close(e) {
//     console.log(e)
//     // si existe el usuario lo borra
//     const userToDelete = users[userName]
    
//     if(userToDelete !== undefined){
//       delete users[userName]
//       console.log("usuario borrado", userName)    
//       const toPropertyOfUserToDelete = userToDelete.to 
//       users[toPropertyOfUserToDelete]?.connection.send(JSON.stringify({"closing": "otherUserHasClosed"}))      
//     } 
//   });

//   ws.on('error', function error(e) {
    
//     console.log(e)
//   });
// });