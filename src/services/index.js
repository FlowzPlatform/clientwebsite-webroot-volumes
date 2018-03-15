const flowsDirListing = require('./flows-dir-listing/flows-dir-listing.service.js');
const commitService = require('./commit-service/commit-service.service.js');
const gitlabAddRepo = require('./gitlab-add-repo/gitlab-add-repo.service.js');
const userService = require('./user-service/user-service.service.js');
const metalsmith = require('./metalsmith/metalsmith.service.js');
const imageUpload = require('./image-upload/image-upload.service.js');
const getDirectoryList = require('./get-directory-list/get-directory-list.service.js');
const shoppingCart = require('./shoppingCart/shoppingCart.service.js');
const register = require('./register/register.service.js');

const requestInfo = require('./request-info/request-info.service.js');
const publishNow = require('./publish-now/publish-now.service.js');
const projectConfiguration = require('./project-configuration/project-configuration.service.js');
const webpackApi = require('./webpack-api/webpack-api.service.js');

const addressBook = require('./address-book/address-book.service.js');
const emailSubscribers = require('./email-subscribers/email-subscribers.service.js');

const publishSurge = require('./publish-surge/publish-surge.service.js');
const copyWebsite = require('./copy-website/copy-website.service.js');

const colorTable = require('./color-table/color-table.service.js');
const cloneWebsite = require('./clone-website/clone-website.service.js');

const saveMenu = require('./save-menu/save-menu.service.js');
const changeCityStateCountry = require('./change-city-state-country/change-city-state-country.service.js');
const cityStateCountryList = require('./city-state-country-list/city-state-country-list.service.js');
const myOrders = require('./my-orders/my-orders.service.js');

const shippingEstimator = require('./shipping-estimator/shipping-estimator.service.js');

const deleteService = require('./delete-service/delete-service.service.js');

const adminOrders = require('./admin-orders/admin-orders.service.js');

const registerWebsiteSubscriptions = require('./register-website-subscriptions/register-website-subscriptions.service.js');

const websiteUsers = require('./website-users/website-users.service.js');


const metalsmithPublish = require('./metalsmith-publish/metalsmith-publish.service.js');


const deletePublishFiles = require('./delete-publish-files/delete-publish-files.service.js');
const requestQuote = require('./request-quote/request-quote.service.js');
const emailTemplate = require('./email-template/email-template.service.js');



const configdataHistory = require('./configdata-history/configdata-history.service.js');



const subscriptionWebsites = require('./subscription-websites/subscription-websites.service.js');



const branchList = require('./branch-list/branch-list.service.js');



module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(flowsDirListing);
  app.configure(commitService);
  app.configure(gitlabAddRepo);
  app.configure(userService);
  app.configure(metalsmith);

  //app.configure(transaction);
  app.configure(imageUpload);
  app.configure(getDirectoryList);
  app.configure(shoppingCart);
  app.configure(register);

  app.configure(requestInfo);
  app.configure(publishNow);
  app.configure(projectConfiguration);
  app.configure(webpackApi);
  app.configure(publishSurge);
  app.configure(copyWebsite);

  app.configure(addressBook);
  app.configure(emailSubscribers);
  app.configure(changeCityStateCountry);
  app.configure(cityStateCountryList);
  app.configure(myOrders);
  app.configure(colorTable);
  app.configure(shippingEstimator);

  app.configure(cloneWebsite);
  app.configure(saveMenu);
  app.configure(deleteService);
  app.configure(registerWebsiteSubscriptions);
  app.configure(websiteUsers);
  app.configure(adminOrders);
  app.configure(metalsmithPublish);
  app.configure(deletePublishFiles);
  app.configure(requestQuote);
  app.configure(emailTemplate);
  app.configure(configdataHistory);
  app.configure(subscriptionWebsites);
  app.configure(branchList);
};
