import React, { useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import styled from "styled-components";
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

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  margin: 20px;
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
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Contacts: React.FC = () => {
  const contacts = useSelector((state: RootState) => state.contacts);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = () => {
    if (name && email && phone) {
      dispatch(addContact({ id: Date.now(), name, email, phone }));
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  const handleEdit = (id: number) => {
    const contact = contacts.find((contact) => contact.id === id);
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
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
      <div>
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
      </div>
      <ContactList>
        {contacts.map((contact) => (
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
      <AppContainer>
        <h1>Lista de Contatos</h1>
        <Contacts />
      </AppContainer>
    </Provider>
  );
};

export default App;
