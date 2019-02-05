'use strict';

var link = $('.button-element__link'),
    btn = $('.button-element__btn'),
    ESC_KEYCODE = 27,
    ENTER_KEYCODE = 13;


//closing popup by ESC

function documentKeydownHandler() {
  $(document).keydown(function(evt) {
    if (evt.which === ESC_KEYCODE && !$(document.activeElement).is('.popup-form__input')) {
      $('.popup-overlay, .popup-login-overlay').addClass('hidden');
      $('body').removeClass('modal-open');
      $('.popup-form__input, .popup-login-form__input').val('');
      $('.popup-form__textarea').val('');
    }
  })
};


// open popup by btn

function btnClickHandler() {
  $('.popup-overlay').removeClass('hidden');
  $('body').toggleClass('modal-open');
};


// open popup by link

function linkClickHandler(evt) {
  evt.preventDefault();
  $('.popup-login-overlay').removeClass('hidden');
  $('body').toggleClass('modal-open');
}


// close popup by btn

function btnCloseClickHandler() {
  $('.popup-overlay').toggleClass('hidden');
  $('body').toggleClass('modal-open');
  $('.popup-form__input').val('');
  $('.popup-form__textarea').val('');
};

function loginBtnCloseClickHandler() {
  $('.popup-login-overlay').toggleClass('hidden');
  $('body').toggleClass('modal-open');
  $('.popup-login-form__input').val('');
};

$(document).ready(function() {

  documentKeydownHandler();

  if (link.hasClass('button-element__link--inactive')) {
    link.removeAttr('href');
  }

  link.click(linkClickHandler);
  btn.click(btnClickHandler);
  $('.login-btn-close').click(loginBtnCloseClickHandler);
  $('.btn-close').click(btnCloseClickHandler);
});
