import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Contacts, ContactSchema } from '../../api/contacts/contacts.js';

const displayErrorMessages = 'displayErrorMessages';
const createContext = ContactSchema.namedContext('Add_Contact_Page');

Template.Add_Contact_Page.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = createContext;
});

Template.Add_Contact_Page.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});

Template.Add_Contact_Page.events({
  'submit .contact-data-form'(event, instance) {
    event.preventDefault();

    const first = event.target.First.value;
    const last = event.target.Last.value;
    const address = event.target.Address.value;
    const phonenumber = event.target['Phone Number'].value;
    const email = event.target.Email.value;
    const newContactData = { first, last, address, phonenumber, email };
    console.log(newContactData);
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be inserted.
    ContactSchema.clean(newContactData);
    // Determine validity.
    instance.context.validate(newContactData);
    if (instance.context.isValid()) {
      Contacts.insert(newContactData);
      instance.messageFlags.set(displayErrorMessages, false);
      FlowRouter.go('Home_Page');
    } else {
      console.log("failed");
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
