#### USERS:
* REGISTER: post
  * api/auth/register
  * name, email, password
      
* LOGIN: post
  * api/auth/login
  * email, password

* LOGOUT: get
  * api/auth/logout

* USER INFO: get
  * api/auth/me

* UPDATE USER: post
  * api/auth/update
  * name, email, password, age, weight, height, goal

#### PRODUCTS:
* ADD PRODUCT: post
  * api/products/add
  * name, kcal, proteins, fats, carboh, description, image

*  UPDATE PRODUCT: post
   * api/products/update
   * name, kcal, proteins, fats, carboh, description, image

#### NOTES:
* ADD NOTE: post
  * api/notes/add
  * product, mass, eatType, date

* UPDATE NOTE: post
  * api/notes/update
  * product, mass, eatType, date

* GET NOTES between DATES: get
  * api/notes/get
  * start, end

* DELETE NOTE: delete
  * api/notes/delete
  * id
  
* DELETE NOTE between DATES: delete
  * api/notes/deleteAll
  * start, end
  
