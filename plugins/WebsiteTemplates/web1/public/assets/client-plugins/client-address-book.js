if (user_id == null ) {
  window.location = 'login.html';
}

$(function() {
    let addressBookId = getParameterByName("id");
    // Add Contact Book
    $('form#address_book').validate({
  			rules: {
          "name":"required",
          "address_type": "required",
          "email":{
            required:true,
            email: true
          },
          "street1":"required",
          "country":"required",
          "state":"required",
          "city":"required",
          "postalcode":"required",
          "phone":{
              required:true
          }
  			},
  			messages: {
          "name":"Please enter name.",
          "address_type":"Please select address type.",
          "email":{
            required:"Please enter email",
            email: "Please enter valid email."
          },
          "street1":"Please enter address 1",
          "country":"Please select country",
          "state":"Please select state",
          "city":"Please select city",
          "postalcode":"Please enter postal code",
          "phone":{
            required:"Please enter phone"
          }
  			},
        errorElement: "li",
        errorPlacement: function(error, element) {
          error.appendTo(element.closest("div"));
          $(element).closest('div').find('ul').addClass('red')
        },
        errorLabelContainer: "#errors",
        wrapper: "ul",
        submitHandler: function(form) {
            let formObj = $(form);
            // console.log("formObj",formObj);
            if(addressBookId != null){
              methodType = "PATCH"
              url = project_settings.address_book_api_url+"/"+addressBookId;
            }else{
              methodType = "POST"
              url = project_settings.address_book_api_url;
            }
            $.ajax({
                  type: methodType,
                  url: url,
                  data: formObj.serialize()+'&user_id='+user_id+'&website_id='+website_settings['projectID']+'&websiteName='+website_settings['websiteName']+'&owner_id='+website_settings['UserID']+'&culture='+project_settings.default_culture+'&is_address=1',
                  cache: false,
                  dataType: 'json',
                  headers: {"Authorization": project_settings.product_api_token},
                  success: function(response){
                      if(response.id != undefined && response.id != '' ){
                        if(addressBookId != null){
                          showSuccessMessage("Your address is updated successfully.","addressBookList.html");
                        }else{
                          showSuccessMessage("Your address is saved successfully.","addressBookList.html");
                        }
                          return false;
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                  }
            });

        },
    });

    /* End Add Address Book */

    /* for Address type start */
   	if($('.js-address-type').val() == 'shipping'){
   		$('.js-isoffice').show();
   	}

   	$(document).on('change', '.js-address-type', function(e) {
  		if($(this).val() == 'shipping'){
  			$('.js-isoffice').show();
  			if(!$('.js-isoffice input[type="radio"]').is(':checked')){
  				$('.js-isoffice input[type="radio"]:first').prop('checked', true);
  			}
  		}else{
  			$('.js-isoffice').hide();
  		}
  	});

  	$(".custom-select").each(function () {
  	    $(this).wrap("<span class='checkout-select-wrapper'></span>");
        $(this).after("<span class='checkout-holder'></span>");
  	});

  	$(document).on('change','.custom-select', function() {
  		var selectedOption = $(this).find(":selected").text();
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").text(selectedOption);
  	});
  	$('.custom-select').trigger('change');
  	$(document).on('click','.custom-select option', function() {
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").html('<span>'+ this.innerHTML+ '</span>');
  	});

    /* for Address type end */


    /* for Listing Address Book */

    if($(".js_address_book_list").find('.account-address-block').length > 0)
    {
        showPageAjaxLoading();
        let addressBookHtml = $(".js_address_book_list").html();

        axios({
            method: 'GET',
            url: project_settings.address_book_api_url,
            headers: {'Authorization': project_settings.product_api_token},
            params: {
              "user_id":user_id,
              "is_address":'1',
              "website_id":website_settings['projectID'],
              "deleted_at": false
             }
          })
        .then(async response => {
            if(response.data != undefined  && response.data.total > 0){
              // console.log("response.data=>>>",response.data);
              // return false;
                let generateHtml =   await generateHtmlFunc(response.data.data , addressBookHtml) ;
                $(".js_address_book_list").html(generateHtml);
                $('.js-hide-div').removeClass("js-hide-div");
            }else{
                $(".js_address_book_list").html('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><h1 class="main-title">Address not available</h1></div>');
                $('.js-hide-div').removeClass("js-hide-div");
            }
            hidePageAjaxLoading();
        })
        .catch(error => {
          hidePageAjaxLoading();          
          // console.log('Error fetching and parsing data', error);
        });

        // set default address in address book
        $(document).on("click",".js_address_type a",function(){
            let addressBookId = $(this).data('id');
            if($(this).attr('class') == "address-active"){
              showErrorMessage("This is already default address.");
              return false;
            }
            axios({
              method: 'PATCH',
              url: project_settings.address_book_api_url+'/'+addressBookId,
              headers: {'Authorization': project_settings.product_api_token},
              data: {"is_default": '1'}
            }).then(function(response) {
                if(response.data != undefined){
                   showSuccessMessage("Default Address is Updated Successfully","addressBookList.html");
                   return false
                }
            });

        });

        // Start addressBook Soft Delete
        $(document).on("click",".js_delete_address",function(){
            let addressBookId = $(this).data('id');
            axios({
              method: 'PATCH',
              url: project_settings.address_book_api_url+'/'+addressBookId,
              headers: {'Authorization': project_settings.product_api_token},
              data: {"deleted_at": true}
            }).then(function(response) {
                if(response.data != undefined){
                   showSuccessMessage("Address is deleted successfully.","addressBookList.html");
                   return false
                }
            });
        })

    }
    /* for Address Book list end */


    if(addressBookId == null){
      getCountryData()
    }

    /*  On change Country get state and city data from database */
    if( $('.js-country') &&  $('.js-state')){
      $(".js-country").on("change",async function(){
          let form = $(this).closest('form');
          let countryVal = form.find('.js-country').val();
          form.find('.js-state').val('');
          // var data = {};
	        // data['country_id'] = countryVal;
	        // data['data_from'] = 'country_code';
          // data['type'] = 2;

          form.find('.js-state').before('<div class="loadinggif"></div>');

          // axios({
          //     method: 'GET',
          //     url: project_settings.city_country_state_api,
          //     headers: {'Authorization': project_settings.product_api_token},
          //     params: data
          //   })
          // .then(response => {
          //      first = form.find('.js-state option:first');
          //      form.find('.js-state').html("");
          //      let options = form.find('.js-state');
          //      options.append(first);
          //
          //      $.each(response.data,function(key,state){
          //         options.append(new Option(state.state_name,state.id));
          //      })
          //      form.find('.js-state').change();
          //      form.find('.js-state').find("option").first().click();
          //      form.find('.js-state').prev('.loadinggif').remove();
          // })
          // .catch(error => {
          //   form.find('.js-state').prev('.loadinggif').remove();
          // });

          let response = await getStateAndCityVal(countryVal,"","country_code")
          first = form.find('.js-state option:first');
          form.find('.js-state').html("");
          let options = form.find('.js-state');
          options.append(first);

          $.each(response.data,function(key,state){
             options.append(new Option(state.state_name,state.id));
          })
          form.find('.js-state').change();
          form.find('.js-state').find("option").first().click();
          form.find('.js-state').prev('.loadinggif').remove();

      })

      $(".js-state").on("change",async function(){
          let form = $(this).closest('form');
          let countryVal = form.find('.js-country').val();
          let stateVal = form.find('.js-state').val();
          form.find('.js-city').val('');
          // var data = {};
	        // data['country_id'] = countryVal;
          // data['state_id'] = stateVal;
	        // data['data_from'] = 'state_code';
          // data['type'] = 3;

          form.find('.js-city').before('<div class="loadinggif"></div>');

          // axios({
          //     method: 'GET',
          //     url: project_settings.city_country_state_api,
          //     headers: {'Authorization': project_settings.product_api_token},
          //     params: data
          //   })
          // .then(response => {
          //      first = form.find('.js-city option:first');
          //      form.find('.js-city').html("");
          //      let options = form.find('.js-city');
          //      options.append(first);
          //      $.each(response.data,function(key,city){
          //         options.append(new Option(city.city_name,city.id));
          //      })
          //      form.find('.js-city').find("option").first().click();
          //      form.find('.js-city').prev('.loadinggif').remove();
          // })
          // .catch(error => {
          //   // console.log('Error fetching and parsing data', error);
          //   form.find('.js-city').prev('.loadinggif').remove();
          // });

          let response = await getStateAndCityVal(countryVal,stateVal,"state_code")

          first = form.find('.js-city option:first');
          form.find('.js-city').html("");
          let options = form.find('.js-city');
          options.append(first);
          $.each(response.data,function(key,city){
             options.append(new Option(city.city_name,city.id));
          })
          form.find('.js-city').find("option").first().click();
          form.find('.js-city').prev('.loadinggif').remove();
      })
    }

    /* Edit Address Book Start */
      if(addressBookId != null){
        axios({
            method: 'GET',
            url: project_settings.address_book_api_url+'/'+addressBookId,
            headers: {'Authorization': project_settings.product_api_token},
          })
        .then(response => {
            if(response.data != undefined ){
                let formObj = $('form#address_book');
                let addressBookDetail = response.data;
                $.each(addressBookDetail,function(element,value){
                    $(formObj.find('input[type="text"][name*="'+element+'"]')).val(value);
                    if(element == 'address_type'){
                      $('option:selected', 'select[name="'+element+'"]').removeAttr('selected');
                      $('select[name="'+element+'"]').find('option[value="'+value+'"]').attr("selected",true);
                      let selectedtext = $('select[name="'+element+'"] option:selected').text()
                      $(formObj.find('[name*="'+element+'"]')).parent('span').find(".checkout-holder").text(selectedtext)
                    }

                    $('input:radio[name="'+element+'"][value="'+value+'"]').prop('checked', true);
                    if($(formObj.find('[name*="'+element+'"]')).parent('span').find(".checkout-holder").text() == "Shipping"){
                      $(".js-isoffice").show()
                    }
                });
                getCountryData(response.data.country)
                getStateAndCityData(formObj,response.data.country,response.data.state,"",'country_code','js-state')
                getStateAndCityData(formObj,response.data.country,response.data.state,response.data.city,'state_code','js-city')
            }
        })
        .catch(error => {
          // console.log('Error fetching and parsing data', error);
        });
      }
    /*  Edit Address Book End */

});


async function generateHtmlFunc(req , addressBookHtml){
  var replaceAdddressBookHtml=''
  for(let [key,data] of req.entries()) {
  // $.each(req, async function(key,data){
        let addressBookHtml1 = "";
        let address = data.street1;

        if(data.street2 != undefined && data.street2 != ''){
            address += ",<br>"+data.street2;
        }
        address += ",<br>"+ await getCountryStateCityById(data.city,3);
        address += ","+await getCountryStateCityById(data.state,2);
        address += ","+data.postalcode;
        address += "<br>"+ await getCountryStateCityById(data.country,1);
        addressBookHtml1 = addressBookHtml.replace("#data.name#",data.name)
        addressBookHtml1 = addressBookHtml1.replace("#data.phone#",data.phone)
        addressBookHtml1 = addressBookHtml1.replace("#data.email#",data.email)
        addressBookHtml1 = addressBookHtml1.replace("#data.addressType#",data.address_type)
        if(data.is_default == '1'){
          addressBookHtml1 = addressBookHtml1.replace("#activeDefaultClass#","address-active")
        }else{
          addressBookHtml1 = addressBookHtml1.replace("#activeDefaultClass#","is-default")
        }
        addressBookHtml1 = addressBookHtml1.replace("#data.addressType#",data.address_type)
        addressBookHtml1 = addressBookHtml1.replace(/#data.id#/g,data.id)
        replaceAdddressBookHtml += addressBookHtml1.replace("#data.address#",address)
        // console.log("replaceAdddressBookHtml+++");
    // })
    }
    return replaceAdddressBookHtml;
}

/*  Get country Data from project_settings */
function getCountryData(countryId=0){
  if( $(".js-country").length > 0 ){
      let countryHtml = $(".js-country").html();
      let countryList = [];
      //short_name
      $.each(project_settings.country_data,function(key,country){
        countryList.push(country.short_name);
      })
      axios({
          method: 'GET',
          url: project_settings.city_country_state_api,
          headers: {'Authorization': project_settings.product_api_token},
          params: {
              'country_data':countryList,
              'data_from' : 'country_code',
              'type' : 1
          }
        })
      .then(response => {
          // console.log("response++++",response.data.length);
          if(response.data.length > 0){
            $.each(response.data,function(key,country){
              countryHtml += '<option value="'+country.id+'">'+country.country_name+'</option>'
            })
            $('.js-country').html(countryHtml)
            doSelection('country',countryId);
          }
      })
      .catch(error => {
        // console.log('Error fetching and parsing data', error);
      });
  }

}

/* Edit State and city auto generate dropdown */
async function getStateAndCityData(form,countryVal,stateVal,cityVal,dataFrom,className){
    form.find('.'+className).before('<div class="loadinggif"></div>');
    let response = await getStateAndCityVal(countryVal,stateVal,dataFrom)
    first = form.find('.'+className+' option:first');
    form.find('.'+className).html("");
    let options = form.find('.'+className);
    options.append(first);

    if(dataFrom == "country_code"){
      $.each(response.data,function(key,state){
         options.append(new Option(state.state_name,state.id));
      })
      doSelection('state',stateVal)
      form.find('.'+className).prev('.loadinggif').remove();
    }else if (dataFrom == "state_code") {
      $.each(response.data,function(key,city){
         options.append(new Option(city.city_name,city.id));
      })
      doSelection('city',cityVal)
      form.find('.'+className).prev('.loadinggif').remove();
    }
}

function doSelection(element,value)
{
  if(value > 0)
  {
    $('option:selected', 'select[name="'+element,+'"]').removeAttr('selected');
    $('select[name="'+element+'"]').find('option[value="'+value+'"]').attr("selected",true);
    let selectedtext = $('select[name="'+element+'"] option:selected').text()
    $('select[name*="'+element+'"]').parent('span').find(".checkout-holder").text(selectedtext)
  }
}
