
let rp = require('request-promise');
let hb = require("handlebars");
let mjml = require("mjml");
let mailService = require("../../common/mail.js");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => beforeInsertRequestQuote(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_get_email_template(hook) 
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function beforeInsertRequestQuote(hook){
      hook.data.created_at = new Date();
      hook.data.deleted_at = '';
}

async function before_get_email_template(hook){
  if(hook.data.id != undefined){
    let response = await hook.app.service("email-template").find({query: { slug: 'request-quote' }});

    let data = hook.result;
    let userEmail = data.user_info.email;
    //let userEmail = 'divyesh2589@gmail.com';
    let mjmlsrc =  response.data[0].template_content;
    let subject =  response.data[0].subject;
    let fromEmail =  response.data[0].from;
    //let fromEmail =  'obsoftcare@gmail.com';

    hb.registerHelper("math", function(lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
          "+": lvalue + rvalue
      }[operator];
    });
    let template = hb.compile(mjmlsrc);
    let mjmlresult = template({ data: data });
    //console.log('mjmlresult', mjmlresult);
    let htmlOutput = mjml.mjml2html(mjmlresult).html;
    let messageId = await mailService.mailSend(userEmail,fromEmail,subject,htmlOutput);
  }
}
