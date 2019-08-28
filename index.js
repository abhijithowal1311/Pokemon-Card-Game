var app= require('express')();
var server = require('http').Server(app);
var io= require('socket.io')(server);
server.listen(3000);

app.get('/',function(request,response){
    response.sendFile(__dirname + '/index.html');
})

app.get('/game',function(request,response){
    response.sendFile(__dirname + '/game.html');
})
var clientList=0;
var channels = 0;
var arr1;
    var myarray = [{rank:1,
        name:'Bulbasaur',
        url:'https://img.pokemondb.net/artwork/bulbasaur.jpg',
        hp:45,
        weight: 9.0,
        height : 0.5
        },
        {rank:2,
            name:'IvySaur',
            url:'https://img.pokemondb.net/artwork/ivysaur.jpg',
            hp:60,
            weight: 13.0,
            height : 1
            },
            {rank:3,
                name:'Venusaur',
                url:'https://img.pokemondb.net/artwork/venusaur.jpg',
                hp:80,
                weight: 100.0,
                height : 2
                },
                {rank:4,
                    name:'Charmender',
                    url:'https://img.pokemondb.net/artwork/charmander.jpg',
                    hp:39,
                    weight: 8.5,
                    height : 0.6
                    },
        {rank:5,
            name:'Charmeleon',
            url:'https://img.pokemondb.net/artwork/charmeleon.jpg',
            hp:58,
            weight: 19.0,
            height : 1.1
            },
            {rank:6,
                name:'Charlizard',
                url:'https://img.pokemondb.net/artwork/charizard.jpg',
                hp:78,
                weight: 90.0,
                height : 1.7
                },
                {rank:7,
                    name:'Squirtle',
                    url: 'https://img.pokemondb.net/artwork/squirtle.jpg',
                    hp:44,
                    weight: 9.0,
                    height : 0.5
                    },
                    {rank:8,
                        name:'Wartortle',
                        url:'https://img.pokemondb.net/artwork/wartortle.jpg',
                        hp:59,
                        weight: 22.5,
                        height : 1.0
                        },
                        {rank:9,
                            name:'Blastoise',
                            url:'https://img.pokemondb.net/artwork/blastoise.jpg',
                            hp:79,
                            weight: 85.5,
                            height : 1.6
                            },
                            {rank:10,
                                name:'Caterpie',
                                url:'https://img.pokemondb.net/artwork/caterpie.jpg',
                                hp:45,
                                weight: 2.9,
                                height : 0.3
                                }
    ];
function room(name){
    this.name = name,
    this.clientlist=0;
}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}
io.on('connection',function(socket){
    console.log('A connection was made!');

    socket.on('join',function(name){
       io.emit('reply',socket.id);
       
    })

    socket.on('disconnect',function(){
        if(clientList == 1){
            clientList++;
        }
        console.log('damn Daniel');

    })

    socket.on('user2turnget',function(data){
        console.log(data);
        io.in(data.channel).emit('user2turn',{user:data.user,boolean: data.boolean})
    })

    socket.on('compare',function(data){
        io.in(data.channel).emit('compare',{user:data.user,property:data.property,propertystat:data.propertystat,card:data.card})
    })

    socket.on('win',function(data){
        io.in(data.channel).emit('win',{user:data.user})
    })

    socket.on('game over',function(data){
        io.in(data.channel).emit('match over',{user:data.user})
    })
    
    socket.on('lost',function(data){
        io.in(data.channel).emit('lost',{user:data.user,card:data.card})
    })
    
    socket.on('tie',function(data){
        io.in(data.channel).emit('tie',{user:data.user})
    })
    
    socket.on('new room',function(id){
        var random_boolean = Math.random() >= 0.5;
        if(clientList <2){
            if(clientList==0){
                var channelname='room no.'+channels;
                socket.join(channelname);
                console.log(id+ 'is connected to room no '+channels);
                socket.emit('current channel',channelname);
                arr1 = shuffle(myarray);
                socket.emit('get cards',arr1.slice(0,5));    
                var waitmsg = 'Please wait for another user to connect';
                socket.emit('wait',waitmsg);
                clientList++;

            }else{
                var channelname='room no.'+channels;
                socket.join(channelname);
                console.log(id+ 'is connected to room no '+channels);
                socket.emit('current channel',channelname);
                socket.emit('get cards',arr1.slice(5,10));
                
                socket.emit('pick',!random_boolean);
                io.in(channelname).emit('clear',waitmsg);
                clientList++;
                
            }
        }else{

            channels++;
            clientList=0;
            if(clientList==0){
                var channelname='room no.'+channels;
                socket.join(channelname);
                console.log(id+ 'is connected to room no '+channels);
                socket.emit('current channel',channelname);
                arr1 = shuffle(myarray);
                socket.emit('get cards',arr1.slice(0,5));    
                var waitmsg = 'Please wait for another user to connect';
                socket.emit('wait',waitmsg);
                clientList++;

            }else{
                var channelname='room no.'+channels;
                socket.join(channelname);
                console.log(id+ 'is connected to room no '+channels);
                socket.emit('current channel',channelname);
                socket.emit('get cards',arr1.slice(5,10));
                socket.emit('pick',!random_boolean);
                io.in(channelname).emit('clear',waitmsg);
                clientList++;
                
            }   
        }
     })

     socket.on('new room chat',function(msg){
         console.log(msg.room+'we got the room and'+ msg.message1);
         var msgn = msg.user + ': ' + msg.message1;
         io.in(msg.room).emit('new room',msgn);
     })
 
})