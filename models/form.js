var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;


var formSchema = new Schema({
  formTitle: {
    type: String,
    required: true
  },
  formDescription: {
    type: String,
    required: true
  },
  questions: [
    {
      questionTitle: String,
      questionDescription: String,
      questionType: String,
      options: [ String ],
      required: String
    }
  ],
  date: { type: Date, default: Date.now }
});


formSchema.methods.getQuestions = function () {
  this.questions.forEach(function (question) {
    console.log(question);
  })
}


exports.Form = mongoose.model('Form', formSchema);