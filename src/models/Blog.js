const { Schema, model, Types} = require('mongoose');

const BlogSchema = new Schema({
    title:{ type : String, required:true},
    content : {type: String, required: true},
    // islive는 임시 저장을 위한 변수
    islive : { type: Boolean, required: true, default : false},
    user:{type : Types.ObjectId, required: true, ref:'user'},
}, { timestamps : true}
);

const Blog = model('blog', BlogSchema);

module.exports = { Blog };
