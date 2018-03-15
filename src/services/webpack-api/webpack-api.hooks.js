let shell = require('shelljs')

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_create_ms(hook)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hook => after_create_ms(hook)
    ],
    get: [],
    create: [],
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


function before_create_ms(hook) {
  hook.result = hook.data;
}

function after_create_ms(hook) {
  return new Promise((resolve, reject) => {
       shell.exec('pwd');
       shell.exec('NODE_ENV='+hook.params.query.path + ' webpack' );
       hook.result = {"data":hook.data,code:200}
      // resolve(hook);
  })
}