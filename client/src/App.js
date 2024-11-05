import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Button, Header, Input, ListItem, List, Container } from 'semantic-ui-react';
import './App.css'; // Import the CSS file

function App() {
  const [value, setValue] = useState('');
  const [store, setStore] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  

  useEffect(()=>{
    axios.get("http://localhost:5000/api/items")
    .then(response=>setStore(response.data))
    .catch(error=>console.error("Error fetching items:",error));
  },[]);

  const addInArray = () => {
    if(value.trim()===""){
      return;
    }
    axios.post("http://localhost:5000/api/items",{name:value})
    .then(response=>{
      setStore([...store,response.data]);
      setValue('');
    })
    .catch(error=>console.error("Error adding item:",error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/items/${id}`)
    .then(()=>{
      setStore(store.filter(item=>item._id!==id));
    })
    .catch(error=>console.error('Error deleting item:',error))
  };

  const handleEdit = (id, name) => {
    console.log(id,name);
    setEditId(id);
    setEditValue(name);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/items/${editId}`,{name:editValue})
    .then(response=>{
      setStore(store.map(item=>item._id===editId?response.data:item));
      setEditId(null);
      setEditValue("");
    })
    .catch(error=>console.error('Error updating item:',error))
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="App">
      <Header as='h1' size='huge' content='CRUD APP' textAlign='center' />
      <Container>
        <div className="input-container">
          <Input
            placeholder='Add Employee'
            type='text'
            value={value}
            onChange={handleChange}
            className="input-field"
          />
          <Button type='submit' content='Enter' onClick={addInArray} className="enter-button" />
        </div>
        <List className="list-container">
          {store.map(item => (
            <ListItem key={item._id} className="list-item">
              {editId === item._id ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="edit-input"
                  />
                  <Button type='submit' onClick={handleUpdate} content='Update' className="update-button" />
                </>
              ) : (
                <>
                  <span className="item-name">{item.name}</span>
                  <Button
                    type='submit'
                    onClick={() => handleDelete(item._id)}
                    icon='trash'
                    className="icon-button"
                  />
                  <Button
                    type='submit'
                    onClick={() => handleEdit(item._id, item.name)}
                    icon='edit'
                    className="icon-button"
                  />
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
}

export default App;
