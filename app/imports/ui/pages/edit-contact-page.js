import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { Contacts, ContactSchema } from '../../api/contacts/contacts.js';

/* eslint-disable object-shorthand, no-unused-vars, no-param-reassign */

const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Contact_Page.onCreated(function onCreated() {
  this.subscribe('Contacts');
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = ContactSchema.namedContext('Edit_ContactData_Page');
});

Template.Edit_Contact_Page.helpers({
  contactDataField(fieldName) {
    const contact = Contacts.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return contact && contact[fieldName];
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});

Template.Edit_Contact_Page.events({
  'submit .contact-data-form'(event, instance) {
    event.preventDefault();
    const first = event.target.First.value;
    const last = event.target.Last.value;
    const address = event.target.Address.value;
    const phonenumber = event.target['Phone Number'].value;
    const email = event.target.Email.value;
    const updatedContactData = { first, last, address, phonenumber, email };

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedContactData reflects what will be inserted.
    ContactSchema.clean(updatedContactData);
    // Determine validity.
    instance.context.validate(updatedContactData);

    if (instance.context.isValid()) {
      const id = Contacts.update(FlowRouter.getParam('_id'), { $set: updatedContactData });
      FlowRouter.go('Home_Page');
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

