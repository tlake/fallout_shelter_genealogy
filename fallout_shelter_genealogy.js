Dwellers = new Mongo.Collection("dwellers");


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


if (Meteor.isClient) {

  Template.control_panel.helpers({
  });

  Template.control_panel.events({
    "click #btn_new_dweller": function (event) {
      event.preventDefault();

      $("#form_new_dweller").removeClass("hide");

      $("#btn_new_dweller").addClass("hide");
    },

    "click #btn_new_dweller_cancel": function (event) {
      event.preventDefault();

      $("#form_new_dweller").addClass("hide");

      $("#btn_new_dweller").removeClass("hide");
    },

    "change #dweller_type": function (event, template) {
      if ($(event.currentTarget).val() === "bred") {
        $(".dweller_parents").removeClass("hide");
      } else {
        $(".dweller_parents").addClass("hide");
      }
    },

    "submit #form_new_dweller": function (event, template) {
      event.preventDefault();

      form = {};

      form.type = $("#dweller_type").val();

      $.each($("#form_new_dweller").serializeArray(), function () {
        form[this.name] = this.value;
      });

      console.log(form);

      $("#dweller_information").children().each(function() {
        $(this.value = "");
      });
    },

  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
