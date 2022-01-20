const {Schema, model} = require('mongoose');


//schema를 통해서 user에 어떤 형식으로 되어있는지를 담아서 mongoose가 확인을 해준다.
//확인 후에 mongodb에 저장을 해준다.

// Schema는 두 가지의 인자를 담는다.
// 첫번째는 위에서 말했듯이 형식을 담고
// 두번째는 option을 담는다.
// timestapmps는 업데이트 시간을 측정해준다.
const UserSchema = new Schema({
    username : {type : String, required: true, unique : true},
    name :{
        first:{type : String, required: true},
        last : {type : String, required: true}
    },
    age : Number,
    email: String
},{ timestamps : true})

// 위에서 Schema를 만들었고
// 이것을 mongoose에게 알려줘야 된다.
// 'user'라는 collection을 만들것이다. 형식은 UserSchema
const User = model('user', UserSchema);

// 외부에다가 가져다가 쓰기 위한 
module.exports = {User}