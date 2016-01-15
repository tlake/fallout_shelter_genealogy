Vaults = new Mongo.Collection("vaults");
Dwellers = new Mongo.Collection("dwellers");



Meteor.methods({
  add_vault: function (vault_object) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Vaults.insert(vault_object);
  },

  delete_vault: function (vault_id) {
    Vaults.remove(vault_id);
  },


  add_dweller: function (dweller_object) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Dwellers.insert(dweller_object);
  },


  delete_dweller: function (dweller_id) {
    Dwellers.remove(dweller_id);
  },
});



if (Meteor.isServer) {


  Meteor.publish("dwellers", function() {
    return Dwellers.find({owner: this.userId});
  });


  Meteor.publish("vaults", function() {
    return Vaults.find({owner: this.userId});
  });

}



if (Meteor.isClient) {

  Meteor.subscribe("dwellers");
  Meteor.subscribe("vaults");


  Template.body.helpers({

    selected_vault: function() {
      return Session.get("selected_vault");
    },

  });


  Template.vault_controls.helpers({
    vaults: function() {
      return Vaults.find({});
    },

    isSelectedVault: function(given_vault) {
      return given_vault === Session.get("selected_vault");
    },

  });


  Template.vault_controls.events({

    "change #select_vault": function(event) {
      Session.set(
        "selected_vault",
        $(event.target).find(":selected").text()
      );
    },

    "click #btn_new_vault": function (event) {
      event.preventDefault();

      $("#form_new_vault").removeClass("hide");

      $("#btn_new_vault").addClass("hide");
    },

    "click #btn_new_vault_cancel": function (event) {
      event.preventDefault();

      $("#form_new_vault").addClass("hide");

      $("#btn_new_vault").removeClass("hide");
    },

    "submit #form_new_vault": function (event) {
      event.preventDefault();

      var form = {};

      form.vault_id = $("#ipt_new_vault").val();
      form.owner = Meteor.userId();
      form.username = Meteor.user().username;
      form.createdAt = new Date();

      Meteor.call("add_vault", form);

      $("#form_new_vault").children().each(function() {
        this.value="";
      });

      $("#btn_new_vault_cancel").trigger("click");
    },

    "click .delete": function() {
      var target_vault = $("#select_vault :selected").val();

      var associated_dwellers = Dwellers.find(
        {vault: target_vault}
      );

      associated_dwellers.forEach(function() {
        Dwellers.remove(this._id);
      });

      Vaults.remove(
        Vaults.findOne(
          {vault_id: target_vault},
          {owner: Meteor.userId()}
        )._id
      );
    },

  });


  Template.dweller_controls.helpers({

    dwellers: function() {
      return Dwellers.find(
      {vault: Session.get("selected_vault")},
      {sort: {first_name: 1, last_name: 1}}
      );
    },

  });


  Template.dweller_controls.events({

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

      var form = {};

      form.owner = Meteor.userId();
      form.username = Meteor.user().username;
      form.vault = $("#select_vault :selected").val();
      form.type = $("#dweller_type").val();
      $.each($("#form_new_dweller").serializeArray(), function () {
        form[this.name] = this.value;
      });

      Dwellers.insert(form);

      $("#dweller_information").children().each(function() {
        $(this.value = "");
      });
    },

  });


  Template.dwellers_list.helpers({
    dwellers: function() {
      return Dwellers.find({
        vault: Session.get("selected_vault")
      });
    },

  });


  Template.dwellers_list.events({

    "click .delete": function() {
      Dwellers.remove(this._id);
    },

  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"

  });

}
