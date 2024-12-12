import React, { useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import styled, { createGlobalStyle } from "styled-components";
import contactsReducer, {
  addContact,
  removeContact,
  updateContact,
} from "./contactsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
  },
});

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    // display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Roboto, sans-serif;
    background-color: #f5f5f5;
  }
`;

const AppContainer = styled.div`
  input {
    margin-right: 8px;
    padding: 8px;
  }
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ContactItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px;
  margin-left: 8px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const Contacts: React.FC = () => {
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone) {
      dispatch(addContact({ id: Date.now(), name, email, phone }));
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  const handleEdit = (id: number) => {
    const contact = contacts.find((contact: Contact) => contact.id === id);
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone);
      setEditingId(id);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      dispatch(updateContact({ id: editingId, name, email, phone }));
      setName("");
      setEmail("");
      setPhone("");
      setEditingId(null);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(removeContact(id));
  };

  return (
    <div>
      <h1>Lista de Contatos</h1>
      <form onSubmit={editingId === null ? handleAdd : handleUpdate}>
        <input
          type="text"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {editingId === null ? (
          <Button onClick={handleAdd}>Adicionar</Button>
        ) : (
          <Button onClick={handleUpdate}>Atualizar</Button>
        )}
      </form>
      <ContactList>
        {contacts.map((contact: Contact) => (
          <ContactItem key={contact.id}>
            <span>
              {contact.name} - {contact.email} - {contact.phone}
            </span>
            <div>
              <Button onClick={() => handleEdit(contact.id)}>Editar</Button>
              <Button onClick={() => handleDelete(contact.id)}>Remover</Button>
            </div>
          </ContactItem>
        ))}
      </ContactList>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <AppContainer>
        <Contacts />
      </AppContainer>
    </Provider>
  );
};

export default App;
