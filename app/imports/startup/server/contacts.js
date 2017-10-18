import { Contacts } from '../../api/contacts/contacts.js';
import { _ } from 'meteor/underscore';

/**
 * A list of Contacts to pre-fill the Collection.
 * @type {*[]}
 */
const contactsSeeds = [
  { first: 'Johnathan', last: 'Smith', address: '123 Somewhere St, Knomb OH',
    phonenumber: '808-123-4567', email: 'jsmith123@hawaii.edu' },
  { first: 'Tom', last: 'Green', address: '999 Sax Ave, New York NY',
    phonenumber: '808-999-4387', email: 'tomgreen@hawaii.edu' },
  { first: 'Mike', last: 'Flanders', address: '314 Pi Ln, Honolulu HI',
    phonenumber: '808-314-1592', email: 'pi@hawaii.edu' },
];

if (Contacts.find().count() === 0) {
  _.each(contactsSeeds, function seedStuffs(contact) {
    Contacts.insert(contact);
  });
}
