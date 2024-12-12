import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface ContactsState {
  contacts: Contact[];
}

const initialState: ContactsState = {
  contacts: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact(state, action: PayloadAction<Contact>) {
      state.contacts.push(action.payload);
    },
    removeContact(state, action: PayloadAction<number>) {
      state.contacts = state.contacts.filter(
        (contact) => contact.id !== action.payload
      );
    },
    updateContact(state, action: PayloadAction<Contact>) {
      const index = state.contacts.findIndex(
        (contact) => contact.id === action.payload.id
      );
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
  },
});

export const { addContact, removeContact, updateContact } =
  contactsSlice.actions;
export default contactsSlice.reducer;
