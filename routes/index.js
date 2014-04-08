
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home',StoreId:res.app.locals.store });
};
exports.product = function(req, res){
  res.render('index', { title: 'Product',StoreId:res.app.locals.store });
};
exports.product_any = function(req, res){
  res.render('index', { title: 'Product Detail',StoreId:res.app.locals.store });
};
exports.product_detail = function(req, res){
  res.render('index', { title: 'Product Detail',StoreId:res.app.locals.store });
};
exports.collection_list = function(req, res){
  res.render('index', { title: 'Collection List',StoreId:res.app.locals.store });
};
exports.collection = function(req, res){
  res.render('index', { title: 'Collection',StoreId:res.app.locals.store });
};
exports.page = function(req, res){
  res.render('index', { title: 'Page',StoreId:res.app.locals.store });
};
exports.search_page = function(req, res){
  res.render('index', { title: 'Search',StoreId:res.app.locals.store });
};
exports.cart = function(req, res){
  res.render('index', { title: 'Cart',StoreId:res.app.locals.store });
};
exports.login = function(req, res){
  res.render('index', { title: 'Login',StoreId:res.app.locals.store });
};
exports.signup = function(req, res){
  res.render('index', { title: 'Signup',StoreId:res.app.locals.store });
};

exports.account = function(req, res){
  res.render('index', { title: 'Account',StoreId:res.app.locals.store });
};
exports.checkout = function(req, res){
  res.render('index', { title: 'Checkout',StoreId:res.app.locals.store });
};
exports.confirm_screen = function(req, res){
  res.render('index', { title: 'Confirm',StoreId:res.app.locals.store });
};
exports.thankyou = function(req, res){
  res.render('index', { title: 'Thankyou',StoreId:res.app.locals.store });
};
exports.notFound = function(req, res){
  res.render('index', { title: 'Not Founds',StoreId:res.app.locals.store });
};




